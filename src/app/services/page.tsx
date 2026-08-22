import { ServicePricingGrid } from "@/components/service-pricing-grid";

export default function ServicesPage() {
  return (
    <main className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10">
      <div className="max-w-3xl"><p className="text-sm uppercase tracking-[0.3em] text-[#d6b25e]">Services</p><h1 className="mt-3 text-4xl font-semibold text-white sm:text-5xl">A premium digital studio for companies that need more than a decorative website.</h1><p className="mt-6 text-lg leading-8 text-white/70">Every engagement is shaped around product clarity, premium execution, and measurable business value.</p></div>
      <ServicePricingGrid compact />
    </main>
  );
}
