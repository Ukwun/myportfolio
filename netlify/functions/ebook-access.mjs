import { createHash, timingSafeEqual } from "node:crypto";
import { getStore } from "@netlify/blobs";
import { degrees, PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { getEbookById } from "../lib/ebook-catalog.mjs";

function hashesMatch(received, expected) {
  return Boolean(received && expected && received.length === expected.length && timingSafeEqual(Buffer.from(received), Buffer.from(expected)));
}

function accessError(message, status) {
  return new Response(`<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Ebook access</title></head><body style="margin:0;background:#090909;color:#f5f5f5;font-family:Arial,sans-serif;display:grid;min-height:100vh;place-items:center"><main style="max-width:520px;padding:32px;text-align:center"><h1>Private ebook access</h1><p style="color:#b8b8b8;line-height:1.7">${message}</p><a href="/ebooks/" style="color:#8ab4ff">Return to the ebook library</a></main></body></html>`, { status, headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" } });
}

const handler = async (request) => {
  if (request.method !== "GET") return new Response("Method not allowed", { status: 405 });
  const token = new URL(request.url).searchParams.get("token") || "";
  const [encodedReference] = token.split(".");
  if (!encodedReference || token.length > 300) return accessError("This access link is invalid.", 400);

  let reference;
  try {
    reference = Buffer.from(encodedReference, "base64url").toString("utf8");
  } catch {
    return accessError("This access link is invalid.", 400);
  }
  if (!/^[A-Za-z0-9.=-]{8,100}$/.test(reference)) return accessError("This access link is invalid.", 400);

  const entitlements = getStore({ name: "ebook-entitlements", consistency: "strong" });
  const entitlement = await entitlements.get(reference, { type: "json" });
  const tokenHash = createHash("sha256").update(token).digest("hex");
  if (!entitlement || !hashesMatch(tokenHash, entitlement.tokenHash)) return accessError("This access link is invalid or has been replaced.", 401);
  if (new Date(entitlement.expiresAt).getTime() < Date.now()) return accessError("This access link has expired. Contact John with your order reference for help.", 410);
  if (Number(entitlement.downloadCount) >= Number(entitlement.maxDownloads)) return accessError("This link has reached its download limit. Contact John with your order reference if you need help.", 429);

  const ebook = getEbookById(entitlement.ebookId);
  if (!ebook) return accessError("The purchased ebook could not be found.", 404);
  const files = getStore({ name: "ebook-files", consistency: "strong" });
  const source = await files.get(ebook.fileKey, { type: "arrayBuffer" });
  if (!source) return accessError("The ebook file is temporarily unavailable. Please try again shortly.", 503);

  const document = await PDFDocument.load(source);
  const font = await document.embedFont(StandardFonts.Helvetica);
  const identity = `Licensed to ${entitlement.customerEmail} • Order ${reference}`;
  document.setTitle(ebook.title);
  document.setAuthor("John Solace");
  document.setSubject(`Licensed copy for ${entitlement.customerEmail}`);

  for (const page of document.getPages()) {
    const { width, height } = page.getSize();
    const footerSize = Math.max(5.5, Math.min(8, width / 95));
    page.drawRectangle({ x: 0, y: 0, width, height: 18, color: rgb(1, 1, 1), opacity: 0.82 });
    page.drawText(identity, { x: 12, y: 6, size: footerSize, font, color: rgb(0.2, 0.2, 0.2), opacity: 0.8, maxWidth: width - 24 });
    const watermarkSize = Math.max(16, Math.min(28, width / 22));
    const watermarkWidth = font.widthOfTextAtSize(entitlement.customerEmail, watermarkSize);
    page.drawText(entitlement.customerEmail, { x: Math.max(20, (width - watermarkWidth) / 2), y: height * 0.46, size: watermarkSize, font, color: rgb(0.2, 0.25, 0.35), opacity: 0.1, rotate: degrees(28) });
  }

  const pdf = await document.save();
  await entitlements.setJSON(reference, { ...entitlement, downloadCount: Number(entitlement.downloadCount) + 1, lastDownloadedAt: new Date().toISOString() });
  return new Response(pdf, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${ebook.deliveryFilename}"`,
      "Cache-Control": "private, no-store, max-age=0",
      "X-Content-Type-Options": "nosniff",
    },
  });
};

export default handler;
export const config = { path: "/.netlify/functions/ebook-access" };
