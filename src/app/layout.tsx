import type { Metadata } from "next";
import { Inter, Sora, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { SiteShell } from "@/components/site-shell";
import { SiteAnalytics } from "@/components/site-analytics";

const sora = Sora({ subsets: ["latin"], variable: "--font-sora" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  metadataBase: new URL("https://www.johnsolace.online"),
  title: {
    default: "John Solace — Digital Product & Software Development",
    template: "%s | John Solace",
  },
  description: "I design and build custom software, digital platforms, mobile apps and premium digital experiences for ambitious businesses.",
  keywords: [
    "software development",
    "custom software development",
    "web application development",
    "mobile app development",
    "digital product design",
    "business automation",
    "software developer Nigeria",
    "software development Abuja",
    "software development Lagos",
  ],
  authors: [{ name: "John Solace" }],
  creator: "John Solace",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "https://www.johnsolace.online",
    title: "John Solace — Digital Product & Software Development",
    description: "Custom software, digital platforms, mobile apps and premium digital experiences for ambitious businesses.",
    siteName: "John Solace",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "John Solace — Digital Product & Software Development",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "John Solace — Digital Product & Software Development",
    description: "Custom software, digital platforms, mobile apps and premium digital experiences for ambitious businesses.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${sora.variable} ${inter.variable} ${mono.variable} h-full antialiased`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </head>
      <body className="min-h-full bg-[#070707] text-[#f5f5f5]">
        <SiteAnalytics />
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
