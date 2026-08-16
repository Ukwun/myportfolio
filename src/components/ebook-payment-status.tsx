"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, CheckCircle2, LoaderCircle, Mail, TriangleAlert } from "lucide-react";

type PaymentState = "checking" | "success" | "paid" | "pending" | "error";

export function EbookPaymentStatus() {
  const [state, setState] = useState<PaymentState>("checking");

  useEffect(() => {
    const reference = new URLSearchParams(window.location.search).get("reference");
    if (!reference) {
      queueMicrotask(() => setState("error"));
      return;
    }

    fetch(`/.netlify/functions/verify-ebook-payment?reference=${encodeURIComponent(reference)}`)
      .then(async (response) => {
        const result = await response.json();
        if (result.status === "success") setState("success");
        else if (result.status === "paid") setState("paid");
        else if (result.status === "pending") setState("pending");
        else setState("error");
      })
      .catch(() => setState("error"));
  }, []);

  const content = {
    checking: {
      icon: <LoaderCircle size={28} className="animate-spin text-[#7cabff]" />,
      title: "Confirming your payment",
      message: "Please keep this page open while we securely verify the transaction.",
    },
    success: {
      icon: <CheckCircle2 size={28} className="text-emerald-300" />,
      title: "Your ebook is on its way",
      message: "Payment confirmed. Check your inbox—and your spam or promotions folder—for the PDF delivery email.",
    },
    paid: {
      icon: <Mail size={28} className="text-[#d6b25e]" />,
      title: "Payment confirmed",
      message: "Your payment is complete and delivery is being retried. If the email does not arrive shortly, contact John with your payment reference.",
    },
    pending: {
      icon: <LoaderCircle size={28} className="text-[#d6b25e]" />,
      title: "Payment is still processing",
      message: "Bank transfers can take a moment to confirm. You will receive the ebook automatically as soon as Paystack confirms payment.",
    },
    error: {
      icon: <TriangleAlert size={28} className="text-amber-300" />,
      title: "We could not confirm the payment",
      message: "No ebook has been released. If you were charged, contact John with your Paystack reference so the transaction can be checked.",
    },
  }[state];

  return (
    <div className="mx-auto max-w-xl rounded-[2rem] border border-white/10 bg-[#111111]/82 p-7 text-center shadow-[0_28px_90px_rgba(0,0,0,0.38)] sm:p-10">
      <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-white/5">{content.icon}</span>
      <h1 className="mt-6 text-3xl font-semibold text-white">{content.title}</h1>
      <p className="mt-4 leading-8 text-white/62">{content.message}</p>
      <Link href="/ebooks" className="btn-secondary mt-7">
        <ArrowLeft size={15} /> Back to ebooks
      </Link>
    </div>
  );
}
