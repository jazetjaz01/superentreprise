import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Espaces privés et pages d'authentification : rien à indexer
      disallow: ["/compte", "/auth", "/connexion", "/inscription"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
