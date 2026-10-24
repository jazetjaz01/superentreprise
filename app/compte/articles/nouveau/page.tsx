import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { requireWriter } from "@/lib/auth";
import { getCategories } from "@/lib/articles";
import { ArticleForm } from "../article-form";

export const metadata: Metadata = { title: "Nouvel article" };

async function NewArticleForm() {
  const user = await requireWriter();
  const categories = await getCategories();
  return <ArticleForm userId={user.id} categories={categories} />;
}

export default function NewArticlePage() {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-16 sm:px-6">
      <Link href="/compte/articles" className="text-sm text-brand hover:underline hover:underline-offset-4">
        ← Mes articles
      </Link>
      <h1 className="mt-6 text-3xl font-semibold tracking-tight text-brand">Nouvel article</h1>
      <Suspense fallback={<p className="mt-10 text-muted-foreground">Chargement…</p>}>
        <NewArticleForm />
      </Suspense>
    </main>
  );
}
