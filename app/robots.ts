import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/dashboard",
        "/dashboard/*",
        "/api/*",
        "/login",
        "/signin",
        "/onboarding",
        "/onboarding/*",
        "/annonces/*/informations",
        "/annonces/*/finances",
        "/annonces/*/localisation",
        "/annonces/*/photos",
        "/annonces/*/publication",
        "/annonces/*/activite",
      ],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
