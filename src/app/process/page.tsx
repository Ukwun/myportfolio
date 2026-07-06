import { ArrowRight } from "lucide-react";

const steps = [
  { title: "01. Discovery", text: "We clarify the business objective, customer journey, and growth ambition before anything is designed." },
  { title: "02. Experience Design", text: "We define the interface, product structure, and premium visual language around real user and business needs." },
  { title: "03. Build & Refine", text: "Development, integration, optimization, and iteration happen in a clear workflow with strong communication." },
  { title: "04. Launch", text: "The product is polished, tested, and handed over with a strong foundation for continued growth." },
];

export default function ProcessPage() {
  return (
    <main className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10">
      <div className="max-w-3xl">
        <p className="text-sm uppercase tracking-[0.3em] text-[#d6b25e]">Process</p>
        <h1 className="mt-3 text-4xl font-semibold text-white sm:text-5xl">A disciplined, high-trust process for building serious digital products.</h1>
      </div>
      <div className="mt-12 grid gap-5">
        {steps.map((step) => (
          <div key={step.title} className="flex flex-col gap-4 rounded-[1.6rem] border border-white/10 bg-[#111111]/80 p-7 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white">{step.title}</h2>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-white/70">{step.text}</p>
            </div>
            <div className="flex items-center gap-2 text-sm font-semibold text-[#d6b25e]">
              Next <ArrowRight size={15} />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
