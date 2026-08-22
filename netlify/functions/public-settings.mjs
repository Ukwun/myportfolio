import { EBOOKS } from "../lib/ebook-catalog.mjs";
import { SERVICE_DEFINITIONS, getSitePricing } from "../lib/site-settings.mjs";

const handler = async (request) => {
  if (request.method !== "GET") return new Response("Method not allowed", { status: 405 });
  const pricing = await getSitePricing();
  return Response.json({
    ebooks: EBOOKS.map((ebook) => ({ id: ebook.id, priceNaira: pricing.ebooks[ebook.id] })),
    services: SERVICE_DEFINITIONS.map((service) => ({ id: service.id, name: service.name, priceNaira: pricing.services[service.id] })),
    updatedAt: pricing.updatedAt,
  }, { headers: { "Cache-Control": "no-store" } });
};

export default handler;
export const config = { path: "/.netlify/functions/public-settings" };
