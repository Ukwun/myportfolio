"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Blocks, Building2, Compass, Layers3, Rocket, Sparkles, type LucideIcon } from "lucide-react";
import { whatsappLink } from "@/lib/contact";

type Service = { id: string; name: string; priceNaira: number | null; blurb: string; icon: LucideIcon };

const catalog: Service[] = [
  { id: "business-website", name: "Premium Business Website", priceNaira: 850000, blurb: "A refined digital presence with thoughtful structure, premium storytelling, and conversion-focused UX.", icon: Compass },
  { id: "web-application", name: "Custom Web Application", priceNaira: 2000000, blurb: "Workflow-driven platforms for operations, client experience, and commercial systems that need to scale.", icon: Blocks },
  { id: "mobile-app", name: "Mobile App Development", priceNaira: 3500000, blurb: "Premium mobile products designed for clarity, retention, and elegant user interaction.", icon: Rocket },
  { id: "marketplace-saas", name: "Marketplace / SaaS Platform", priceNaira: 5000000, blurb: "Reliable multi-user systems that support growth, onboarding, and long-term product evolution.", icon: Layers3 },
  { id: "real-estate-3d", name: "3D Real Estate Visualization", priceNaira: 2500000, blurb: "Immersive visual experiences that present properties with architectural sophistication and market credibility.", icon: Sparkles },
  { id: "enterprise-system", name: "Enterprise Digital System", priceNaira: null, blurb: "Tailored systems for businesses ready to move beyond standard web offerings into a sophisticated operating layer.", icon: Building2 },
];

function priceLabel(value: number | null) {
  return value === null ? "Custom Quote" : `From ${new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(value)}`;
}

export function ServicePricingGrid({ compact = false }: { compact?: boolean }) {
  const [services, setServices] = useState(catalog);

  useEffect(() => {
    let active = true;
    fetch("/.netlify/functions/public-settings", { headers: { Accept: "application/json" } })
      .then((response) => response.ok ? response.json() : Promise.reject(new Error("Pricing unavailable")))
      .then((result) => {
        if (!active) return;
        setServices((current) => current.map((service) => {
          const live = result.services?.find((item: { id?: string }) => item.id === service.id);
          return live ? { ...service, priceNaira: live.priceNaira === null ? null : Number(live.priceNaira) } : service;
        }));
      })
      .catch(() => undefined);
    return () => { active = false; };
  }, []);

  const visible = compact ? services.filter((service) => ["business-website", "web-application", "mobile-app", "real-estate-3d"].includes(service.id)) : services;

  return (
    <div className={`mt-12 grid gap-6 ${compact ? "md:grid-cols-2" : "md:grid-cols-2 xl:grid-cols-3"}`}>
      {visible.map((service) => {
        const Icon = service.icon;
        const pricing = priceLabel(service.priceNaira);
        const message = `Hello John, I’m interested in ${service.name}. The website currently lists ${pricing}, and I’d like to discuss the scope and next steps.`;
        return (
          <article key={service.id} id={service.id} className="scroll-mt-28 rounded-[1.6rem] border border-white/10 bg-[#111111]/85 p-7">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#4f8cff]/15 text-[#4f8cff]"><Icon size={20} /></div>
            <h2 className="mt-5 text-2xl font-semibold text-white">{service.name}</h2>
            <p className="mt-3 text-sm leading-7 text-white/70">{service.blurb}</p>
            <p className="mt-5 text-lg font-semibold text-[#d6b25e]">{pricing}</p>
            <a href={whatsappLink(message)} target="_blank" rel="noreferrer" className={compact ? "btn-primary mt-6" : "btn-secondary mt-6"}>{compact ? "Request a Private Quote" : "Discuss My Project"} <ArrowRight size={15} /></a>
          </article>
        );
      })}
    </div>
  );
}
