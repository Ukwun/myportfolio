import { getStore } from "@netlify/blobs";
import { getAdminEmail } from "../lib/admin-auth.mjs";
import { EBOOKS } from "../lib/ebook-catalog.mjs";
import { fulfillEbookOrder } from "../lib/ebook-fulfillment.mjs";
import { isValidPaidEbookTransaction, verifyPaystackTransaction } from "../lib/paystack.mjs";
import { SERVICE_DEFINITIONS, getSitePricing, saveSitePricing } from "../lib/site-settings.mjs";

async function listRecords(storeName, limit = 100) {
  try {
    const store = getStore({ name: storeName, consistency: "strong" });
    const result = await store.list({ paginate: true });
    const records = await Promise.all((result.blobs || []).slice(-limit).map((blob) => store.get(blob.key, { type: "json" })));
    return records.filter(Boolean).sort((a, b) => String(b.submittedAt || b.verifiedAt || b.paidAt || "").localeCompare(String(a.submittedAt || a.verifiedAt || a.paidAt || "")));
  } catch (error) {
    console.error(`Unable to load ${storeName}`, error);
    return [];
  }
}

const handler = async (request) => {
  const adminEmail = getAdminEmail(request);
  if (!adminEmail) return Response.json({ error: "Unauthorized" }, { status: 401 });

  if (request.method === "GET") {
    const [pricing, payments, leads, entitlements] = await Promise.all([
      getSitePricing(),
      listRecords("ebook-payments"),
      listRecords("portfolio-leads"),
      listRecords("ebook-entitlements"),
    ]);
    const entitlementByReference = new Map(entitlements.map((entitlement) => [entitlement.reference, entitlement]));
    const monitoredPayments = payments.map((payment) => {
      const entitlement = entitlementByReference.get(payment.reference);
      return { ...payment, downloadCount: entitlement?.downloadCount || 0, maxDownloads: entitlement?.maxDownloads || 0, accessExpiresAt: entitlement?.expiresAt || null };
    });
    return Response.json({ adminEmail, pricing, payments: monitoredPayments, leads, ebooks: EBOOKS.map(({ id, title }) => ({ id, title })), services: SERVICE_DEFINITIONS });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }

  if (request.method === "PATCH" && body.action === "update-pricing") {
    const pricing = await saveSitePricing(body.pricing, adminEmail);
    return Response.json({ saved: true, pricing });
  }

  if (request.method === "POST" && body.action === "verify-payment") {
    const reference = String(body.reference || "");
    if (!/^[A-Za-z0-9.=-]{8,100}$/.test(reference)) return Response.json({ error: "Invalid payment reference" }, { status: 400 });
    const transaction = await verifyPaystackTransaction(reference);
    if (!isValidPaidEbookTransaction(transaction)) return Response.json({ error: "Paystack has not confirmed a valid ebook payment." }, { status: 409 });
    const delivery = await fulfillEbookOrder(transaction);
    return Response.json({ verified: true, delivery });
  }

  return Response.json({ error: "Unsupported action" }, { status: 400 });
};

export default handler;
export const config = { path: "/.netlify/functions/admin-dashboard" };
