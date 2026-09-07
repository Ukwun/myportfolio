import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Case Studies",
  alternates: { canonical: "/case-studies/" },
};

export default function CaseStudiesLayout({ children }: { children: React.ReactNode }) {
  return children;
}