import type { Metadata } from "next";
import { EbookStorefront } from "@/components/ebook-storefront";

export const metadata: Metadata = {
  title: "Ebooks | John Solace",
  description: "Practical ebooks on winning high-value clients, building trust, and delivering ambitious digital projects.",
};

export default function EbooksPage() {
  return (
    <main className="relative overflow-hidden">
      <div className="pointer-events-none absolute left-0 top-0 -z-10 h-[540px] w-[540px] rounded-full bg-[#4f8cff]/10 blur-[130px]" />
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10 lg:py-24">
        <div className="mb-12 max-w-3xl">
          <p className="text-sm uppercase tracking-[0.3em] text-[#d6b25e]">John Solace Library</p>
          <h1 className="mt-4 font-[family-name:var(--font-sora)] text-4xl font-semibold leading-tight text-white sm:text-5xl">
            Practical lessons from real business and product work.
          </h1>
          <p className="mt-5 text-lg leading-8 text-white/65">
            Focused digital guides for builders, consultants, and business owners who want stronger positioning, better clients, and more valuable work.
          </p>
        </div>
        <EbookStorefront />
      </section>
    </main>
  );
}
