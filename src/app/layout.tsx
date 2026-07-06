import type { Metadata } from "next";
import { Inter, Sora, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { SiteShell } from "@/components/site-shell";
import { SiteAnalytics } from "@/components/site-analytics";

const sora = Sora({ subsets: ["latin"], variable: "--font-sora" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "John Solace | Premium Digital Systems",
  description: "Luxury digital product studio crafting premium websites, software, mobile apps, and 3D storytelling experiences.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${sora.variable} ${inter.variable} ${mono.variable} h-full antialiased`}>
      <body className="min-h-full bg-[#070707] text-[#f5f5f5]">
        <SiteAnalytics />
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
