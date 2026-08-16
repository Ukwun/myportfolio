export const EBOOK = {
  id: "how-i-flipped-30k",
  title: "How I Flipped ₦30K into a ₦4 Million Contract",
  shortTitle: "How I Flipped ₦30K",
  fileKey: "how-i-flipped-30k.pdf",
  deliveryFilename: "How-I-Flipped-30K-Into-A-4-Million-Naira-Contract.pdf",
  defaultPriceNaira: 5000,
};

export function getPriceNaira() {
  const configuredPrice = Number.parseInt(process.env.EBOOK_PRICE_NAIRA || "", 10);
  return Number.isFinite(configuredPrice) && configuredPrice >= 100 ? configuredPrice : EBOOK.defaultPriceNaira;
}

export function getPriceKobo() {
  return getPriceNaira() * 100;
}

export function formatNaira(value) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(value);
}

export function escapeHtml(value = "") {
  return String(value).replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    '"': "&quot;",
  })[character]);
}
