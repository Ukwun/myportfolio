import { getEbookById } from "./ebook-catalog.mjs";

export function getPaystackSecret() {
  return process.env.PAYSTACK_SECRET_KEY || "";
}

export async function verifyPaystackTransaction(reference) {
  const secretKey = getPaystackSecret();
  if (!secretKey) throw new Error("Paystack is not configured");

  const response = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
    headers: { Authorization: `Bearer ${secretKey}` },
  });
  const result = await response.json();
  if (!response.ok || !result.status || !result.data) throw new Error("Unable to verify payment");
  return result.data;
}

export function getPaidEbook(transaction) {
  const ebook = getEbookById(transaction?.metadata?.ebook_id);
  // Orders created before live pricing was introduced do not contain
  // price_kobo. Paystack's verified amount remains the source of truth for
  // those already-in-flight purchases.
  const checkoutAmount = Number(transaction?.metadata?.price_kobo ?? transaction?.amount);
  if (
    !ebook ||
    transaction?.status !== "success" ||
    transaction?.currency !== "NGN" ||
    !Number.isInteger(checkoutAmount) ||
    checkoutAmount < 10000 ||
    Number(transaction?.amount) !== checkoutAmount ||
    !transaction?.customer?.email
  ) {
    return null;
  }
  return ebook;
}

export function isValidPaidEbookTransaction(transaction) {
  return Boolean(getPaidEbook(transaction));
}
