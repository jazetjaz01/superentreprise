import type { MetadataRoute } from "next";
import { getPublishedArticles } from "@/lib/articles";
import { SITE_URL } from "@/lib/site";

// Pages publiques fixes, par ordre d'importance
const STATIC_ROUTES: { path: string; priority: number }[] = [
  { path: "", priority: 1 },
  { path: "/cession/valoriser", priority: 0.9 },
  { path: "/cession/preparer", priority: 0.9 },
  { path: "/cession/transmettre", priority: 0.9 },
  { path: "/acquisition/reprendre", priority: 0.9 },
  { path: "/acquisition/securiser", priority: 0.9 },
  { path: "/acquisition/accompagner", priority: 0.9 },
  { path: "/nous-connaitre", priority: 0.8 },
  { path: "/contact", priority: 0.8 },
  { path: "/actualite", priority: 0.7 },
  { path: "/carrieres", priority: 0.6 },
  { path: "/carrieres/etudiants", priority: 0.5 },
  { path: "/carrieres/experimentes", priority: 0.5 },
  { path: "/mentions-legales", priority: 0.2 },
  { path: "/confidentialite", priority: 0.2 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await getPublishedArticles().catch(() => []);

  return [
    ...STATIC_ROUTES.map(({ path, priority }) => ({
      url: `${SITE_URL}${path}`,
      priority,
    })),
    ...articles.map((article) => ({
      url: `${SITE_URL}/actualite/${article.slug}`,
      lastModified: article.published_at ?? undefined,
      priority: 0.6,
    })),
  ];
}
