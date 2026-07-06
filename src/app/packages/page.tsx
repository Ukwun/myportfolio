import { ArrowRight } from "lucide-react";

const whatsappNumber = "2348059085207";

function whatsappLink(message: string) {
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}

const packages = [
  { name: "Premium Business Website", from: "From ₦850k", blurb: "A refined digital presence with thoughtful structure, premium storytelling, and conversion-focused UX." , cta: "Hello John, I need a premium business website. My budget starts from ₦850k and I’d like to discuss the project." },
  { name: "Custom Web Application", from: "From ₦2M", blurb: "Workflow-driven platforms for operations, client experience, and commercial systems that need to scale.", cta: "Hello John, I need custom software/web application development. My budget is above ₦2M and I’d like to discuss requirements." },
  { name: "Mobile App Development", from: "From ₦3.5M", blurb: "Premium mobile products designed for clarity, retention, and elegant user interaction.", cta: "Hello John, I need a mobile app for my business. My budget is above ₦3.5M and I’d like to discuss the scope." },
  { name: "Marketplace / SaaS Platform", from: "From ₦5M", blurb: "Reliable multi-user systems that support growth, onboarding, and long-term product evolution.", cta: "Hello John, I need a custom digital product with a serious growth strategy. My budget is above ₦5M and I’d like to discuss the scope." },
  { name: "3D Real Estate Visualization", from: "From ₦2.5M", blurb: "Immersive visual experiences that present properties with architectural sophistication and market credibility.", cta: "Hello John, I’m interested in architectural/3D visualization for a real estate or design project. I’d like to discuss the details." },
  { name: "Enterprise Digital System", from: "Custom Quote", blurb: "Tailored systems for businesses ready to move beyond standard web offerings into a sophisticated operating layer.", cta: "Hello John, I visited your website and I’m interested in a custom tech project. My estimated budget is above ₦2M and I’d like to discuss scope, timeline, and pricing." },
];

export default function PackagesPage() {
  return (
    <main className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10">
      <div className="max-w-3xl">
        <p className="text-sm uppercase tracking-[0.3em] text-[#d6b25e]">Packages</p>
        <h1 className="mt-3 text-4xl font-semibold text-white sm:text-5xl">Engagement options for companies ready to invest in serious digital growth.</h1>
      </div>
      <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {packages.map((pkg) => (
          <div key={pkg.name} className="rounded-[1.6rem] border border-white/10 bg-[#111111]/80 p-7">
            <h2 className="text-2xl font-semibold text-white">{pkg.name}</h2>
            <p className="mt-3 text-sm leading-7 text-white/70">{pkg.blurb}</p>
            <p className="mt-5 text-lg font-semibold text-[#d6b25e]">{pkg.from}</p>
            <a href={whatsappLink(pkg.cta)} target="_blank" rel="noreferrer" className="btn-secondary mt-6">
              Discuss My Project <ArrowRight size={15} />
            </a>
          </div>
        ))}
      </div>
    </main>
  );
}
