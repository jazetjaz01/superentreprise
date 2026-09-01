import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
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
          // Payloads internes React Server Components : jamais destinés à
          // être explorés (aucune valeur SEO), ils ne font que gonfler le
          // nombre de requêtes serverless facturées.
          "/*_rsc=*",
          // Combinaisons de filtres (région × secteur...) : nombre quasi
          // infini d'URL générées dynamiquement, seule la page de base
          // /annonces est listée dans le sitemap et doit être explorée.
          "/annonces?*",
          "/actualite?*",
        ],
      },
      // Bot Meta bloqué en amont par une règle Vercel Firewall et par
      // proxy.ts (403 sur tout son trafic) : un groupe dédié ici n'hérite
      // pas des règles du groupe "*" ci-dessus (chaque bot ne suit que le
      // groupe le plus spécifique qui le concerne), donc autant tout lui
      // interdire explicitement plutôt que de ne reprendre qu'une partie
      // des règles générales.
      {
        userAgent: "meta-externalagent",
        disallow: "/",
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
