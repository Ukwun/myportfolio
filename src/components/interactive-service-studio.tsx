"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Blocks, Compass, Rocket, Sparkles } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

const services = [
  {
    title: "Luxury Websites",
    blurb: "High-conviction digital storefronts designed for trust, clarity, and conversion.",
    accent: "#4f8cff",
    glow: "rgba(79, 140, 255, 0.24)",
    icon: Compass,
    href: "/services#premium-business-website",
  },
  {
    title: "Product Platforms",
    blurb: "Operational systems and software that feel refined, resilient, and built to scale.",
    accent: "#d6b25e",
    glow: "rgba(214, 178, 94, 0.22)",
    icon: Blocks,
    href: "/services#custom-web-application",
  },
  {
    title: "Mobile Products",
    blurb: "Minimal, premium mobile experiences built for retention and elegant product flow.",
    accent: "#7dd3fc",
    glow: "rgba(125, 211, 252, 0.2)",
    icon: Rocket,
    href: "/services#mobile-app-development",
  },
  {
    title: "Immersive Visuals",
    blurb: "3D-led storytelling that brings architecture, property, and ideas into focus.",
    accent: "#a78bfa",
    glow: "rgba(167, 139, 250, 0.2)",
    icon: Sparkles,
    href: "/services#3d-real-estate-visualization",
  },
];

export function InteractiveServiceStudio() {
  const [activeService, setActiveService] = useState(services[0].title);
  const activeItem = services.find((item) => item.title === activeService) ?? services[0];

  return (
    <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10">
      <div className="rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,_rgba(10,10,10,0.98),_rgba(24,24,24,0.95))] p-6 shadow-[0_30px_120px_rgba(0,0,0,0.3)] sm:p-8 lg:p-10">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-[#d6b25e]">Interactive Studio Lens</p>
            <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">A modern digital experience shaped around the way your services actually feel.</h2>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-white/70">
              Every surface is built to feel tactile, minimal, and deliberate, with motion that supports the product rather than distracting from it.
            </p>
            <motion.div
              key={activeItem.title}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="mt-6 rounded-[1.35rem] border border-white/10 bg-white/5 p-5"
            >
              <div className="flex items-center gap-2 text-sm text-[#d6b25e]">
                <Sparkles size={15} />
                Focused experience
              </div>
              <h3 className="mt-3 text-xl font-semibold text-white">{activeItem.title}</h3>
              <p className="mt-2 text-sm leading-7 text-white/70">{activeItem.blurb}</p>
              <Link href={activeItem.href} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-white/80 transition hover:gap-3 hover:text-[#d6b25e]">
                Explore this service <ArrowUpRight size={15} />
              </Link>
            </motion.div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {services.map((service, index) => {
              const Icon = service.icon;
              const isActive = service.title === activeService;

              return (
                <motion.div
                  key={service.title}
                  onClick={() => setActiveService(service.title)}
                  onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") setActiveService(service.title); }}
                  role="button"
                  tabIndex={0}
                  whileHover={{ scale: 1.03, y: -6, rotateX: -4, rotateY: 4 }}
                  whileTap={{ scale: 0.97 }}
                  animate={{
                    y: isActive ? -6 : 0,
                    scale: isActive ? 1.02 : 1,
                    boxShadow: isActive ? "0 16px 50px rgba(0,0,0,0.24)" : "0 8px 24px rgba(0,0,0,0.16)",
                  }}
                  transition={{ type: "spring", stiffness: 220, damping: 20 }}
                  className={`group relative overflow-hidden rounded-[1.4rem] border p-5 text-left ${isActive ? "border-white/20 bg-white/10" : "border-white/10 bg-[#111111]/80"}`}
                >
                  <motion.div
                    animate={{ y: [0, -8, 0], rotate: [0, 6, 0] }}
                    transition={{ duration: 5.2 + index * 0.6, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -right-6 -top-6 h-24 w-24 rounded-full blur-3xl"
                    style={{ backgroundColor: service.glow }}
                  />
                  <div className="relative flex h-full flex-col">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-black/20 text-white" style={{ color: service.accent }}>
                      <Icon size={18} />
                    </div>
                    <h3 className="mt-5 text-lg font-semibold text-white">{service.title}</h3>
                    <p className="mt-2 text-sm leading-7 text-white/65">{service.blurb}</p>
                    <Link href={service.href} onClick={(event) => event.stopPropagation()} className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-white/80 transition group-hover:gap-3 hover:text-[#d6b25e]">
                      View offering <ArrowUpRight size={15} />
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
