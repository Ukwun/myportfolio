import type { Metadata } from "next";
import { EbookPaymentStatus } from "@/components/ebook-payment-status";

export const metadata: Metadata = {
  title: "Ebook Payment | John Solace",
  robots: { index: false, follow: false },
};

export default function EbookPaymentPage() {
  return (
    <main className="relative overflow-hidden px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
      <div className="pointer-events-none absolute left-1/2 top-1/3 -z-10 h-80 w-80 -translate-x-1/2 rounded-full bg-[#4f8cff]/12 blur-[110px]" />
      <EbookPaymentStatus />
    </main>
  );
}
