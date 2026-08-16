import { createHmac, timingSafeEqual } from "node:crypto";
import { fulfillEbookOrder } from "../lib/ebook-fulfillment.mjs";
import { getPaystackSecret, isValidPaidEbookTransaction } from "../lib/paystack.mjs";

function signaturesMatch(receivedSignature, expectedSignature) {
  if (!receivedSignature || receivedSignature.length !== expectedSignature.length) return false;
  return timingSafeEqual(Buffer.from(receivedSignature), Buffer.from(expectedSignature));
}

const handler = async (request) => {
  if (request.method !== "POST") return new Response("Method not allowed", { status: 405 });

  const secretKey = getPaystackSecret();
  if (!secretKey) return new Response("Webhook unavailable", { status: 503 });

  const rawBody = await request.text();
  const expectedSignature = createHmac("sha512", secretKey).update(rawBody).digest("hex");
  if (!signaturesMatch(request.headers.get("x-paystack-signature"), expectedSignature)) {
    return new Response("Invalid signature", { status: 401 });
  }

  const event = JSON.parse(rawBody);
  if (event.event !== "charge.success" || !isValidPaidEbookTransaction(event.data)) {
    return new Response("Ignored", { status: 200 });
  }

  try {
    await fulfillEbookOrder(event.data);
    return new Response("Delivered", { status: 200 });
  } catch (error) {
    console.error("Webhook fulfillment failed", error);
    return new Response("Fulfillment failed", { status: 500 });
  }
};

export default handler;

export const config = { path: "/.netlify/functions/paystack-webhook" };
