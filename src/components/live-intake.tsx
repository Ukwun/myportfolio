"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Bot, CheckCircle2, Sparkles } from "lucide-react";
import {
  getProfileHeadline,
  readVisitorActivity,
  readVisitorProfile,
  recordVisitorActivity,
  saveVisitorProfile,
  type VisitorFocus,
} from "@/lib/personalization";

const focusOptions: Array<{ value: VisitorFocus | ""; label: string }> = [
  { value: "", label: "What do you need most right now?" },
  { value: "website", label: "A premium website" },
  { value: "platform", label: "A custom platform" },
  { value: "mobile", label: "A mobile product" },
  { value: "growth", label: "Growth and conversion support" },
];

export function LiveIntake() {
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [focus, setFocus] = useState<VisitorFocus | "">("");
  const [ready, setReady] = useState(false);
  const [activity, setActivity] = useState<Array<{ id: string; event: string; detail: string; timestamp: string }>>([]);
  const [submitState, setSubmitState] = useState<"idle" | "sending" | "sent" | "error">("idle");

  useEffect(() => {
    const profile = readVisitorProfile();
    setName(profile.name);
    setCompany(profile.company);
    setEmail(profile.email);
    setPhone(profile.phone);
    setFocus(profile.focus as VisitorFocus | "");
    setActivity(readVisitorActivity());
  }, []);

  const headline = useMemo(() => {
    const profile = readVisitorProfile();
    return getProfileHeadline(profile);
  }, [ready, name, company, email, phone, focus]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitState("sending");
    const nextProfile = saveVisitorProfile({
      ...readVisitorProfile(),
      name,
      company,
      email,
      phone,
      focus: focus || "",
    });
    recordVisitorActivity("lead-captured", `${company || email} selected ${focus || "a direction"}`);
    setActivity(readVisitorActivity());
    setReady(Boolean(name || company || focus));
    if (nextProfile.name || nextProfile.company || nextProfile.focus) {
      setReady(true);
    }

    const lead = { name, company, email, phone, focus, source: "Live visitor intelligence", submittedAt: new Date().toISOString() };
    const netlifyPayload = new URLSearchParams({ "form-name": "visitor-intelligence", ...lead });

    try {
      const results = await Promise.allSettled([
        fetch("/", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: netlifyPayload.toString() }),
        fetch("/.netlify/functions/lead-alert", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(lead) }),
      ]);
      const stored = results[0].status === "fulfilled" && results[0].value.ok;
      setSubmitState(stored ? "sent" : "error");
      if (stored) window.dispatchEvent(new CustomEvent("portfolio:lead", { detail: { focus } }));
    } catch {
      setSubmitState("error");
    }
  }

  return (
    <section className="mx-auto mt-10 max-w-7xl px-5 sm:px-8 lg:px-10">
      <div className="rounded-[2rem] border border-[#d6b25e]/20 bg-[linear-gradient(135deg,_rgba(17,17,17,0.96),_rgba(29,29,29,0.92))] p-6 shadow-[0_30px_120px_rgba(0,0,0,0.35)] sm:p-8 lg:p-10">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#4f8cff]/20 bg-[#4f8cff]/10 px-3 py-2 text-sm text-[#4f8cff]">
              <Bot size={15} /> Live visitor intelligence
            </div>
            <h2 className="mt-5 text-3xl font-semibold text-white sm:text-4xl">The experience becomes more personal as visitors interact with the site.</h2>
            <p className="mt-4 text-lg leading-8 text-white/70">This layer captures intent, remembers preferences, and helps every next step feel more relevant and live.</p>
            <div className="mt-6 rounded-[1.35rem] border border-white/10 bg-white/5 p-4">
              <div className="flex items-center gap-2 text-sm text-[#d6b25e]">
                <Sparkles size={15} /> Adaptive profile
              </div>
              <p className="mt-2 text-sm leading-7 text-white/70">{headline}</p>
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-white/10 bg-black/20 p-5">
            <form name="visitor-intelligence" method="POST" data-netlify="true" data-netlify-honeypot="bot-field" className="space-y-4" onSubmit={handleSubmit}>
              <input type="hidden" name="form-name" value="visitor-intelligence" />
              <input type="hidden" name="bot-field" />
              <div>
                <label className="mb-2 block text-sm text-white/70">Your name</label>
                <input
                  value={name}
                  name="name"
                  required
                  autoComplete="name"
                  onChange={(event) => setName(event.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none ring-0 transition focus:border-[#4f8cff]/45"
                  placeholder="Alicia Thompson"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm text-white/70">Company</label>
                <input
                  value={company}
                  name="company"
                  onChange={(event) => setCompany(event.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none ring-0 transition focus:border-[#4f8cff]/45"
                  placeholder="Northstar Labs"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm text-white/70">Email address</label>
                  <input type="email" name="email" value={email} onChange={(event) => setEmail(event.target.value)} required autoComplete="email" className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-[#4f8cff]/45" placeholder="you@company.com" />
                </div>
                <div>
                  <label className="mb-2 block text-sm text-white/70">Phone number</label>
                  <input type="tel" name="phone" value={phone} onChange={(event) => setPhone(event.target.value)} required autoComplete="tel" className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-[#4f8cff]/45" placeholder="+234 800 000 0000" />
                </div>
              </div>
              <div>
                <label className="mb-2 block text-sm text-white/70">Primary need</label>
                <select
                  value={focus}
                  name="focus"
                  required
                  onChange={(event) => setFocus(event.target.value as VisitorFocus | "")}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-[#4f8cff]/45"
                >
                  {focusOptions.map((option) => (
                    <option key={option.value || "default"} value={option.value} className="bg-[#111111] text-white">
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <p className="text-xs leading-5 text-white/45">By submitting, you agree that I may contact you about your project. Your details are securely captured through Netlify.</p>
              <button type="submit" disabled={submitState === "sending"} className="btn-primary disabled:cursor-wait disabled:opacity-60">
                {submitState === "sending" ? "Securing your details…" : submitState === "sent" ? "Details received" : "Activate the experience"} <ArrowRight size={15} />
              </button>
              {submitState === "error" ? <p className="text-sm text-[#ff8a75]">Your profile was saved locally, but the secure lead submission needs another try.</p> : null}
            </form>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-5 rounded-[1.2rem] border border-white/10 bg-white/5 p-4">
              <div className="flex items-center gap-2 text-sm text-white/80">
                <CheckCircle2 size={16} className="text-[#d6b25e]" /> {ready ? "Your profile is ready for a more relevant conversation." : "The system is waiting for your first interaction."}
              </div>
              <div className="mt-4 space-y-2">
                {activity.length === 0 ? (
                  <p className="text-sm text-white/60">No activity yet. Submit the form to start a live profile.</p>
                ) : (
                  activity.map((item) => (
                    <div key={item.id} className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white/70">
                      <p>{item.event}</p>
                      <p className="mt-1 text-xs text-white/50">{item.detail}</p>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
