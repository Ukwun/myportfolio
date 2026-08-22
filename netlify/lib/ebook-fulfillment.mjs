import { getStore } from "@netlify/blobs";
import { createHash, createHmac } from "node:crypto";
import { escapeHtml, formatNaira } from "./ebook-catalog.mjs";
import { getPaidEbook } from "./paystack.mjs";

function createAccessToken(reference) {
  const secret = process.env.EBOOK_ACCESS_SECRET || process.env.ADMIN_SESSION_SECRET || process.env.PAYSTACK_SECRET_KEY;
  if (!secret) throw new Error("Ebook access signing is not configured");
  const credential = createHmac("sha256", secret).update(`ebook-access:${reference}`).digest("base64url");
  const token = `${Buffer.from(reference).toString("base64url")}.${credential}`;
  return { token, tokenHash: createHash("sha256").update(token).digest("hex") };
}

export async function isEbookReady(ebook) {
  if (!process.env.PAYSTACK_SECRET_KEY || !process.env.RESEND_API_KEY || !process.env.EBOOK_FROM_EMAIL) return false;
  const files = getStore({ name: "ebook-files", consistency: "strong" });
  return Boolean(await files.getMetadata(ebook.fileKey));
}

export async function fulfillEbookOrder(transaction) {
  const ebook = getPaidEbook(transaction);
  if (!ebook) throw new Error("Paid ebook transaction is invalid");

  const reference = transaction.reference;
  const deliveries = getStore({ name: "ebook-deliveries", consistency: "strong" });
  const payments = getStore({ name: "ebook-payments", consistency: "strong" });
  const entitlements = getStore({ name: "ebook-entitlements", consistency: "strong" });
  const paymentRecord = {
    reference,
    ebookId: ebook.id,
    ebookTitle: ebook.title,
    customerName: transaction.metadata?.customer_name || "Reader",
    customerEmail: transaction.customer.email,
    amountNaira: Number(transaction.amount) / 100,
    currency: transaction.currency,
    paidAt: transaction.paid_at || transaction.paidAt || null,
    verifiedAt: new Date().toISOString(),
    deliveryStatus: "pending",
  };
  await payments.setJSON(reference, paymentRecord);
  const existing = await deliveries.get(reference, { type: "json" });
  const existingEntitlement = await entitlements.get(reference, { type: "json" });
  if (existing?.status === "delivered" && existingEntitlement?.tokenHash) {
    await payments.setJSON(reference, { ...paymentRecord, deliveryStatus: "delivered", deliveredAt: existing.deliveredAt });
    return { delivered: true, duplicate: true };
  }

  const resendApiKey = process.env.RESEND_API_KEY;
  if (!resendApiKey) throw new Error("Email delivery is not configured");

  const siteUrl = process.env.URL;
  if (!siteUrl) throw new Error("The public site URL is not configured");

  const { token, tokenHash } = createAccessToken(reference);
  await entitlements.setJSON(reference, {
    reference,
    tokenHash,
    ebookId: ebook.id,
    customerName: paymentRecord.customerName,
    customerEmail: paymentRecord.customerEmail,
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    downloadCount: 0,
    maxDownloads: 5,
  });
  const accessUrl = `${siteUrl.replace(/\/$/, "")}/.netlify/functions/ebook-access?token=${encodeURIComponent(token)}`;

  const email = transaction.customer.email;
  const customerName = transaction.metadata?.customer_name || "Reader";
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      "Content-Type": "application/json",
      "Idempotency-Key": `ebook-private-access-v2-${reference}`,
    },
    body: JSON.stringify({
      from: process.env.EBOOK_FROM_EMAIL || "John Solace <onboarding@resend.dev>",
      to: [email],
      reply_to: process.env.EBOOK_REPLY_TO || "ukwun97@gmail.com",
      subject: `Your copy of ${ebook.shortTitle}`,
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.65;color:#17191e;max-width:620px;margin:auto">
          <p>Hello ${escapeHtml(customerName)},</p>
          <h1 style="font-size:25px;line-height:1.25">Your private ebook access is ready.</h1>
          <p>Thank you for purchasing <strong>${escapeHtml(ebook.title)}</strong> for ${escapeHtml(formatNaira(Number(transaction.amount) / 100))}.</p>
          <p><a href="${escapeHtml(accessUrl)}" style="display:inline-block;background:#1d4ed8;color:#fff;text-decoration:none;padding:13px 20px;border-radius:999px;font-weight:700">Download my private copy</a></p>
          <p>This one-click link is licensed to you, remains available for one year, and allows up to five downloads. Your copy is personalized with your email and order reference, so please keep the link private.</p>
          <p>To your next high-value contract,<br><strong>John Solace</strong></p>
          <hr style="border:0;border-top:1px solid #e5e7eb;margin:28px 0">
          <p style="font-size:12px;color:#6b7280">Order reference: ${escapeHtml(reference)}</p>
        </div>
      `,
    }),
  });

  if (!response.ok) {
    const failure = await response.text();
    console.error("Ebook email failed", response.status, failure);
    throw new Error("Email delivery failed");
  }

  const emailResult = await response.json();
  await deliveries.setJSON(reference, {
    status: "delivered",
    ebookId: ebook.id,
    email,
    emailId: emailResult.id,
    deliveredAt: new Date().toISOString(),
  });
  await payments.setJSON(reference, { ...paymentRecord, deliveryStatus: "delivered", deliveredAt: new Date().toISOString(), emailId: emailResult.id });

  return { delivered: true, duplicate: false };
}
