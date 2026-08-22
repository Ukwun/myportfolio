import { randomBytes } from "node:crypto";
import { getEbookById } from "../lib/ebook-catalog.mjs";
import { isEbookReady } from "../lib/ebook-fulfillment.mjs";
import { getPaystackSecret } from "../lib/paystack.mjs";
import { getSitePricing } from "../lib/site-settings.mjs";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const handler = async (request) => {
  if (request.method !== "POST") return new Response("Method not allowed", { status: 405 });

  let order;
  try {
    order = await request.json();
  } catch {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }

  const name = String(order.name || "").trim().slice(0, 100);
  const email = String(order.email || "").trim().toLowerCase().slice(0, 200);
  const ebook = getEbookById(order.ebookId);
  if (name.length < 2 || !emailPattern.test(email) || !ebook) {
    return Response.json({ error: "Please provide a valid name and email address." }, { status: 400 });
  }

  const secretKey = getPaystackSecret();
  if (!secretKey || !(await isEbookReady(ebook))) {
    return Response.json({ error: "Purchasing is being configured. Please try again shortly." }, { status: 503 });
  }

  const reference = `ebook-${Date.now()}-${randomBytes(5).toString("hex")}`;
  const siteUrl = process.env.URL || new URL(request.url).origin;
  const pricing = await getSitePricing();
  const priceKobo = Number(pricing.ebooks[ebook.id]) * 100;
  const response = await fetch("https://api.paystack.co/transaction/initialize", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secretKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      amount: String(priceKobo),
      currency: "NGN",
      reference,
      callback_url: `${siteUrl.replace(/\/$/, "")}/ebooks/success/`,
      channels: ["card", "bank_transfer", "bank", "ussd"],
      metadata: {
        ebook_id: ebook.id,
        price_kobo: priceKobo,
        customer_name: name,
        cancel_action: `${siteUrl.replace(/\/$/, "")}/ebooks/`,
      },
    }),
  });

  const result = await response.json();
  if (!response.ok || !result.status || !result.data?.authorization_url) {
    console.error("Paystack initialization failed", result);
    return Response.json({ error: "Unable to start payment. Please try again." }, { status: 502 });
  }

  return Response.json({ checkoutUrl: result.data.authorization_url, reference });
};

export default handler;

export const config = { path: "/.netlify/functions/create-ebook-order" };
