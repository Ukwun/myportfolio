import { randomBytes } from "node:crypto";
import { getStore } from "@netlify/blobs";
import { ADMIN_EMAIL } from "../lib/admin-auth.mjs";
import { escapeHtml, getEbookById } from "../lib/ebook-catalog.mjs";
import { isEbookReady } from "../lib/ebook-fulfillment.mjs";
import { getSitePricing } from "../lib/site-settings.mjs";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^[+\d][\d\s()-]{6,24}$/;

const handler = async (request) => {
  if (request.method !== "POST") return new Response("Method not allowed", { status: 405 });

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }

  const customerName = String(body.name || "").trim().slice(0, 100);
  const customerEmail = String(body.email || "").trim().toLowerCase().slice(0, 200);
  const customerPhone = String(body.phone || "").trim().slice(0, 30);
  const transferReference = String(body.transferReference || "").trim().slice(0, 100);
  const ebook = getEbookById(body.ebookId);
  if (customerName.length < 2 || !emailPattern.test(customerEmail) || !phonePattern.test(customerPhone) || !ebook) {
    return Response.json({ error: "Please provide a valid name, email address, and phone number." }, { status: 400 });
  }
  if (!(await isEbookReady(ebook))) {
    return Response.json({ error: "Ebook delivery is being configured. Please try again shortly." }, { status: 503 });
  }

  const pricing = await getSitePricing();
  const reference = `bank-${Date.now()}-${randomBytes(5).toString("hex")}`;
  const order = {
    reference,
    ebookId: ebook.id,
    ebookTitle: ebook.title,
    amountNaira: Number(pricing.ebooks[ebook.id]),
    customerName,
    customerEmail,
    customerPhone,
    transferReference: transferReference || null,
    status: "awaiting-verification",
    submittedAt: new Date().toISOString(),
  };
  const orders = getStore({ name: "bank-transfer-orders", consistency: "strong" });
  await orders.setJSON(reference, order);

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.EBOOK_FROM_EMAIL,
      to: [ADMIN_EMAIL],
      reply_to: customerEmail,
      subject: `Bank transfer awaiting verification: ${ebook.shortTitle}`,
      html: `<div style="font-family:Arial,sans-serif;line-height:1.6;color:#17191e;max-width:620px;margin:auto">
        <h1 style="font-size:24px">Ebook bank transfer submitted</h1>
        <p>Please check your GTBank account before sending this ebook.</p>
        <table style="border-collapse:collapse;width:100%"><tbody>
          <tr><td style="padding:8px;border-bottom:1px solid #e5e7eb">Buyer</td><td style="padding:8px;border-bottom:1px solid #e5e7eb">${escapeHtml(customerName)}</td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #e5e7eb">Email</td><td style="padding:8px;border-bottom:1px solid #e5e7eb">${escapeHtml(customerEmail)}</td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #e5e7eb">Phone</td><td style="padding:8px;border-bottom:1px solid #e5e7eb">${escapeHtml(customerPhone)}</td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #e5e7eb">Ebook</td><td style="padding:8px;border-bottom:1px solid #e5e7eb">${escapeHtml(ebook.title)}</td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #e5e7eb">Amount</td><td style="padding:8px;border-bottom:1px solid #e5e7eb">₦${Number(order.amountNaira).toLocaleString("en-NG")}</td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #e5e7eb">Transfer reference</td><td style="padding:8px;border-bottom:1px solid #e5e7eb">${escapeHtml(transferReference || "Not provided")}</td></tr>
        </tbody></table>
        <p style="margin-top:24px"><strong>Order reference:</strong> ${escapeHtml(reference)}</p>
        <p>Open your protected admin dashboard, confirm the payment, then select “Confirm &amp; send ebook.”</p>
      </div>`,
    }),
  });

  if (!response.ok) {
    console.error("Bank transfer notification email failed", response.status, await response.text());
    return Response.json({ received: true, reference, notificationSent: false }, { status: 202 });
  }

  return Response.json({ received: true, reference, notificationSent: true });
};

export default handler;
export const config = { path: "/.netlify/functions/bank-transfer-order" };
