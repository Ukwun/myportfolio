import Image from "next/image";

type ClientBrand = {
  name: string;
  src?: string;
  width?: number;
  height?: number;
};

const clientBrands: ClientBrand[] = [
  { name: "Tagmi", src: "/client-logos/tagmi.png", width: 181, height: 260 },
  { name: "ImpactClub", src: "/client-logos/impactclub.png", width: 720, height: 221 },
  { name: "NCDFCOOP", src: "/client-logos/ncdfcoop.png", width: 720, height: 212 },
  { name: "AfriGo" },
  { name: "Steve Finder", src: "/client-logos/steve-finder.png", width: 243, height: 260 },
  { name: "Brainiac", src: "/client-logos/brainiac.png", width: 271, height: 260 },
  { name: "Bizmingle" },
  { name: "Marketbrainers", src: "/client-logos/marketbrainers.png", width: 520, height: 246 },
  { name: "Basumoh Petroleum", src: "/client-logos/basumoh.png", width: 720, height: 162 },
  { name: "Westgate Technologies", src: "/client-logos/west-gate.png", width: 720, height: 199 },
  { name: "Tinaries Bakery", src: "/client-logos/tinaries-bakery.png", width: 527, height: 260 },
];

export function ClientLogoMarquee() {
  return (
    <section className="border-y border-white/8 bg-white/[0.018] py-8" aria-labelledby="client-logo-heading">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-10">
        <p id="client-logo-heading" className="text-center text-xs font-medium uppercase tracking-[0.28em] text-white/45">
          Trusted by ambitious teams
        </p>
      </div>

      <div className="client-logo-window mt-6">
        <div className="client-logo-track">
          {[0, 1].map((group) => (
            <div key={group} className="client-logo-group" aria-hidden={group === 1}>
              {clientBrands.map((brand) => (
                <div key={`${group}-${brand.name}`} className="client-logo-card group">
                  {brand.src && brand.width && brand.height ? (
                    <Image
                      src={brand.src}
                      alt={group === 0 ? `${brand.name} logo` : ""}
                      width={brand.width}
                      height={brand.height}
                      className="max-h-11 w-auto max-w-40 object-contain opacity-80 transition duration-300 group-hover:scale-105 group-hover:opacity-100"
                    />
                  ) : (
                    <span
                      className="font-[family-name:var(--font-sora)] text-xl font-semibold tracking-tight text-white/75 transition group-hover:text-white"
                      aria-label={group === 0 ? brand.name : undefined}
                    >
                      {brand.name}
                    </span>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
