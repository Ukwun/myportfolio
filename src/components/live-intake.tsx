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
  const [focus, setFocus] = useState<VisitorFocus | "">("");
  const [ready, setReady] = useState(false);
  const [activity, setActivity] = useState<Array<{ id: string; event: string; detail: string; timestamp: string }>>([]);

  useEffect(() => {
    const profile = readVisitorProfile();
    setName(profile.name);
    setCompany(profile.company);
    setFocus(profile.focus as VisitorFocus | "");
    setActivity(readVisitorActivity());
  }, []);

  const headline = useMemo(() => {
    const profile = readVisitorProfile();
    return getProfileHeadline(profile);
  }, [ready, name, company, focus]);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const nextProfile = saveVisitorProfile({
      ...readVisitorProfile(),
      name,
      company,
      focus: focus || "",
    });
    recordVisitorActivity("intake-complete", `${company || "a new visitor"} selected ${focus || "a direction"}`);
    setActivity(readVisitorActivity());
    setReady(Boolean(name || company || focus));
    if (nextProfile.name || nextProfile.company || nextProfile.focus) {
      setReady(true);
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
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="mb-2 block text-sm text-white/70">Your name</label>
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none ring-0 transition focus:border-[#4f8cff]/45"
                  placeholder="Alicia Thompson"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm text-white/70">Company</label>
                <input
                  value={company}
                  onChange={(event) => setCompany(event.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none ring-0 transition focus:border-[#4f8cff]/45"
                  placeholder="Northstar Labs"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm text-white/70">Primary need</label>
                <select
                  value={focus}
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
              <button type="submit" className="btn-primary">
                Activate the experience <ArrowRight size={15} />
              </button>
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
