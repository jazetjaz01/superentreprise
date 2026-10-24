import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireWriter } from "@/lib/auth";
import { getCategories } from "@/lib/articles";
import { createClient } from "@/lib/supabase/server";
import { ArticleForm } from "../article-form";

export const metadata: Metadata = { title: "Modifier l’article" };

async function EditArticleForm(props: PageProps<"/compte/articles/[id]">) {
  const user = await requireWriter();
  const { id } = await props.params;
  const supabase = await createClient();

  const [{ data: article }, categories] = await Promise.all([
    supabase
      .from("articles")
      .select("id, title, slug, excerpt, content, category_id, cover_image_url, status")
      .eq("id", id)
      .eq("author_id", user.id)
      .maybeSingle(),
    getCategories(),
  ]);
  if (!article) notFound();

  return <ArticleForm userId={user.id} categories={categories} article={article} />;
}

export default function EditArticlePage(props: PageProps<"/compte/articles/[id]">) {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-16 sm:px-6">
      <Link href="/compte/articles" className="text-sm text-brand hover:underline hover:underline-offset-4">
        ← Mes articles
      </Link>
      <h1 className="mt-6 text-3xl font-semibold tracking-tight text-brand">Modifier l’article</h1>
      <Suspense fallback={<p className="mt-10 text-muted-foreground">Chargement…</p>}>
        <EditArticleForm {...props} />
      </Suspense>
    </main>
  );
}
