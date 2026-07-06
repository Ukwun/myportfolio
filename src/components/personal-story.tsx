"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { GitHubMark } from "@/components/github-mark";
import type { MouseEvent } from "react";

export function PersonalStory() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const smoothX = useSpring(x, { stiffness: 90, damping: 18, mass: 0.7 });
  const smoothY = useSpring(y, { stiffness: 90, damping: 18, mass: 0.7 });

  function handlePointerMove(event: MouseEvent<HTMLDivElement>) {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    x.set(((event.clientX - bounds.left) / bounds.width - 0.5) * 14);
    y.set(((event.clientY - bounds.top) / bounds.height - 0.5) * 14);
  }

  function resetPointer() {
    x.set(0);
    y.set(0);
  }

  return (
    <section className="relative mx-auto max-w-7xl overflow-hidden px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
      <div className="pointer-events-none absolute left-[8%] top-[20%] h-72 w-72 rounded-full bg-[#4f8cff]/8 blur-[100px]" />
      <div className="pointer-events-none absolute bottom-[12%] right-[12%] h-64 w-64 animate-[storyGlow_8s_ease-in-out_infinite] rounded-full bg-[#d6b25e]/8 blur-[110px]" />

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6 }}
        className="mb-10 flex items-center gap-4"
      >
        <span className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.32em] text-[#d6b25e]">Beyond the Code</span>
        <span className="h-px w-14 bg-gradient-to-r from-[#d6b25e]/60 to-transparent" />
      </motion.div>

      <div className="grid items-center gap-12 lg:grid-cols-[0.45fr_0.55fr] lg:gap-16">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          onMouseMove={handlePointerMove}
          onMouseLeave={resetPointer}
          className="relative mx-auto w-full max-w-[500px]"
        >
          <motion.div style={{ x: smoothX, y: smoothY }} className="group relative aspect-[4/5] overflow-visible">
            <motion.div animate={{ opacity: [0.3, 0.58, 0.3], scale: [0.95, 1.06, 0.95] }} transition={{ duration: 7.5, repeat: Infinity, ease: "easeInOut" }} className="absolute inset-x-[17%] bottom-[10%] h-[54%] rounded-full bg-[#4f8cff]/18 blur-[65px]" />
            <div className="absolute inset-x-[18%] bottom-[2%] h-[16%] rounded-full bg-black/50 blur-[30px]" />
            <div className="absolute inset-x-[27%] bottom-[6%] h-[13%] rounded-full bg-black/35 blur-[52px]" />
            <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 6.8, repeat: Infinity, ease: "easeInOut" }} className="absolute -inset-[7%] transition-transform duration-700 ease-out group-hover:scale-[1.018]">
              <Image
                src="/1wd.png"
                alt="John Solace — the person behind the work"
                fill
                sizes="(max-width: 1024px) 94vw, 44vw"
                className="translate-x-[-7%] scale-[1.12] object-contain drop-shadow-[0_30px_45px_rgba(0,0,0,0.3)]"
              />
            </motion.div>
            <div className="absolute bottom-4 left-2 right-2 flex items-end justify-between gap-4 bg-gradient-to-t from-[#070707]/75 via-[#070707]/30 to-transparent px-5 pb-4 pt-16">
              <div>
                <p className="text-lg font-semibold text-white">John Solace</p>
                <p className="mt-1 text-xs uppercase tracking-[0.2em] text-white/50">Engineer · Designer · Storyteller</p>
              </div>
              <span className="h-2 w-2 rounded-full bg-[#76e6bd] shadow-[0_0_18px_#76e6bd]" />
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.18 }}
          transition={{ duration: 0.75, delay: 0.14, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="font-[family-name:var(--font-sora)] text-3xl font-semibold leading-tight text-white sm:text-4xl">
            Where engineering discipline meets creative instinct.
          </p>

          <div className="mt-7 space-y-5 text-[15px] leading-8 text-white/68">
            <p>I never saw creativity and technology as separate worlds.</p>
            <p>
              My journey began with art—drawing ideas, studying spaces, and understanding form, light, proportion, and the emotions people experience within them. That curiosity led me into architecture, where every decision had to balance beauty with purpose. From there, I immersed myself in software engineering, product design, and 3D visualization, learning to solve problems with both creativity and logic.
            </p>
            <p className="font-medium text-white/90">Over the years, I discovered that the most meaningful digital products are built where science meets art.</p>
            <p>
              Today, I design and develop websites, software platforms, mobile applications, and immersive digital experiences that don&apos;t just function—they inspire confidence, simplify complex operations, and create lasting value for the businesses behind them.
            </p>
            <p>
              Every project is an opportunity to transform an ambitious idea into something people can use, trust, and grow with. Whether it&apos;s a startup building its first platform, a real estate company reimagining the customer journey, or an established organization preparing for its next stage of growth, my goal remains the same: to create digital systems that are thoughtfully designed, technically resilient, and built to stand the test of time.
            </p>
            <p className="font-[family-name:var(--font-sora)] text-lg font-medium text-white">Because the best products don&apos;t simply cross industries—they cross borders.</p>
          </div>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link href="/about" className="btn-primary group">
              About Me
              <ArrowUpRight size={16} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
            <Link href="/case-studies" className="btn-secondary group">
              Explore My Projects
              <ArrowUpRight size={16} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
            <a href="https://github.com/Ukwun" target="_blank" rel="noreferrer" aria-label="View John Solace on GitHub" className="flex h-[46px] w-[46px] items-center justify-center self-start rounded-full bg-white/8 text-white/75 shadow-[0_12px_35px_rgba(0,0,0,0.24)] transition hover:-translate-y-1 hover:bg-white/14 hover:text-[#d6b25e]">
              <GitHubMark className="h-[19px] w-[19px]" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
