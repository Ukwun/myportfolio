"use client";

import Link from "next/link";
import Image from "next/image";
import type { SVGProps } from "react";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Menu } from "lucide-react";
import { whatsappLink } from "@/lib/contact";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Case Studies", href: "/case-studies" },
  { label: "Ebooks", href: "/ebooks" },
  { label: "Packages", href: "/packages" },
  { label: "Process", href: "/process" },
  { label: "About", href: "/about" },
];

function WhatsAppIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path d="M12 3.75a8.25 8.25 0 0 0-7.12 12.3L3.75 20.25l4.2-1.11A8.25 8.25 0 1 0 12 3.75Z" fill="#25D366" />
      <path d="M16.8 14.3c-.2-.1-1.16-.57-1.34-.64-.18-.07-.31-.1-.44.1-.13.2-.5.64-.62.77-.11.13-.23.15-.43.05-.2-.1-.84-.31-1.6-.99-.59-.53-.99-1.18-1.1-1.38-.12-.2-.01-.31.09-.41.09-.09.2-.23.3-.35.1-.12.13-.2.2-.33.07-.13.03-.25-.02-.35-.05-.1-.44-1.06-.6-1.44-.16-.39-.32-.33-.44-.33l-.38-.01c-.13 0-.34.05-.52.25-.18.2-.7.68-.7 1.65s.72 1.92.82 2.05c.1.13 1.42 2.16 3.44 3.03.48.2.86.32 1.15.41.49.15.93.13 1.28.08.39-.06 1.16-.47 1.33-.93.16-.45.16-.84.11-.92-.04-.09-.18-.14-.38-.24Z" fill="white" />
    </svg>
  );
}

function FacebookIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="4" fill="#1877F2" />
      <path d="M14.2 20v-6.75h2.27l.34-2.63h-2.61V4.95c0-.76.21-1.28 1.3-1.28h1.39V1.2c-.24-.03-1.06-.1-2.02-.1-2 0-3.37 1.22-3.37 3.46v1.93H9.15v2.63h2.27V20h2.78Z" fill="white" />
    </svg>
  );
}

function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" fill="url(#instagramGradient)" />
      <rect x="7.5" y="7.5" width="9" height="9" rx="2.5" stroke="white" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="2.4" stroke="white" strokeWidth="1.6" />
      <circle cx="15.2" cy="8.8" r="0.8" fill="white" />
      <defs>
        <linearGradient id="instagramGradient" x1="4" y1="4" x2="20" y2="20" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FCAF45" />
          <stop offset="0.5" stopColor="#D62976" />
          <stop offset="1" stopColor="#4F5BD5" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function LinkedInIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="4" fill="#0A66C2" />
      <path d="M7.2 9.4h2.05V16H7.2V9.4Zm1.03-3.28a1.19 1.19 0 1 1 0 2.38 1.19 1.19 0 0 1 0-2.38ZM10.55 9.4h1.97v.9h.03c.27-.52.94-1.08 1.94-1.08 2.08 0 2.46 1.37 2.46 3.15V16H14.9v-3.22c0-.77-.01-1.76-1.07-1.76-1.08 0-1.24.84-1.24 1.7V16h-2.04V9.4Z" fill="white" />
    </svg>
  );
}

export function SiteShell({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 18);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const saved = window.localStorage.getItem("portfolio-theme");
    const initial = saved === "light" || saved === "dark" ? saved : window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
    queueMicrotask(() => setTheme(initial));
    document.documentElement.dataset.theme = initial;
  }, []);

  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.dataset.theme = next;
    window.localStorage.setItem("portfolio-theme", next);
  }

  return (
    <div className="site-root min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(79,140,255,0.18),_transparent_32%),linear-gradient(120deg,_#070707_0%,_#0c0c0c_45%,_#070707_100%)] text-[#f5f5f5]">
      <header
        className={`sticky top-0 z-50 border-b transition-all duration-300 ${
          isScrolled ? "border-white/10 bg-[#070707]/90 backdrop-blur-xl" : "border-transparent bg-transparent"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8 lg:px-10">
          <Link href="/" className="flex items-center gap-3 text-sm font-semibold tracking-[0.35em] text-white/90 uppercase">
            <span className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-[#d6b25e]/35 bg-[#111111]/80 text-[#d6b25e] shadow-[0_0_30px_rgba(214,178,94,0.18)]">
              <Image src="/meeeee3.jpg" alt="John Solace" width={72} height={72} className="brand-portrait-image h-full w-full object-cover" />
            </span>
            John Solace
          </Link>

          <nav className="hidden items-center gap-4 text-sm text-white/70 md:flex xl:gap-6">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="transition hover:text-white">
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button type="button" onClick={toggleTheme} className="theme-toggle" aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`} title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}>
              <span className="theme-toggle-track" data-active={theme}>
                <span className="theme-toggle-knob">
                  {theme === "dark" ? (
                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.6 15.1A8.3 8.3 0 0 1 8.9 3.4 8.8 8.8 0 1 0 20.6 15.1Z" fill="currentColor" /></svg>
                  ) : (
                    <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4" fill="currentColor" /><path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.65 17.65l1.42 1.42M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.65 6.35l1.42-1.42" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
                  )}
                </span>
              </span>
            </button>
            <a
              href={whatsappLink("Hello John, I visited your website and I’m interested in a custom tech project. I’d like to discuss the current pricing, scope, and timeline.")}
              target="_blank"
              rel="noreferrer"
              className="btn-primary hidden px-4 py-2 text-sm md:inline-flex"
            >
              Request a Private Quote
            </a>
            <button
              type="button"
              className="rounded-full border border-white/10 bg-white/5 p-2.5 text-white/90 md:hidden"
              onClick={() => setMobileMenuOpen((v) => !v)}
              aria-label="Toggle navigation"
            >
              <Menu size={18} />
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileMenuOpen ? (
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="border-t border-white/10 bg-[#070707]/95 px-5 py-4 md:hidden"
            >
              <div className="flex flex-col gap-3 text-sm text-white/75">
                {navItems.map((item) => (
                  <Link key={item.href} href={item.href} className="transition hover:text-white" onClick={() => setMobileMenuOpen(false)}>
                    {item.label}
                  </Link>
                ))}
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </header>

      {children}

      <a href={whatsappLink("Hello John, I’d like to book a discovery call to discuss a serious digital project for my business. Please let me know your availability.")} target="_blank" rel="noreferrer" className="btn-whatsapp fixed bottom-5 right-5 z-50 px-4 py-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#4f8cff]/15 text-[#4f8cff]">
          <WhatsAppIcon className="h-[17px] w-[17px]" />
        </span>
        Talk on WhatsApp
      </a>

      <footer className="border-t border-white/10 bg-black/20">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-8 text-sm text-white/60 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-10">
          <p>© 2026 John Solace. Premium digital systems for ambitious brands.</p>
          <div className="flex flex-wrap items-center gap-3">
            <Link href="/admin" className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-white/65 transition hover:border-[#d6b25e]/45 hover:text-white">
              Admin login
            </Link>
            <a href="https://www.facebook.com/" target="_blank" rel="noreferrer" aria-label="Visit Facebook" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 transition hover:border-[#4f8cff]/40 hover:text-white">
              <FacebookIcon className="h-4 w-4" />
            </a>
            <a href={whatsappLink("Hello John, I’m exploring a premium digital build and would like to start a conversation.")} target="_blank" rel="noreferrer" aria-label="Visit WhatsApp" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 transition hover:border-[#4f8cff]/40 hover:text-white">
              <WhatsAppIcon className="h-4 w-4" />
            </a>
            <a href="https://www.instagram.com/8_gigabytes/" target="_blank" rel="noreferrer" aria-label="Visit Instagram" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 transition hover:border-[#4f8cff]/40 hover:text-white">
              <InstagramIcon className="h-4 w-4" />
            </a>
            <a href="https://www.linkedin.com/in/john-solace" target="_blank" rel="noreferrer" aria-label="Visit LinkedIn" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 transition hover:border-[#4f8cff]/40 hover:text-white">
              <LinkedInIcon className="h-4 w-4" />
            </a>
            <a href="mailto:Ukwun97@gmail.com" className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 transition hover:text-white">
              Ukwun97@gmail.com
              <ArrowUpRight size={15} />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
