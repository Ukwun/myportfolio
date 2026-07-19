import Image from "next/image";
import { Quote } from "lucide-react";

const testimonials = [
  {
    company: "Tagmi",
    context: "Livestream and community platform",
    logo: "/client-logos/tagmi.png",
    logoWidth: 181,
    logoHeight: 260,
    feedback:
      "John brought much-needed structure to a product with a lot of moving parts. He listened before building, asked the right questions, and kept bringing the conversation back to what would make the experience clearer for real users.",
  },
  {
    company: "NCDFCOOP",
    context: "Cooperative finance platform",
    logo: "/client-logos/ncdfcoop.png",
    logoWidth: 720,
    logoHeight: 212,
    feedback:
      "The strongest part of the collaboration was how clearly complex financial workflows were translated into something people could actually follow. We were never left guessing why a product decision had been made.",
  },
  {
    company: "ImpactClub",
    context: "Community and investment platform",
    logo: "/client-logos/impactclub.png",
    logoWidth: 720,
    logoHeight: 221,
    feedback:
      "It felt like a genuine partnership rather than a hand-off. John cared about the reasoning behind the product, not just how the final screens looked, and the result was stronger because of it.",
  },
] as const;

export function ClientTestimonials() {
  return (
    <section className="relative overflow-hidden px-5 py-20 sm:px-8 lg:px-10 lg:py-24" aria-labelledby="testimonials-heading">
      <div className="pointer-events-none absolute left-[12%] top-1/3 h-56 w-56 rounded-full bg-[#4f8cff]/8 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-[8%] h-56 w-56 rounded-full bg-[#d6b25e]/8 blur-3xl" />

      <div className="relative mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-[#d6b25e]">Client Perspectives</p>
            <h2 id="testimonials-heading" className="mt-3 max-w-xl text-3xl font-semibold leading-tight text-white sm:text-4xl">
              Thoughtful work is remembered by how the process felt.
            </h2>
          </div>
          <p className="max-w-2xl text-base leading-8 text-white/62 lg:justify-self-end">
            Plain-language reflections from teams I&apos;ve partnered with—focused on communication, product thinking, and the experience of building together.
          </p>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <article
              key={testimonial.company}
              className={`group flex min-h-[350px] flex-col rounded-[1.75rem] border p-6 transition duration-300 hover:-translate-y-1 sm:p-7 ${
                index === 1
                  ? "border-[#d6b25e]/25 bg-[linear-gradient(145deg,_rgba(214,178,94,0.1),_rgba(17,17,17,0.88)_42%)] shadow-[0_24px_75px_rgba(0,0,0,0.26)]"
                  : "border-white/10 bg-[#111111]/75 shadow-[0_20px_65px_rgba(0,0,0,0.2)] hover:border-[#4f8cff]/25"
              }`}
            >
              <div className="flex items-start justify-between gap-5">
                <div className="flex h-14 min-w-28 items-center justify-center rounded-2xl border border-white/8 bg-white/[0.045] px-4">
                  <Image
                    src={testimonial.logo}
                    alt={`${testimonial.company} logo`}
                    width={testimonial.logoWidth}
                    height={testimonial.logoHeight}
                    className="max-h-9 w-auto max-w-28 object-contain"
                  />
                </div>
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#4f8cff]/10 text-[#7cabff]">
                  <Quote size={18} aria-hidden="true" />
                </span>
              </div>

              <blockquote className="mt-7 flex-1 text-[1.02rem] leading-8 text-white/78">
                “{testimonial.feedback}”
              </blockquote>

              <footer className="mt-7 border-t border-white/8 pt-5">
                <p className="font-semibold text-white">{testimonial.company} project team</p>
                <p className="mt-1 text-sm text-white/48">{testimonial.context}</p>
              </footer>
            </article>
          ))}
        </div>

        <p className="mt-5 text-xs leading-5 text-white/35">
          Project feedback summarized in plain language. Individual names and portraits will be added when client-approved details are available.
        </p>
      </div>
    </section>
  );
}
