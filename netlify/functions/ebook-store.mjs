import { EBOOK, getPriceNaira } from "../lib/ebook-catalog.mjs";
import { isEbookReady } from "../lib/ebook-fulfillment.mjs";

const handler = async (request) => {
  if (request.method !== "GET") return new Response("Method not allowed", { status: 405 });

  let available = false;
  try {
    available = await isEbookReady();
  } catch (error) {
    console.error("Unable to check ebook readiness", error);
  }

  return Response.json(
    {
      ebook: {
        id: EBOOK.id,
        title: EBOOK.title,
        priceNaira: getPriceNaira(),
        available,
      },
    },
    { headers: { "Cache-Control": "no-store" } },
  );
};

export default handler;

export const config = { path: "/.netlify/functions/ebook-store" };
