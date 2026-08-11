"use server";

import { redirect } from "next/navigation";
import { getCurrentUserAdminStatus } from "@/lib/blog/is-admin";
import { slugify } from "@/lib/blog/slugify";
import { createClient } from "@/lib/supabase/server";

export async function createArticle(
  _prevState: { error: string } | null,
  formData: FormData,
) {
  const { user, isAdmin } = await getCurrentUserAdminStatus();

  if (!user || !isAdmin) {
    return { error: "Seuls les administrateurs peuvent créer un article." };
  }

  const title = String(formData.get("title") ?? "").trim();
  const categoryId = String(formData.get("category_id") ?? "");
  const excerpt = String(formData.get("excerpt") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();
  const coverImagePath = String(formData.get("cover_image_path") ?? "");
  const publishNow = formData.has("publish_now");

  if (!title) {
    return { error: "Le titre est obligatoire." };
  }

  const slug = `${slugify(title)}-${Date.now().toString(36)}`;

  const supabase = await createClient();
  const { error } = await supabase.from("blog_articles").insert({
    author_id: user.id,
    category_id: categoryId || null,
    title,
    slug,
    excerpt: excerpt || null,
    content: content || null,
    cover_image_path: coverImagePath || null,
    status: publishNow ? "publie" : "brouillon",
    published_at: publishNow ? new Date().toISOString() : null,
  });

  if (error) {
    return { error: error.message };
  }

  redirect("/blog");
}
