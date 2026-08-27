"use client";

import Link from "next/link";
import { ArrowLeft, Landmark, Mail } from "lucide-react";

export function EbookPaymentStatus() {
  return (
    <div className="mx-auto max-w-xl rounded-[2rem] border border-white/10 bg-[#111111]/82 p-7 text-center shadow-[0_28px_90px_rgba(0,0,0,0.38)] sm:p-10">
      <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-white/5"><Landmark size={28} className="text-[#d6b25e]" /></span>
      <h1 className="mt-6 text-3xl font-semibold text-white">Bank transfer ebook orders</h1>
      <p className="mt-4 leading-8 text-white/62">Transfer notices are checked manually before a private ebook link is sent. Return to the ebook library to begin your order.</p>
      <p className="mt-4 flex items-center justify-center gap-2 text-sm text-white/45"><Mail size={15} /> Your approved ebook arrives by email.</p>
      <Link href="/ebooks" className="btn-secondary mt-7">
        <ArrowLeft size={15} /> Back to ebooks
      </Link>
    </div>
  );
}
