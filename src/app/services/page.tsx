import { ArrowRight, Blocks, Compass, Rocket, Sparkles } from "lucide-react";

const whatsappNumber = "2348059085207";

function whatsappLink(message: string) {
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}

const services = [
  {
    title: "Premium Business Website",
    from: "From ₦850k",
    blurb: "Luxury websites built to build trust, guide attention, and convert serious buyers with precision.",
    icon: Compass,
    cta: "Hello John, I need a premium business website. My budget starts from ₦850k and I’d like to discuss the project.",
  },
  {
    title: "Custom Web Application",
    from: "From ₦2M",
    blurb: "Operational systems, dashboards, and internal tools designed for scale, visibility, and efficient execution.",
    icon: Blocks,
    cta: "Hello John, I need custom software/web application development. My budget is above ₦2M and I’d like to discuss requirements.",
  },
  {
    title: "Mobile App Development",
    from: "From ₦3.5M",
    blurb: "Refined mobile experiences for products that need elegance, reliability, and strong retention.",
    icon: Rocket,
    cta: "Hello John, I need a mobile app for my business. My budget is above ₦3.5M and I’d like to discuss the scope.",
  },
  {
    title: "3D / Real Estate Visualization",
    from: "From ₦2.5M",
    blurb: "Immersive visual storytelling for architecture, property, and spatial experiences with real commercial impact.",
    icon: Sparkles,
    cta: "Hello John, I’m interested in architectural/3D visualization for a real estate or design project. I’d like to discuss the details.",
  },
];

export default function ServicesPage() {
  return (
    <main className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10">
      <div className="max-w-3xl">
        <p className="text-sm uppercase tracking-[0.3em] text-[#d6b25e]">Services</p>
        <h1 className="mt-3 text-4xl font-semibold text-white sm:text-5xl">A premium digital studio for companies that need more than a decorative website.</h1>
        <p className="mt-6 text-lg leading-8 text-white/70">Every engagement is shaped around product clarity, premium execution, and measurable business value.</p>
      </div>
      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {services.map((service) => {
          const Icon = service.icon;
          return (
            <div key={service.title} className="rounded-[1.6rem] border border-white/10 bg-[#111111]/85 p-7">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#4f8cff]/15 text-[#4f8cff]">
                <Icon size={20} />
              </div>
              <h2 className="mt-5 text-2xl font-semibold text-white">{service.title}</h2>
              <p className="mt-3 text-sm leading-7 text-white/70">{service.blurb}</p>
              <p className="mt-5 text-sm font-semibold text-[#d6b25e]">{service.from}</p>
              <a href={whatsappLink(service.cta)} target="_blank" rel="noreferrer" className="btn-primary mt-6">
                Request a Private Quote <ArrowRight size={15} />
              </a>
            </div>
          );
        })}
      </div>
    </main>
  );
}
