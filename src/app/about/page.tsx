import { Sparkles, TrendingUp, MessageCircle } from "lucide-react";

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10">
      <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr]">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-[#d6b25e]">About</p>
          <h1 className="mt-3 text-4xl font-semibold text-white sm:text-5xl">A digital studio for teams that need strategy, execution, and deep product thinking.</h1>
          <p className="mt-6 text-lg leading-8 text-white/70">We blend software engineering, product design, and 3D-led visual storytelling into one focused offering for clients who value clarity, confidence, and commercial impact.</p>
        </div>
        <div className="rounded-[2rem] border border-white/10 bg-[#111111]/80 p-8">
          <div className="flex items-center gap-3 text-[#d6b25e]">
            <Sparkles size={18} />
            <span className="text-sm uppercase tracking-[0.3em]">Studio Philosophy</span>
          </div>
          <div className="mt-6 space-y-4 text-sm leading-7 text-white/70">
            <p>Luxury is not noise. It is clarity, coherence, and confidence in how a product feels and performs.</p>
            <p>We create systems that help businesses sell better, operate more smoothly, and present themselves with authority in the market.</p>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80">
              <div className="flex items-center gap-2"><TrendingUp size={15} className="text-[#4f8cff]" /> Product strategy</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80">
              <div className="flex items-center gap-2"><MessageCircle size={15} className="text-[#4f8cff]" /> Direct communication</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
