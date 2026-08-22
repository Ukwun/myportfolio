import { EBOOKS } from "../lib/ebook-catalog.mjs";
import { isEbookReady } from "../lib/ebook-fulfillment.mjs";
import { getSitePricing } from "../lib/site-settings.mjs";

const handler = async (request) => {
  if (request.method !== "GET") return new Response("Method not allowed", { status: 405 });

  const pricing = await getSitePricing();
  const ebooks = await Promise.all(EBOOKS.map(async (ebook) => {
    let available = false;
    try {
      available = await isEbookReady(ebook);
    } catch (error) {
      console.error(`Unable to check readiness for ${ebook.id}`, error);
    }
    return {
      id: ebook.id,
      title: ebook.title,
      priceNaira: pricing.ebooks[ebook.id],
      available,
    };
  }));

  return Response.json(
    {
      ebooks,
    },
    { headers: { "Cache-Control": "no-store" } },
  );
};

export default handler;

export const config = { path: "/.netlify/functions/ebook-store" };
