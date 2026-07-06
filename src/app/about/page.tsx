import Link from "next/link";
import { ArrowRight, Box, Code2, Layers3, Sparkles } from "lucide-react";
import { GitHubMark } from "@/components/github-mark";
import { AboutPortrait } from "@/components/about-portrait";

const experience = [
  "Fintech & cryptocurrency products",
  "E-commerce platforms",
  "3D worlds & immersive experiences",
  "E-learning systems",
  "Web3 & NFT platforms",
  "Product design & software engineering",
];

export default function AboutPage() {
  return (
    <main className="relative overflow-hidden">
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
        <div className="grid items-center gap-14 lg:grid-cols-[0.46fr_0.54fr] lg:gap-20">
          <AboutPortrait />

          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-[#d6b25e]">The Developer Behind the Work</p>
            <h1 className="mt-4 font-[family-name:var(--font-sora)] text-4xl font-semibold leading-tight text-white sm:text-5xl">
              I turn ambitious ideas into digital products people can understand, trust, and grow with.
            </h1>
            <div className="mt-7 space-y-5 text-base leading-8 text-white/68">
              <p>
                I&apos;m John Solace, a multidisciplinary developer working at the intersection of software engineering, product design, and 3D visual storytelling. My background in art and architecture trained me to notice proportion, emotion, and human experience; engineering taught me how to turn those instincts into resilient systems.
              </p>
              <p>
                My experience spans fintech, e-commerce, cryptocurrency, e-learning, immersive 3D worlds, Web3, and NFT platforms. Moving between these industries has taught me how to simplify complex operations, communicate unfamiliar ideas clearly, and design products that feel credible from the first interaction.
              </p>
              <p className="font-medium text-white/90">
                Clients don&apos;t hire me only to write code. They work with me to connect business intent, user trust, visual craft, and technical execution in one coherent product.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/case-studies" className="btn-primary group">
                Explore My Projects <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <a href="https://github.com/Ukwun" target="_blank" rel="noreferrer" aria-label="View John Solace on GitHub" className="flex h-12 w-12 items-center justify-center rounded-full bg-white/8 text-white shadow-[0_14px_40px_rgba(0,0,0,0.28)] transition hover:-translate-y-1 hover:bg-white/14 hover:text-[#d6b25e]">
                <GitHubMark className="h-[21px] w-[21px]" />
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-24 sm:px-8 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr]">
          <div>
            <div className="flex items-center gap-3 text-[#d6b25e]">
              <Sparkles size={17} />
              <span className="text-sm uppercase tracking-[0.3em]">Range with a purpose</span>
            </div>
            <h2 className="mt-4 text-3xl font-semibold leading-tight text-white">Different industries. One standard of thoughtful execution.</h2>
            <p className="mt-5 leading-8 text-white/65">The value of working across disciplines is not variety for its own sake. It is knowing which ideas transfer, which risks are unique, and how to make sophisticated technology feel simple.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {experience.map((item, index) => {
              const Icon = index % 3 === 0 ? Code2 : index % 3 === 1 ? Layers3 : Box;
              return (
                <div key={item} className="flex items-center gap-4 rounded-[1.25rem] bg-white/[0.045] p-4 shadow-[0_18px_55px_rgba(0,0,0,0.16)]">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#4f8cff]/12 text-[#7cabff]"><Icon size={17} /></span>
                  <p className="text-sm font-medium text-white/78">{item}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
