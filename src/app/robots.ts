import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/ebooks/success/"],
    },
    sitemap: "https://www.johnsolace.online/sitemap.xml",
  };
}