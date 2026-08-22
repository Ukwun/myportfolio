import { ServicePricingGrid } from "@/components/service-pricing-grid";

export default function PackagesPage() {
  return (
    <main className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10">
      <div className="max-w-3xl"><p className="text-sm uppercase tracking-[0.3em] text-[#d6b25e]">Packages</p><h1 className="mt-3 text-4xl font-semibold text-white sm:text-5xl">Engagement options for companies ready to invest in serious digital growth.</h1></div>
      <ServicePricingGrid />
    </main>
  );
}
