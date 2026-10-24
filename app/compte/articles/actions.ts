"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { requireWriter } from "@/lib/auth";
import { ARTICLES_TAG } from "@/lib/articles";
import { slugify } from "@/lib/format";
import { isOwnStorageUrl } from "@/lib/storage";
import { createClient } from "@/lib/supabase/server";

export type ArticleFormState = { error?: string } | undefined;

export async function saveArticle(
  _state: ArticleFormState,
  formData: FormData
): Promise<ArticleFormState> {
  const user = await requireWriter();

  const id = String(formData.get("id") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const slug = slugify(String(formData.get("slug") ?? "") || title);
  const excerpt = String(formData.get("excerpt") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();
  const categoryId = Number(formData.get("category_id")) || null;
  const coverImageUrl = String(formData.get("cover_image_url") ?? "");
  const status = formData.get("status") === "published" ? "published" : "draft";

  if (title.length < 3 || title.length > 200) {
    return { error: "Le titre doit contenir entre 3 et 200 caractères." };
  }
  if (!slug) {
    return { error: "L’adresse de l’article (slug) est invalide." };
  }
  if (status === "published" && !content) {
    return { error: "Un article publié doit avoir un contenu." };
  }
  if (coverImageUrl && !isOwnStorageUrl(coverImageUrl, "article-covers", user.id)) {
    return { error: "Image invalide." };
  }

  const supabase = await createClient();

  const { data: author } = await supabase
    .from("authors")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();
  if (!author) {
    return { error: "Créez d’abord votre fiche auteur." };
  }

  const values = {
    title,
    slug,
    excerpt: excerpt || null,
    content,
    category_id: categoryId,
    cover_image_url: coverImageUrl || null,
    status,
  } as const;

  // La RLS limite l'écriture aux articles de l'auteur connecté
  const { error } = id
    ? await supabase.from("articles").update(values).eq("id", id).eq("author_id", user.id)
    : await supabase.from("articles").insert({ ...values, author_id: user.id });

  if (error) {
    return {
      error:
        error.code === "23505"
          ? "Un article utilise déjà cette adresse (slug). Modifiez-la."
          : "L’enregistrement a échoué. Réessayez.",
    };
  }

  updateTag(ARTICLES_TAG);
  redirect("/compte/articles");
}

export async function deleteArticle(id: string) {
  const user = await requireWriter();
  const supabase = await createClient();
  await supabase.from("articles").delete().eq("id", id).eq("author_id", user.id);
  updateTag(ARTICLES_TAG);
  redirect("/compte/articles");
}
