"use client";

import Image from "next/image";
import { FormEvent, useEffect, useState } from "react";
import { ArrowRight, BookOpen, Check, CreditCard, Landmark, LoaderCircle, Mail, ShieldCheck } from "lucide-react";

type Ebook = {
  id: string;
  title: string;
  shortTitle: string;
  coverSrc: string;
  coverWidth: number;
  coverHeight: number;
  description: string;
  highlights: string[];
  priceNaira: number;
  available: boolean | null;
};

const initialEbooks: Ebook[] = [
  {
    id: "how-i-flipped-30k",
    title: "How I Flipped ₦30K into a ₦4 Million Contract",
    shortTitle: "From ₦30K to ₦4 Million",
    coverSrc: "/ebooks/how-i-flipped-cover.webp",
    coverWidth: 848,
    coverHeight: 1264,
    description: "A practical account of the positioning, relationship-building, proposal strategy, and execution mindset behind turning a small opportunity into a high-value contract.",
    highlights: [
      "Position yourself for larger opportunities",
      "Turn early conversations into commercial trust",
      "Structure proposals around business value",
      "Deliver a large-scale engagement professionally",
    ],
    priceNaira: 5000,
    available: null,
  },
  {
    id: "one-skill-first-million",
    title: "How to Turn One Skill into Your First ₦1 Million",
    shortTitle: "The One-Skill Playbook",
    coverSrc: "/ebooks/one-skill-first-million-cover.webp",
    coverWidth: 848,
    coverHeight: 1264,
    description: "A practical 15-page playbook for treating one useful skill like a business—building attention, finding clients, pricing your work, reinvesting, and executing consistently.",
    highlights: [
      "Turn one useful skill into a clear offer",
      "Build visibility with the 30-day attention challenge",
      "Break your first ₦1 million into achievable sales",
      "Use outreach scripts, SLAY content, and a one-page plan",
    ],
    priceNaira: 5000,
    available: null,
  },
  {
    id: "lost-beijing-client",
    title: "How I Lost a $5,000 Client from Beijing, China",
    shortTitle: "The $5,000 Client I Lost",
    coverSrc: "/ebooks/lost-beijing-client-cover.webp",
    coverWidth: 768,
    coverHeight: 1376,
    description: "A candid 15-page story about losing an international client—and turning the experience into better testing, clearer communication, stronger handovers, and safer delivery systems.",
    highlights: [
      "Test products with the six-step Stranger Test",
      "Clarify requirements across languages and time zones",
      "Avoid rushing through the final ten percent",
      "Use completion checklists and project post-mortems",
    ],
    priceNaira: 5000,
    available: null,
  },
];

function formatNaira(value: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(value);
}

export function EbookStorefront() {
  const [ebooks, setEbooks] = useState(initialEbooks);
  const [selectedId, setSelectedId] = useState(initialEbooks[0].id);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
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
        setEbooks((current) => current.map((ebook) => {
          const liveEbook = result.ebooks?.find((item: { id?: string }) => item.id === ebook.id);
          return liveEbook
            ? { ...ebook, priceNaira: Number(liveEbook.priceNaira) || ebook.priceNaira, available: Boolean(liveEbook.available) }
            : { ...ebook, available: false };
        }));
      })
      .catch(() => {
        if (active) setEbooks((current) => current.map((ebook) => ({ ...ebook, available: false })));
      });
    return () => {
      active = false;
    };
  }, []);

  const selectedEbook = ebooks.find((ebook) => ebook.id === selectedId) || ebooks[0];
  const storeState = selectedEbook.available === null ? "checking" : selectedEbook.available ? "available" : "unavailable";

  function chooseEbook(id: string, scroll = false) {
    setSelectedId(id);
    setError("");
    if (scroll) requestAnimationFrame(() => document.getElementById("ebook-checkout")?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }

  async function startCheckout(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const response = await fetch("/.netlify/functions/create-ebook-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ebookId: selectedEbook.id, name, email }),
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
    <div>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {ebooks.map((ebook, index) => {
          const selected = ebook.id === selectedId;
          return (
            <article key={ebook.id} className={`group flex flex-col overflow-hidden rounded-[1.75rem] border bg-[#111111]/78 shadow-[0_24px_70px_rgba(0,0,0,0.28)] transition ${selected ? "border-[#d6b25e]/50" : "border-white/10 hover:-translate-y-1 hover:border-white/20"}`}>
              <button type="button" aria-pressed={selected} onClick={() => chooseEbook(ebook.id)} className="relative flex min-h-[420px] items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(79,140,255,0.14),_transparent_58%)] p-5 text-left sm:min-h-[480px]">
                <Image
                  src={ebook.coverSrc}
                  alt={`Cover of ${ebook.title} by John Solace`}
                  width={ebook.coverWidth}
                  height={ebook.coverHeight}
                  priority={index === 0}
                  className="max-h-[440px] w-auto max-w-full rounded-xl object-contain shadow-[0_24px_55px_rgba(0,0,0,0.45)] transition duration-500 group-hover:scale-[1.02]"
                />
              </button>
              <div className="flex flex-1 flex-col p-6">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#d6b25e]">Digital ebook</span>
                  <span className="text-xs text-white/42">Private email access</span>
                </div>
                <h2 className="mt-4 text-xl font-semibold leading-7 text-white">{ebook.title}</h2>
                <p className="mt-3 line-clamp-3 text-sm leading-6 text-white/55">{ebook.description}</p>
                <div className="mt-auto flex items-center justify-between gap-4 pt-6">
                  <p className="text-2xl font-semibold text-white">{formatNaira(ebook.priceNaira)}</p>
                  <button type="button" onClick={() => chooseEbook(ebook.id, true)} className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/6 px-4 py-2.5 text-sm font-medium text-white transition hover:border-[#4f8cff]/45 hover:bg-[#4f8cff]/10">
                    View & buy <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <section id="ebook-checkout" className="scroll-mt-28 pt-14 lg:pt-20">
        <div className="grid gap-8 rounded-[2rem] border border-white/10 bg-[#111111]/82 p-6 shadow-[0_28px_100px_rgba(0,0,0,0.34)] sm:p-8 lg:grid-cols-[0.9fr_1.1fr] lg:p-10">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-[#d6b25e]/25 bg-[#d6b25e]/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#d6b25e]">Selected ebook</span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/55">Private email access</span>
            </div>
            <h2 className="mt-5 font-[family-name:var(--font-sora)] text-3xl font-semibold leading-tight text-white sm:text-4xl">{selectedEbook.title}</h2>
            <p className="mt-4 leading-7 text-white/62">{selectedEbook.description}</p>
            <div className="mt-6 flex items-end gap-3 border-y border-white/8 py-5">
              <p className="font-[family-name:var(--font-sora)] text-4xl font-semibold text-white">{formatNaira(selectedEbook.priceNaira)}</p>
              <p className="pb-1 text-sm text-white/42">one-time payment</p>
            </div>
            <div className="mt-6 grid gap-3">
              {selectedEbook.highlights.map((item) => (
                <div key={item} className="flex items-start gap-3 rounded-2xl border border-white/8 bg-white/[0.035] p-4">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#4f8cff]/12 text-[#7cabff]"><Check size={13} aria-hidden="true" /></span>
                  <p className="text-sm leading-6 text-white/68">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <form onSubmit={startCheckout} className="rounded-[1.5rem] border border-white/10 bg-black/20 p-5 sm:p-6">
              <div className="mb-5 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#d6b25e]/10 text-[#d6b25e]"><BookOpen size={18} aria-hidden="true" /></span>
                <div>
                  <h3 className="font-semibold text-white">Get your copy</h3>
                  <p className="text-sm text-white/45">A private, limited access link will be delivered to this email.</p>
                </div>
              </div>

              <div className="grid gap-4">
                <label className="text-sm text-white/65">Full name
                  <input type="text" required minLength={2} autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} placeholder="Your name" className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-white outline-none placeholder:text-white/28 focus:border-[#4f8cff]/45" />
                </label>
                <label className="text-sm text-white/65">Delivery email
                  <input type="email" required autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-white outline-none placeholder:text-white/28 focus:border-[#4f8cff]/45" />
                </label>
              </div>

              {error ? <p role="alert" className="mt-4 rounded-xl border border-red-400/20 bg-red-400/8 px-4 py-3 text-sm text-red-200">{error}</p> : null}

              <button type="submit" disabled={!canPurchase} className="btn-primary group mt-5 w-full disabled:cursor-not-allowed disabled:opacity-45">
                {submitting ? <><LoaderCircle size={16} className="animate-spin" /> Opening secure checkout</> :
                  storeState === "checking" ? <><LoaderCircle size={16} className="animate-spin" /> Checking availability</> :
                    storeState === "unavailable" ? "Purchasing opens shortly" :
                      <>Buy securely for {formatNaira(selectedEbook.priceNaira)} <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" /></>}
              </button>

              {storeState === "unavailable" ? <p className="mt-3 text-center text-xs leading-5 text-white/38">Secure payment and delivery for this title are being configured. Please check back shortly.</p> : null}
            </form>

            <div className="mt-6 grid gap-3 text-sm text-white/50 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
              <div className="flex items-center gap-2"><CreditCard size={15} className="text-[#7cabff]" /> Paystack checkout</div>
              <div className="flex items-center gap-2"><Landmark size={15} className="text-[#7cabff]" /> Bank transfer</div>
              <div className="flex items-center gap-2"><Mail size={15} className="text-[#7cabff]" /> Email delivery</div>
            </div>
            <div className="mt-4 flex items-start gap-2 text-xs leading-5 text-white/36">
              <ShieldCheck size={14} className="mt-0.5 shrink-0 text-[#d6b25e]" />
              Payment details are handled securely by Paystack. Each paid copy is privately delivered and personalized to its buyer.
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
