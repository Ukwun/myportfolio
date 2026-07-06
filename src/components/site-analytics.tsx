"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export function SiteAnalytics() {
  const pathname = usePathname();

  useEffect(() => {
    if (!measurementId || !window.gtag) return;
    window.gtag("event", "page_view", { page_path: pathname, page_location: window.location.href });
  }, [pathname]);

  useEffect(() => {
    function trackLead(event: Event) {
      const detail = (event as CustomEvent<{ focus?: string }>).detail;
      window.gtag?.("event", "generate_lead", { currency: "NGN", lead_source: "visitor_intelligence", project_focus: detail?.focus || "unspecified" });
    }
    window.addEventListener("portfolio:lead", trackLead);
    return () => window.removeEventListener("portfolio:lead", trackLead);
  }, []);

  if (!measurementId) return null;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`} strategy="afterInteractive" />
      <Script id="portfolio-analytics" strategy="afterInteractive">{`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        window.gtag = gtag;
        gtag('js', new Date());
        gtag('config', '${measurementId}', { send_page_view: false, anonymize_ip: true });
      `}</Script>
    </>
  );
}
