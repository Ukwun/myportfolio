import { EBOOK, getPriceKobo } from "./ebook-catalog.mjs";

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

export function isValidPaidEbookTransaction(transaction) {
  return (
    transaction?.status === "success" &&
    transaction?.currency === "NGN" &&
    Number(transaction?.amount) === getPriceKobo() &&
    transaction?.metadata?.ebook_id === EBOOK.id &&
    transaction?.customer?.email
  );
}
