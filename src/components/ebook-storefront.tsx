"use client";

import Image from "next/image";
import { FormEvent, useEffect, useState } from "react";
import { ArrowRight, BookOpen, Check, CreditCard, Landmark, LoaderCircle, Mail, ShieldCheck } from "lucide-react";

const ebookId = "how-i-flipped-30k";
const defaultPrice = 5000;

function formatNaira(value: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(value);
}

export function EbookStorefront() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [price, setPrice] = useState(defaultPrice);
  const [storeState, setStoreState] = useState<"checking" | "available" | "unavailable">("checking");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    fetch("/.netlify/functions/ebook-store", { headers: { Accept: "application/json" } })
      .then(async (response) => {
        if (!response.ok) throw new Error("Store status unavailable");
        return response.json();
      })
      .then((result) => {
        if (!active) return;
        if (Number.isFinite(result.ebook?.priceNaira)) setPrice(result.ebook.priceNaira);
        setStoreState(result.ebook?.available ? "available" : "unavailable");
      })
      .catch(() => {
        if (active) setStoreState("unavailable");
      });
    return () => {
      active = false;
    };
  }, []);

  async function startCheckout(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const response = await fetch("/.netlify/functions/create-ebook-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ebookId, name, email }),
      });
      const result = await response.json();
      if (!response.ok || !result.checkoutUrl) throw new Error(result.error || "Unable to start checkout.");
      window.location.assign(result.checkoutUrl);
    } catch (checkoutError) {
      setError(checkoutError instanceof Error ? checkoutError.message : "Unable to start checkout.");
      setSubmitting(false);
    }
  }

  const canPurchase = storeState === "available" && !submitting;

  return (
    <div className="grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:items-start">
      <div className="lg:sticky lg:top-28">
        <div className="relative mx-auto max-w-[430px]">
          <div className="absolute -inset-6 -z-10 rounded-[3rem] bg-[radial-gradient(circle_at_center,_rgba(79,140,255,0.2),_transparent_62%)] blur-2xl" />
          <div className="overflow-hidden rounded-[1.7rem] border border-white/12 bg-[#111111]/80 p-2 shadow-[0_30px_100px_rgba(0,0,0,0.48)]">
            <Image
              src="/ebooks/how-i-flipped-cover.webp"
              alt="Cover of How I Flipped 30K into a 4 Million Naira Contract by John Solace"
              width={848}
              height={1264}
              priority
              className="h-auto w-full rounded-[1.25rem]"
            />
          </div>
        </div>
      </div>

      <div className="rounded-[2rem] border border-white/10 bg-[#111111]/78 p-6 shadow-[0_24px_90px_rgba(0,0,0,0.3)] sm:p-8 lg:p-10">
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-full border border-[#d6b25e]/25 bg-[#d6b25e]/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#d6b25e]">
            Digital ebook
          </span>
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/55">Instant email delivery</span>
        </div>

        <h1 className="mt-6 font-[family-name:var(--font-sora)] text-4xl font-semibold leading-[1.08] text-white sm:text-5xl">
          How I Flipped ₦30K into a ₦4 Million Contract
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-white/68">
          A practical account of the positioning, relationship-building, proposal strategy, and execution mindset behind turning a small opportunity into a high-value contract.
        </p>

        <div className="mt-7 flex items-end gap-3 border-y border-white/8 py-6">
          <p className="font-[family-name:var(--font-sora)] text-4xl font-semibold text-white">{formatNaira(price)}</p>
          <p className="pb-1 text-sm text-white/42">one-time payment</p>
        </div>

        <div className="mt-7 grid gap-3 sm:grid-cols-2">
          {[
            "How to position yourself for larger opportunities",
            "Turning early conversations into commercial trust",
            "Structuring proposals around business value",
            "Lessons from delivering a large-scale engagement",
          ].map((item) => (
            <div key={item} className="flex items-start gap-3 rounded-2xl border border-white/8 bg-white/[0.035] p-4">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#4f8cff]/12 text-[#7cabff]">
                <Check size={13} aria-hidden="true" />
              </span>
              <p className="text-sm leading-6 text-white/68">{item}</p>
            </div>
          ))}
        </div>

        <form onSubmit={startCheckout} className="mt-8 rounded-[1.5rem] border border-white/10 bg-black/20 p-5 sm:p-6">
          <div className="mb-5 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#d6b25e]/10 text-[#d6b25e]">
              <BookOpen size={18} aria-hidden="true" />
            </span>
            <div>
              <h2 className="font-semibold text-white">Get your copy</h2>
              <p className="text-sm text-white/45">Enter the email where the PDF should be delivered.</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm text-white/65">
              Full name
              <input
                type="text"
                required
                minLength={2}
                autoComplete="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Your name"
                className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-white outline-none placeholder:text-white/28 focus:border-[#4f8cff]/45"
              />
            </label>
            <label className="text-sm text-white/65">
              Delivery email
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-white outline-none placeholder:text-white/28 focus:border-[#4f8cff]/45"
              />
            </label>
          </div>

          {error ? <p role="alert" className="mt-4 rounded-xl border border-red-400/20 bg-red-400/8 px-4 py-3 text-sm text-red-200">{error}</p> : null}

          <button type="submit" disabled={!canPurchase} className="btn-primary group mt-5 w-full disabled:cursor-not-allowed disabled:opacity-45">
            {submitting ? (
              <><LoaderCircle size={16} className="animate-spin" /> Opening secure checkout</>
            ) : storeState === "checking" ? (
              <><LoaderCircle size={16} className="animate-spin" /> Checking availability</>
            ) : storeState === "unavailable" ? (
              "Purchasing opens shortly"
            ) : (
              <>Buy securely for {formatNaira(price)} <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" /></>
            )}
          </button>

          {storeState === "unavailable" ? (
            <p className="mt-3 text-center text-xs leading-5 text-white/38">Secure payment and delivery are being configured. Please check back shortly.</p>
          ) : null}
        </form>

        <div className="mt-6 grid gap-3 text-sm text-white/50 sm:grid-cols-3">
          <div className="flex items-center gap-2"><CreditCard size={15} className="text-[#7cabff]" /> Paystack checkout</div>
          <div className="flex items-center gap-2"><Landmark size={15} className="text-[#7cabff]" /> Bank transfer</div>
          <div className="flex items-center gap-2"><Mail size={15} className="text-[#7cabff]" /> Email delivery</div>
        </div>
        <div className="mt-4 flex items-start gap-2 text-xs leading-5 text-white/36">
          <ShieldCheck size={14} className="mt-0.5 shrink-0 text-[#d6b25e]" />
          Payment details are handled securely by Paystack. The ebook is delivered only after server-side payment verification.
        </div>
      </div>
    </div>
  );
}
