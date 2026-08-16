import { fulfillEbookOrder } from "../lib/ebook-fulfillment.mjs";
import { isValidPaidEbookTransaction, verifyPaystackTransaction } from "../lib/paystack.mjs";

const handler = async (request) => {
  if (request.method !== "GET") return new Response("Method not allowed", { status: 405 });

  const reference = new URL(request.url).searchParams.get("reference") || "";
  if (!/^[A-Za-z0-9.=-]{8,100}$/.test(reference)) {
    return Response.json({ status: "invalid", message: "The payment reference is invalid." }, { status: 400 });
  }

  try {
    const transaction = await verifyPaystackTransaction(reference);
    if (transaction.status !== "success") {
      return Response.json({ status: "pending", message: "Your payment has not been confirmed yet." }, { status: 202 });
    }
    if (!isValidPaidEbookTransaction(transaction)) {
      return Response.json({ status: "invalid", message: "The payment details could not be validated." }, { status: 400 });
    }

    try {
      await fulfillEbookOrder(transaction);
      return Response.json({ status: "success", delivered: true });
    } catch (deliveryError) {
      console.error("Verified payment delivery failed", deliveryError);
      return Response.json({ status: "paid", delivered: false }, { status: 202 });
    }
  } catch (error) {
    console.error("Payment verification failed", error);
    return Response.json({ status: "error", message: "We could not verify the payment right now." }, { status: 502 });
  }
};

export default handler;

export const config = { path: "/.netlify/functions/verify-ebook-payment" };
