import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    agentFeedback: true,
    serverActions: {
      // Candidatures : CV + lettre (2 Mo chacun) + champs du formulaire.
      // Rester sous la limite de 4,5 Mo des requêtes sur Vercel.
      bodySizeLimit: "5mb",
    },
  },
  cacheComponents: true,
  images: {
    // Images envoyées dans Supabase Storage (couvertures d'articles, avatars)
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ziouqtwvjogojoskweyl.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
