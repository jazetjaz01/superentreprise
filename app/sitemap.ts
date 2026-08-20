import { createClient } from "@supabase/supabase-js";
import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

const staticRoutes = [
  "",
  "/annonces",
  "/recherche",
  "/actualite",
  "/forfait",
  "/forfaitspro",
  "/faq",
  "/contact",
  "/deposer-une-annonce",
  "/mentions-legales",
  "/conditions-generales",
  "/politique-de-confidentialite",
  "/gestion-des-cookies",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  );

  const [{ data: annonces }, { data: articles }] = await Promise.all([
    supabase
      .from("annonces")
      .select("id, updated_at")
      .eq("status", "publiee"),
    supabase
      .from("actualite_articles")
      .select("slug, updated_at")
      .eq("status", "publie"),
  ]);

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${siteUrl}${route}`,
    changeFrequency: route === "" ? "daily" : "weekly",
    priority: route === "" ? 1 : 0.7,
  }));

  const annonceEntries: MetadataRoute.Sitemap = (annonces ?? []).map(
    (annonce) => ({
      url: `${siteUrl}/annonce/${annonce.id}`,
      lastModified: annonce.updated_at,
      changeFrequency: "weekly",
      priority: 0.8,
    }),
  );

  const articleEntries: MetadataRoute.Sitemap = (articles ?? []).map(
    (article) => ({
      url: `${siteUrl}/actualite/${article.slug}`,
      lastModified: article.updated_at,
      changeFrequency: "monthly",
      priority: 0.5,
    }),
  );

  return [...staticEntries, ...annonceEntries, ...articleEntries];
}
