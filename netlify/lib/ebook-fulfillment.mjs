import { getStore } from "@netlify/blobs";
import { EBOOK, escapeHtml, formatNaira, getPriceNaira } from "./ebook-catalog.mjs";

export async function isEbookReady() {
  if (!process.env.PAYSTACK_SECRET_KEY || !process.env.RESEND_API_KEY || !process.env.EBOOK_FROM_EMAIL) return false;
  const files = getStore({ name: "ebook-files", consistency: "strong" });
  return Boolean(await files.getMetadata(EBOOK.fileKey));
}

export async function fulfillEbookOrder(transaction) {
  const reference = transaction.reference;
  const deliveries = getStore({ name: "ebook-deliveries", consistency: "strong" });
  const existing = await deliveries.get(reference, { type: "json" });
  if (existing?.status === "delivered") return { delivered: true, duplicate: true };

  const files = getStore({ name: "ebook-files", consistency: "strong" });
  const ebookFile = await files.get(EBOOK.fileKey, { type: "arrayBuffer" });
  if (!ebookFile) throw new Error("Private ebook file is missing");

  const resendApiKey = process.env.RESEND_API_KEY;
  if (!resendApiKey) throw new Error("Email delivery is not configured");

  const email = transaction.customer.email;
  const customerName = transaction.metadata?.customer_name || "Reader";
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      "Content-Type": "application/json",
      "Idempotency-Key": `ebook-delivery-${reference}`,
    },
    body: JSON.stringify({
      from: process.env.EBOOK_FROM_EMAIL || "John Solace <onboarding@resend.dev>",
      to: [email],
      reply_to: process.env.EBOOK_REPLY_TO || "solaceinterlude@gmail.com",
      subject: `Your copy of ${EBOOK.shortTitle}`,
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.65;color:#17191e;max-width:620px;margin:auto">
          <p>Hello ${escapeHtml(customerName)},</p>
          <h1 style="font-size:25px;line-height:1.25">Your ebook is ready.</h1>
          <p>Thank you for purchasing <strong>${escapeHtml(EBOOK.title)}</strong> for ${escapeHtml(formatNaira(getPriceNaira()))}.</p>
          <p>Your PDF is attached to this email. Save it somewhere secure so you can return to it whenever you need it.</p>
          <p>To your next high-value contract,<br><strong>John Solace</strong></p>
          <hr style="border:0;border-top:1px solid #e5e7eb;margin:28px 0">
          <p style="font-size:12px;color:#6b7280">Order reference: ${escapeHtml(reference)}</p>
        </div>
      `,
      attachments: [
        {
          filename: EBOOK.deliveryFilename,
          content: Buffer.from(ebookFile).toString("base64"),
        },
      ],
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
    ebookId: EBOOK.id,
    email,
    emailId: emailResult.id,
    deliveredAt: new Date().toISOString(),
  });

  return { delivered: true, duplicate: false };
}
