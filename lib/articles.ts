import { cacheLife, cacheTag } from "next/cache";
import { createPublicClient } from "@/lib/supabase/public";

// Tag de cache invalidé à chaque création / modification / suppression d'article
export const ARTICLES_TAG = "articles";

const ARTICLE_FIELDS = `
  id, slug, title, excerpt, content, cover_image_url, published_at,
  category:categories (id, slug, name),
  author:authors (id, display_name, job_title, avatar_url, linkedin_url, x_url, contact_email)
`;

export type Category = { id: number; slug: string; name: string };
export type Author = {
  id: string;
  display_name: string;
  job_title: string | null;
  avatar_url: string | null;
  linkedin_url?: string | null;
  x_url?: string | null;
  contact_email?: string | null;
};
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

// Nombre d'articles par page de la liste Actualité
export const ARTICLES_PER_PAGE = 9;

export type ArticlesPage = { articles: Article[]; totalPages: number };

// Une page d'articles publiés (page 1 = la plus récente), éventuellement filtrée
export async function getArticlesPage(
  categorySlug: string | undefined,
  page: number
): Promise<ArticlesPage> {
  "use cache";
  cacheTag(ARTICLES_TAG);
  cacheLife("hours");

  const from = (page - 1) * ARTICLES_PER_PAGE;
  let query = createPublicClient()
    .from("articles")
    .select(ARTICLE_FIELDS, { count: "exact" })
    .order("published_at", { ascending: false })
    .range(from, from + ARTICLES_PER_PAGE - 1);

  if (categorySlug) {
    const category = (await getCategories()).find((c) => c.slug === categorySlug);
    if (!category) return { articles: [], totalPages: 0 };
    query = query.eq("category_id", category.id);
  }

  const { data, error, count } = await query.returns<Article[]>();
  // Page au-delà de la dernière : PostgREST renvoie une erreur 416
  if (error) {
    if (error.code === "PGRST103") return { articles: [], totalPages: 0 };
    throw error;
  }
  return { articles: data, totalPages: Math.ceil((count ?? 0) / ARTICLES_PER_PAGE) };
}

export type ArticleSummary = Pick<
  Article,
  "id" | "slug" | "title" | "cover_image_url" | "published_at"
>;

// Les derniers articles publiés, hors article en cours (colonne latérale)
export async function getLatestArticles(
  excludeSlug: string,
  limit = 3
): Promise<ArticleSummary[]> {
  "use cache";
  cacheTag(ARTICLES_TAG);
  cacheLife("hours");

  const { data, error } = await createPublicClient()
    .from("articles")
    .select("id, slug, title, cover_image_url, published_at")
    .neq("slug", excludeSlug)
    .order("published_at", { ascending: false })
    .limit(limit);
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
