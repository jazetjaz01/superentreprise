import { cacheLife, cacheTag } from "next/cache";
import { createPublicClient } from "@/lib/supabase/public";

// Tag de cache invalidé à chaque création / modification / suppression d'article
export const ARTICLES_TAG = "articles";

const ARTICLE_FIELDS = `
  id, slug, title, excerpt, content, cover_image_url, published_at,
  category:categories (id, slug, name),
  author:authors (id, display_name, avatar_url)
`;

export type Category = { id: number; slug: string; name: string };
export type Author = { id: string; display_name: string; avatar_url: string | null };
export type Article = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  cover_image_url: string | null;
  published_at: string | null;
  category: Category | null;
  author: Author | null;
};

export async function getCategories(): Promise<Category[]> {
  "use cache";
  cacheTag(ARTICLES_TAG);
  cacheLife("days");

  const { data, error } = await createPublicClient()
    .from("categories")
    .select("id, slug, name")
    .order("name");
  if (error) throw error;
  return data;
}

export async function getPublishedArticles(categorySlug?: string): Promise<Article[]> {
  "use cache";
  cacheTag(ARTICLES_TAG);
  cacheLife("hours");

  let query = createPublicClient()
    .from("articles")
    .select(ARTICLE_FIELDS)
    .order("published_at", { ascending: false });

  if (categorySlug) {
    const category = (await getCategories()).find((c) => c.slug === categorySlug);
    if (!category) return [];
    query = query.eq("category_id", category.id);
  }

  // La RLS ne renvoie que les articles publiés aux visiteurs anonymes
  const { data, error } = await query.returns<Article[]>();
  if (error) throw error;
  return data;
}

export async function getPublishedArticle(slug: string): Promise<Article | null> {
  "use cache";
  cacheTag(ARTICLES_TAG);
  cacheLife("hours");

  const { data, error } = await createPublicClient()
    .from("articles")
    .select(ARTICLE_FIELDS)
    .eq("slug", slug)
    .returns<Article[]>()
    .maybeSingle();
  if (error) throw error;
  return data;
}
