import { ArrowRight, MessageCircle } from "lucide-react";

const whatsappNumber = "2348059085207";

function whatsappLink(message: string) {
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10">
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-[#d6b25e]">Contact</p>
          <h1 className="mt-3 text-4xl font-semibold text-white sm:text-5xl">Start a serious conversation about your next digital investment.</h1>
          <p className="mt-6 text-lg leading-8 text-white/70">For high-value projects, we prefer a direct conversation so we can quickly determine fit, scope, and timing.</p>
        </div>
        <div className="rounded-[2rem] border border-white/10 bg-[#111111]/80 p-8">
          <div className="flex flex-col gap-3">
            <a href={whatsappLink("Hello John, I visited your website and I’m interested in a custom tech project. My estimated budget is above ₦2M and I’d like to discuss scope, timeline, and pricing.")} target="_blank" rel="noreferrer" className="btn-primary flex items-center justify-between px-4 py-4 text-left">
              <span>Request a Private Quote</span>
              <MessageCircle size={16} />
            </a>
            <a href={whatsappLink("Hello John, I need a premium business website. My budget starts from ₦850k and I’d like to discuss the project.")} target="_blank" rel="noreferrer" className="btn-secondary flex items-center justify-between px-4 py-4 text-left">
              <span>Start a Website Project</span>
              <MessageCircle size={16} />
            </a>
            <a href={whatsappLink("Hello John, I’d like to book a discovery call to discuss a serious digital project for my business. Please let me know your availability.")} target="_blank" rel="noreferrer" className="btn-primary flex items-center justify-between px-4 py-4 text-left">
              <span>Book a Discovery Call</span>
              <MessageCircle size={16} />
            </a>
            <a href="mailto:hello@johnstudio.co" className="btn-secondary mt-4 inline-flex items-center gap-2">
              hello@johnstudio.co <ArrowRight size={15} />
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
