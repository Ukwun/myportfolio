import { ArrowRight } from "lucide-react";

const whatsappNumber = "2348059085207";

function whatsappLink(message: string) {
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}

const studies = [
  {
    title: "AfriGO",
    industry: "Digital Trade Operating System",
    problem: "Customer enquiries were managed across WhatsApp, manual follow-ups were slowing operations, and leadership lacked clear reporting.",
    built: ["Central dashboard", "Automated workflows", "Customer portal and admin analytics"],
    outcome: ["Faster response times", "Better operational visibility", "Less manual work and stronger growth readiness"],
    stack: ["Next.js", "Firebase", "Framer Motion"],
  },
  {
    title: "NCDF Money",
    industry: "Fintech Savings & Investment",
    problem: "The product needed stronger credibility and a more persuasive digital experience for serious users.",
    built: ["Trust-led onboarding flow", "Savings and investment journey design", "Retention-focused experience layers"],
    outcome: ["Higher-confidence user decisions", "Cleaner product positioning", "A stronger premium market presence"],
    stack: ["React", "Node", "Stripe"],
  },
  {
    title: "NCDF Impact Club",
    industry: "School Programme Platform",
    problem: "The programme needed a more structured digital home that felt premium and easy to navigate.",
    built: ["Programme onboarding experience", "Content-led engagement flows", "Member experience refinements"],
    outcome: ["Improved participation clarity", "More polished programme presentation", "Stronger engagement from users and organisers"],
    stack: ["Next.js", "Supabase", "Tailwind"],
  },
  {
    title: "TAGMI",
    industry: "Livestream & Community Platform",
    problem: "The product needed a more immersive and premium experience for creators and audiences.",
    built: ["Creator-first interface", "Live engagement flows", "Community experience layers"],
    outcome: ["Stronger audience engagement", "Higher perceived brand quality", "A more compelling user experience"],
    stack: ["Next.js", "WebRTC", "Supabase"],
  },
];

export default function CaseStudiesPage() {
  return (
    <main className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10">
      <div className="max-w-3xl">
        <p className="text-sm uppercase tracking-[0.3em] text-[#d6b25e]">Case Studies</p>
        <h1 className="mt-3 text-4xl font-semibold text-white sm:text-5xl">A sharper view of how premium digital systems improve operations, trust, and commercial momentum.</h1>
        <p className="mt-6 text-lg leading-8 text-white/70">The strongest case studies are not just visual portfolios; they show how a product changes the way a business runs.</p>
      </div>
      <div className="mt-12 grid gap-6 xl:grid-cols-2">
        {studies.map((study) => (
          <article key={study.title} className="rounded-[1.6rem] border border-white/10 bg-[#111111]/80 p-7">
            <p className="text-sm uppercase tracking-[0.24em] text-[#4f8cff]">{study.industry}</p>
            <h2 className="mt-4 text-2xl font-semibold text-white">{study.title}</h2>
            <div className="mt-4 space-y-4 text-sm leading-7 text-white/70">
              <div>
                <p className="font-semibold text-white/90">Before</p>
                <p>{study.problem}</p>
              </div>
              <div>
                <p className="font-semibold text-white/90">What we built</p>
                <ul className="mt-2 list-disc space-y-2 pl-5">
                  {study.built.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="font-semibold text-white/90">Business outcome</p>
                <ul className="mt-2 list-disc space-y-2 pl-5">
                  {study.outcome.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {study.stack.map((item) => (
                <span key={item} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/65">{item}</span>
              ))}
            </div>
            <a href={whatsappLink("Hello John, I’m reviewing your work and I’d like to discuss a project with a serious business impact focus. My budget is above ₦2M and I’d like to explore the fit.")} target="_blank" rel="noreferrer" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#d6b25e]">
              Discuss a similar project <ArrowRight size={15} />
            </a>
          </article>
        ))}
      </div>
    </main>
  );
}
