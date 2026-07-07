"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { projects } from "@/components/project-rail";

const whatsappNumber = "2348059085207";
const whatsappLink = (title: string) => `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Hello John, I reviewed the ${title} case study and would like to discuss a project with similar business impact.`)}`;

export default function CaseStudiesPage() {
  return (
    <main className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10">
      <div className="max-w-3xl">
        <p className="text-sm uppercase tracking-[0.3em] text-[#d6b25e]">Case Studies</p>
        <h1 className="mt-3 text-4xl font-semibold text-white sm:text-5xl">A sharper view of how digital systems improve operations, trust, and commercial momentum.</h1>
        <p className="mt-6 text-lg leading-8 text-white/70">Explore all {projects.length} selected products and the business thinking behind each build.</p>
      </div>
      <div className="mt-12 grid gap-6 xl:grid-cols-2">
        {projects.map((project, index) => (
          <motion.article key={project.title} id={project.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }} transition={{ duration: 0.4, delay: (index % 2) * 0.06 }} className="scroll-mt-28 rounded-[1.6rem] bg-[#111111]/80 p-7 shadow-[0_18px_65px_rgba(0,0,0,0.18)]">
            <div className="flex items-start justify-between gap-4">
              <p className="text-sm uppercase tracking-[0.22em] text-[#4f8cff]">{project.industry}</p>
              <span className="font-[family-name:var(--font-mono)] text-xs text-white/35">{String(index + 1).padStart(2, "0")}</span>
            </div>
            <h2 className="mt-4 text-2xl font-semibold text-white">{project.title}</h2>
            <div className="mt-5 space-y-4 text-sm leading-7 text-white/70">
              <div><p className="font-semibold text-white/90">Before</p><p>{project.problem}</p></div>
              <div><p className="font-semibold text-white/90">What I built</p><p>{project.built}</p></div>
              <div><p className="font-semibold text-white/90">Business outcome</p><p>{project.outcome}</p></div>
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              {project.stack.map((item) => <span key={item} className="rounded-full bg-white/6 px-3 py-1 text-xs text-white/65">{item}</span>)}
            </div>
            <a href={whatsappLink(project.title)} target="_blank" rel="noreferrer" className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-[#d6b25e] transition hover:gap-3">Discuss a similar project <ArrowRight size={15} /></a>
          </motion.article>
        ))}
      </div>
    </main>
  );
}
