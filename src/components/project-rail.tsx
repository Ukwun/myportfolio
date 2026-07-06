"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { PointerEvent, WheelEvent } from "react";

const projects = [
  { title: "AfriGO", industry: "Digital Trade Operating System", problem: "Cross-border trade teams needed one reliable system for onboarding, operations, and visibility.", built: "A guided operating layer with automated workflows, team onboarding, customer portals, and reporting.", outcome: "Improved clarity and execution speed across high-volume trade operations.", stack: ["Next.js", "Firebase", "Tailwind"] },
  { title: "NCDF Money", industry: "Fintech Savings & Investment", problem: "The product needed a credible, conversion-focused experience for serious financial users.", built: "Trust-led savings, investment, onboarding, and retention journeys.", outcome: "Strengthened user confidence and premium market positioning.", stack: ["React", "Node.js", "Stripe"] },
  { title: "TAGMI", industry: "Livestream & Community", problem: "Creators and audiences needed a more immersive, premium platform experience.", built: "Creator-first interfaces, live engagement flows, and community experience layers.", outcome: "Elevated engagement, product clarity, and perceived brand quality.", stack: ["Next.js", "WebRTC", "Supabase"] },
  { title: "NCDF Impact Club", industry: "Education Platform", problem: "Nationwide programmes needed unified enrollment, learning, facilitator, and school administration.", built: "Role-based portals for students, facilitators, parents, schools, and headquarters.", outcome: "Created a scalable learning ecosystem with stronger efficiency, engagement, and credibility.", stack: ["Flutter", "Firebase", "Node.js"] },
  { title: "Fatherland Smart Cities", industry: "Real Estate & Investment", problem: "Large-scale developments and opportunities needed a premium, investor-ready digital presence.", built: "Immersive corporate storytelling, project showcases, investment information, and intuitive navigation.", outcome: "Improved investor confidence and strengthened long-term strategic engagement.", stack: ["Next.js", "Node.js", "Tailwind"] },
  { title: "Hybrid Marketplace", industry: "Commerce Ecosystem", problem: "Multiple user journeys and secure transactions had to scale without sacrificing usability.", built: "A mobile-first marketplace with discovery, buyer and seller dashboards, and real-time interactions.", outcome: "Established a flexible foundation for marketplace growth and user engagement.", stack: ["Flutter", "Firebase", "Node.js"] },
  { title: "TrackMe", industry: "Real-Time Operations", problem: "Operational teams needed secure device tracking and coordinated response workflows.", built: "Live maps, administrative controls, incident management, and field coordination tools.", outcome: "Improved operational visibility and accelerated emergency response coordination.", stack: ["Flutter", "Firebase", "Google Maps"] },
  { title: "Steve Finder", industry: "Device Recovery", problem: "Users needed dependable monitoring and simpler device recovery workflows.", built: "Live location updates, interactive mapping, secure authentication, and guided recovery.", outcome: "Delivered a reliable experience with a scalable foundation for security services.", stack: ["Flutter", "Firebase", "Google Maps"] },
  { title: "Jodiorg", industry: "Facility Management", problem: "The company needed a professional digital presence that generated stronger enquiries.", built: "A trust-led corporate website presenting services, projects, values, and contact pathways.", outcome: "Improved service presentation, credibility, and prospective-client conversion.", stack: ["Next.js", "Tailwind", "Node.js"] },
  { title: "Goldstar Lifts", industry: "Engineering Services", problem: "Commercial clients needed clearer proof of lift installation and maintenance expertise.", built: "A mobile-friendly corporate experience showcasing services, projects, and technical capability.", outcome: "Elevated industry credibility and improved lead generation.", stack: ["Next.js", "Tailwind", "Node.js"] },
  { title: "Interactive Real Estate", industry: "Architectural Visualization", problem: "Buyers needed to understand spaces and architectural intent before construction.", built: "Photorealistic 3D environments and immersive, interactive property presentations.", outcome: "Increased buyer engagement and made architectural vision easier to communicate.", stack: ["Blender", "Three.js", "React"] },
  { title: "Accounting Software", industry: "Business Finance", problem: "Fragmented bookkeeping and reporting processes were difficult to manage and scale.", built: "Integrated invoicing, customers, expenses, reports, and role-based administration.", outcome: "Simplified financial operations and improved reporting accuracy.", stack: ["React", "Node.js", "PostgreSQL"] },
  { title: "VAT Marketplace", industry: "Commercial Operations", problem: "Transactions, VAT calculations, compliance, and oversight needed one unified system.", built: "Marketplace, VAT processing, transaction management, reporting, and administration.", outcome: "Reduced complexity and created a scalable foundation for compliant growth.", stack: ["React", "Node.js", "PostgreSQL"] },
];

export function ProjectRail() {
  const rail = useRef<HTMLDivElement>(null);
  const drag = useRef({ active: false, startX: 0, scrollLeft: 0 });

  function move(direction: number) {
    rail.current?.scrollBy({ left: direction * Math.min(440, window.innerWidth * 0.84), behavior: "smooth" });
  }

  function startDrag(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse") return;
    drag.current = { active: true, startX: event.clientX, scrollLeft: rail.current?.scrollLeft ?? 0 };
    event.currentTarget.setPointerCapture(event.pointerId);
    event.currentTarget.dataset.dragging = "true";
  }

  function updateDrag(event: PointerEvent<HTMLDivElement>) {
    if (!drag.current.active || !rail.current) return;
    rail.current.scrollLeft = drag.current.scrollLeft - (event.clientX - drag.current.startX) * 1.15;
  }

  function stopDrag(event: PointerEvent<HTMLDivElement>) {
    drag.current.active = false;
    event.currentTarget.dataset.dragging = "false";
  }

  function wheelAcross(event: WheelEvent<HTMLDivElement>) {
    const node = rail.current;
    if (!node || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
    const movingRight = event.deltaY > 0;
    const canMove = movingRight ? node.scrollLeft + node.clientWidth < node.scrollWidth - 2 : node.scrollLeft > 2;
    if (!canMove) return;
    event.preventDefault();
    node.scrollLeft += event.deltaY;
  }

  return (
    <section id="case-studies" className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-10">
      <div className="mb-7 flex items-end justify-between gap-5">
        <div className="max-w-4xl">
          <p className="text-sm uppercase tracking-[0.3em] text-[#d6b25e]">Selected Outcomes</p>
          <h2 className="mt-2 text-3xl font-semibold text-white">Work shaped around operational improvement, higher trust, and measurable business momentum.</h2>
        </div>
        <div className="hidden shrink-0 gap-2 sm:flex">
          <button type="button" onClick={() => move(-1)} aria-label="Previous projects" className="project-rail-control"><ArrowRight size={17} className="rotate-180" /></button>
          <button type="button" onClick={() => move(1)} aria-label="Next projects" className="project-rail-control"><ArrowRight size={17} /></button>
        </div>
      </div>

      <div ref={rail} onPointerDown={startDrag} onPointerMove={updateDrag} onPointerUp={stopDrag} onPointerCancel={stopDrag} onWheel={wheelAcross} className="project-rail -mx-5 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-8 sm:-mx-8 sm:px-8 lg:-mx-10 lg:px-10">
        {projects.map((project, index) => (
          <motion.article
            key={project.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.45, delay: Math.min(index, 3) * 0.06 }}
            className="project-card group w-[86vw] max-w-[410px] shrink-0 snap-start rounded-[1.7rem] bg-[#111111]/85 p-6 shadow-[0_20px_70px_rgba(0,0,0,0.22)] transition duration-500 hover:-translate-y-2 hover:shadow-[0_28px_85px_rgba(0,0,0,0.3)]"
          >
            <div className="flex items-start justify-between gap-4">
              <p className="text-xs uppercase tracking-[0.22em] text-[#4f8cff]">{project.industry}</p>
              <span className="font-[family-name:var(--font-mono)] text-xs text-white/30">{String(index + 1).padStart(2, "0")}</span>
            </div>
            <h3 className="mt-4 text-2xl font-semibold text-white">{project.title}</h3>
            <div className="mt-5 space-y-4 text-sm leading-7 text-white/68">
              <div><p className="font-semibold text-white/90">Before</p><p>{project.problem}</p></div>
              <div><p className="font-semibold text-white/90">What I built</p><p>{project.built}</p></div>
              <div><p className="font-semibold text-white/90">Business outcome</p><p>{project.outcome}</p></div>
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              {project.stack.map((item) => <span key={item} className="rounded-full bg-white/6 px-3 py-1 text-xs text-white/58">{item}</span>)}
            </div>
          </motion.article>
        ))}
      </div>
      <p className="mt-1 text-xs uppercase tracking-[0.18em] text-white/38">Drag or scroll horizontally to explore {projects.length} projects</p>
    </section>
  );
}
