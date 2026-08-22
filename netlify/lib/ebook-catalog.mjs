export const EBOOKS = [
  {
    id: "how-i-flipped-30k",
    title: "How I Flipped ₦30K into a ₦4 Million Contract",
    shortTitle: "How I Flipped ₦30K",
    coverSrc: "/ebooks/how-i-flipped-cover.webp",
    fileKey: "how-i-flipped-30k.pdf",
    deliveryFilename: "How-I-Flipped-30K-Into-A-4-Million-Naira-Contract.pdf",
    priceEnvKey: "EBOOK_PRICE_NAIRA",
    defaultPriceNaira: 5000,
  },
  {
    id: "one-skill-first-million",
    title: "How to Turn One Skill into Your First ₦1 Million",
    shortTitle: "The One-Skill Playbook",
    coverSrc: "/ebooks/one-skill-first-million-cover.webp",
    fileKey: "one-skill-first-million.pdf",
    deliveryFilename: "How-to-Turn-One-Skill-Into-Your-First-1-Million-Naira.pdf",
    priceEnvKey: "EBOOK_ONE_SKILL_PRICE_NAIRA",
    defaultPriceNaira: 5000,
  },
  {
    id: "lost-beijing-client",
    title: "How I Lost a $5,000 Client from Beijing, China",
    shortTitle: "The $5,000 Client I Lost",
    coverSrc: "/ebooks/lost-beijing-client-cover.webp",
    fileKey: "lost-beijing-client.pdf",
    deliveryFilename: "How-I-Lost-A-5000-Dollar-Client-From-Beijing.pdf",
    priceEnvKey: "EBOOK_BEIJING_PRICE_NAIRA",
    defaultPriceNaira: 5000,
  },
];

export const EBOOK = EBOOKS[0];

export function getEbookById(id) {
  return EBOOKS.find((ebook) => ebook.id === id);
}

export function getPriceNaira(ebook = EBOOK) {
  const configuredPrice = Number.parseInt(process.env[ebook.priceEnvKey] || "", 10);
  return Number.isFinite(configuredPrice) && configuredPrice >= 100 ? configuredPrice : ebook.defaultPriceNaira;
}

export function getPriceKobo(ebook = EBOOK) {
  return getPriceNaira(ebook) * 100;
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
