"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BarChart3, Blocks, Compass, MessageCircle, Sparkles, Rocket, ShieldCheck } from "lucide-react";
import { InteractiveServiceStudio } from "@/components/interactive-service-studio";
import { LiveIntake } from "@/components/live-intake";
import { TrustScene } from "@/components/trust-scene";
import { Hero3D } from "@/components/hero-3d";

const whatsappNumber = "2348059085207";

function whatsappLink(message: string) {
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}

const caseStudies = [
  {
    title: "AfriGO",
    industry: "Digital Trade Operating System",
    problem: "Cross-border trade teams needed one reliable system to manage onboarding, internal operations, and visibility.",
    solution: "We created a premium operating layer that turns complexity into a calm, guided experience for teams and customers.",
    features: ["Workflow automation", "Team onboarding", "Operational dashboards"],
    stack: ["Next.js", "Firebase", "Tailwind"],
    value: "Improved clarity and execution speed for high-volume trade operations.",
  },
  {
    title: "NCDF Money",
    industry: "Fintech Savings & Investment",
    problem: "The product needed a more credible and conversion-driven experience for serious financial users.",
    solution: "We shaped a premium product experience that balances trust, clarity, and product-led growth.",
    features: ["Savings journey", "Investment onboarding", "Retention-focused UX"],
    stack: ["React", "Node", "Stripe"],
    value: "Raised confidence and strengthened the product’s premium market positioning.",
  },
  {
    title: "TAGMI",
    industry: "Livestream & Community Platform",
    problem: "The platform needed premium presentation and a more immersive experience for creators and audiences.",
    solution: "We built a polished, community-first product experience with strong visual identity and interaction depth.",
    features: ["Creator-first UI", "Live engagement flows", "Community experience layers"],
    stack: ["Next.js", "WebRTC", "Supabase"],
    value: "Delivered a memorable experience that elevated engagement and perceived quality.",
  },
];

const services = [
  {
    title: "Premium Websites",
    blurb: "Luxury digital storefronts designed for trust, conversion, and a decisive first impression.",
    icon: Compass,
  },
  {
    title: "Software Platforms",
    blurb: "Operational systems, internal tools, and growth platforms built for ambitious teams.",
    icon: Blocks,
  },
  {
    title: "Mobile App Experience",
    blurb: "Refined mobile products crafted for retention, clarity, and premium brand perception.",
    icon: Rocket,
  },
  {
    title: "3D & Real Estate Visual Storytelling",
    blurb: "Immersive digital experiences that bring architecture, property, and vision to life with authority.",
    icon: Sparkles,
  },
];

const processSteps = [
  "Executive discovery and business alignment",
  "Experience design and product structure",
  "Build, refine, and launch with precision",
];

const stats = [
  { value: "15+", label: "high-value launches" },
  { value: "₦10M+", label: "average project value" },
  { value: "98%", label: "client satisfaction" },
];

export default function HomePage() {
  return (
    <main>
      <section className="relative overflow-hidden px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(79,140,255,0.16),_transparent_36%),linear-gradient(130deg,_rgba(214,178,94,0.14),_transparent_30%)]" />
        <motion.div
          animate={{ y: [0, -16, 0], x: [0, 10, 0], rotate: [0, 3, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-[8%] top-[8%] h-40 w-40 rounded-full bg-[#4f8cff]/10 blur-3xl"
        />
        <motion.div
          animate={{ y: [0, 18, 0], x: [0, -12, 0], rotate: [0, -4, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[10%] right-[8%] h-56 w-56 rounded-full bg-[#d6b25e]/10 blur-3xl"
        />
        <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#d6b25e]/30 bg-[#111111]/80 px-3 py-2 text-sm text-[#d6b25e]">
              <Sparkles size={15} />
              Digital strategy • premium product design • software delivery
            </div>
            <h1 className="max-w-2xl font-[family-name:var(--font-sora)] text-4xl font-semibold leading-[0.95] sm:text-5xl lg:text-6xl">
              Premium digital systems.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-white/70">
              Strategy, product design, and platform delivery for ambitious teams.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href={whatsappLink("Hello John, I visited your website and I’m interested in a custom tech project. My estimated budget is above ₦2M and I’d like to discuss scope, timeline, and pricing.")} target="_blank" rel="noreferrer" className="btn-primary group">
                Start a ₦2M+ Project
                <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
              </a>
              <a href="/#case-studies" className="btn-secondary group">
                See Case Studies
                <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
              </a>
            </div>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <a href={whatsappLink("Hello John, I’d like to book a discovery call to discuss a serious digital project for my business. Please let me know your availability.")} target="_blank" rel="noreferrer" className="btn-primary group">
                Book a Discovery Call
                <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
              </a>
              <Link href="/packages" className="btn-secondary group">
                View Packages
                <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-4 text-sm text-white/65">
              {stats.map((item) => (
                <div key={item.label} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm">
                  <p className="font-[family-name:var(--font-mono)] text-lg text-white">{item.value}</p>
                  <p>{item.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <div className="hidden lg:flex items-center justify-center">
            <Hero3D />
          </div>
        </div>
      </section>

      <section id="case-studies" className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-10">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-[#d6b25e]">Selected Outcomes</p>
            <h2 className="mt-2 text-3xl font-semibold text-white">Work shaped around operational improvement, higher trust, and measurable business momentum.</h2>
          </div>
          <Link href="/case-studies" className="hidden items-center gap-2 text-sm text-white/70 transition hover:text-white md:inline-flex">
            Explore more <ArrowRight size={15} />
          </Link>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          {caseStudies.map((study, index) => (
            <motion.article key={study.title} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.35, delay: index * 0.08 }} className="group rounded-[1.75rem] border border-white/10 bg-[#111111]/80 p-6 shadow-[0_16px_70px_rgba(0,0,0,0.22)] transition hover:-translate-y-2 hover:border-[#d6b25e]/30">
              <p className="text-sm uppercase tracking-[0.24em] text-[#4f8cff]">{study.industry}</p>
              <h3 className="mt-4 text-2xl font-semibold text-white">{study.title}</h3>
              <div className="mt-4 space-y-3 text-sm leading-7 text-white/70">
                <div>
                  <p className="font-semibold text-white/90">Before</p>
                  <p>{study.problem}</p>
                </div>
                <div>
                  <p className="font-semibold text-white/90">What we built</p>
                  <p>{study.solution}</p>
                </div>
                <div>
                  <p className="font-semibold text-white/90">Business outcome</p>
                  <p>{study.value}</p>
                </div>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                {study.stack.map((item) => (
                  <span key={item} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/65">{item}</span>
                ))}
              </div>
              <a href={whatsappLink("Hello John, I’m reviewing your work and I’d like to discuss a project with a serious business impact focus. My budget is above ₦2M and I’d like to explore the fit.")} target="_blank" rel="noreferrer" className="btn-secondary mt-6">
                Discuss My Project <ArrowRight size={15} />
              </a>
            </motion.article>
          ))}
        </div>
      </section>

      <InteractiveServiceStudio />

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-[#d6b25e]">Services</p>
            <h2 className="mt-2 text-3xl font-semibold text-white">A focused digital studio for businesses that need strategy, execution, and premium delivery.</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <motion.div key={service.title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.35, delay: index * 0.05 }} className="rounded-[1.4rem] border border-white/10 bg-[#111111]/80 p-6 shadow-[0_10px_40px_rgba(0,0,0,0.2)]">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#4f8cff]/15 text-[#4f8cff]">
                    <Icon size={20} />
                  </div>
                  <h3 className="mt-5 text-xl font-semibold text-white">{service.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-white/70">{service.blurb}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <LiveIntake />

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
        <div className="rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,_rgba(17,17,17,0.92),_rgba(24,24,24,0.9))] p-8 lg:p-10">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-[#d6b25e]">Why Leaders Choose Us</p>
              <h2 className="mt-2 text-3xl font-semibold text-white">A premium partner for strategy, design, and product delivery.</h2>
              <p className="mt-4 text-lg leading-8 text-white/70">We combine software craft, product thinking, and visual storytelling to create systems that not only look refined, but perform under real business pressure.</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {[
                { title: "Executive-level clarity", text: "Every engagement is structured around business outcomes, not just aesthetics or feature lists." },
                { title: "Operational depth", text: "The workflow is designed for real-world use, onboarding, reporting, and long-term growth." },
                { title: "Direct communication", text: "Clear proposals, fast feedback cycles, and thoughtful implementation steps." },
                { title: "Built for scale", text: "We create systems that feel premium today and remain useful as your business grows." },
              ].map((item) => (
                <div key={item.title} className="rounded-[1.2rem] border border-white/10 bg-white/5 p-5">
                  <h3 className="font-semibold text-white">{item.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-white/70">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[2rem] border border-white/10 bg-[#111111]/80 p-8">
            <p className="text-sm uppercase tracking-[0.3em] text-[#d6b25e]">Process</p>
            <h2 className="mt-2 text-3xl font-semibold text-white">A calm, high-trust process for serious clients.</h2>
            <div className="mt-6 space-y-4">
              {processSteps.map((item, index) => (
                <div key={item} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-[#4f8cff]/15 text-sm font-semibold text-[#4f8cff]">0{index + 1}</div>
                  <p className="text-sm leading-7 text-white/75">{item}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top,_rgba(79,140,255,0.16),_transparent_30%),#111111]/80 p-8">
            <p className="text-sm uppercase tracking-[0.3em] text-[#d6b25e]">Qualified Enquiry</p>
            <h2 className="mt-2 text-3xl font-semibold text-white">Start with a conversation that filters for real potential.</h2>
            <div className="mt-6 flex flex-col gap-3">
              <a href={whatsappLink("Hello John, I need a premium business website. My budget starts from ₦850k and I’d like to discuss the project.")} target="_blank" rel="noreferrer" className="flex items-center justify-between rounded-[1.2rem] border border-white/10 bg-white/5 px-4 py-4 text-sm text-white/80 transition hover:border-[#4f8cff]/50 hover:bg-[#4f8cff]/10">
                <span>Start a Website Project</span>
                <MessageCircle size={16} className="text-[#4f8cff]" />
              </a>
              <a href={whatsappLink("Hello John, I need custom software/web application development. My budget is above ₦2M and I’d like to discuss requirements.")} target="_blank" rel="noreferrer" className="flex items-center justify-between rounded-[1.2rem] border border-white/10 bg-white/5 px-4 py-4 text-sm text-white/80 transition hover:border-[#4f8cff]/50 hover:bg-[#4f8cff]/10">
                <span>Start a Software Project</span>
                <MessageCircle size={16} className="text-[#4f8cff]" />
              </a>
              <a href={whatsappLink("Hello John, I need a mobile app for my business. My budget is above ₦3.5M and I’d like to discuss the scope.")} target="_blank" rel="noreferrer" className="flex items-center justify-between rounded-[1.2rem] border border-white/10 bg-white/5 px-4 py-4 text-sm text-white/80 transition hover:border-[#4f8cff]/50 hover:bg-[#4f8cff]/10">
                <span>Start a Mobile App Project</span>
                <MessageCircle size={16} className="text-[#4f8cff]" />
              </a>
              <a href={whatsappLink("Hello John, I visited your website and I’m interested in a custom tech project. My estimated budget is above ₦2M and I’d like to discuss scope, timeline, and pricing.")} target="_blank" rel="noreferrer" className="flex items-center justify-between rounded-[1.2rem] border border-white/10 bg-white/5 px-4 py-4 text-sm text-white/80 transition hover:border-[#4f8cff]/50 hover:bg-[#4f8cff]/10">
                <span>Request a Private Quote</span>
                <MessageCircle size={16} className="text-[#d6b25e]" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
