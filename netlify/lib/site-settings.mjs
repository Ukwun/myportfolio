import { getStore } from "@netlify/blobs";
import { EBOOKS, getPriceNaira } from "./ebook-catalog.mjs";

export const SERVICE_DEFINITIONS = [
  { id: "business-website", name: "Premium Business Website", defaultPriceNaira: 850000 },
  { id: "web-application", name: "Custom Web Application", defaultPriceNaira: 2000000 },
  { id: "mobile-app", name: "Mobile App Development", defaultPriceNaira: 3500000 },
  { id: "marketplace-saas", name: "Marketplace / SaaS Platform", defaultPriceNaira: 5000000 },
  { id: "real-estate-3d", name: "3D Real Estate Visualization", defaultPriceNaira: 2500000 },
  { id: "enterprise-system", name: "Enterprise Digital System", defaultPriceNaira: null },
];

export function getDefaultPricing() {
  return {
    ebooks: Object.fromEntries(EBOOKS.map((ebook) => [ebook.id, getPriceNaira(ebook)])),
    services: Object.fromEntries(SERVICE_DEFINITIONS.map((service) => [service.id, service.defaultPriceNaira])),
    updatedAt: null,
    updatedBy: null,
  };
}

function validPrice(value, allowNull = false) {
  if (allowNull && (value === null || value === "")) return null;
  const price = Number(value);
  return Number.isInteger(price) && price >= 100 ? price : undefined;
}

export async function getSitePricing() {
  const defaults = getDefaultPricing();
  try {
    const store = getStore({ name: "site-settings", consistency: "strong" });
    const stored = await store.get("pricing", { type: "json" });
    if (!stored) return defaults;
    return {
      ebooks: { ...defaults.ebooks, ...stored.ebooks },
      services: { ...defaults.services, ...stored.services },
      updatedAt: stored.updatedAt || null,
      updatedBy: stored.updatedBy || null,
    };
  } catch (error) {
    console.error("Unable to load live pricing", error);
    return defaults;
  }
}

export async function saveSitePricing(input, updatedBy) {
  const current = await getSitePricing();
  const ebooks = { ...current.ebooks };
  const services = { ...current.services };

  for (const ebook of EBOOKS) {
    const price = validPrice(input?.ebooks?.[ebook.id]);
    if (price !== undefined) ebooks[ebook.id] = price;
  }
  for (const service of SERVICE_DEFINITIONS) {
    const price = validPrice(input?.services?.[service.id], service.id === "enterprise-system");
    if (price !== undefined) services[service.id] = price;
  }

  const next = { ebooks, services, updatedAt: new Date().toISOString(), updatedBy };
  const store = getStore({ name: "site-settings", consistency: "strong" });
  await store.setJSON("pricing", next);
  return next;
}
