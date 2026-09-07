import type { MetadataRoute } from "next";

const siteUrl = "https://www.johnsolace.online";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${siteUrl}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/about/`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${siteUrl}/services/`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteUrl}/packages/`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${siteUrl}/process/`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${siteUrl}/case-studies/`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${siteUrl}/contact/`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/ebooks/`, changeFrequency: "weekly", priority: 0.8 },
  ];
}