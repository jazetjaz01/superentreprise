import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { requireWriter } from "@/lib/auth";
import { formatDate } from "@/lib/format";
import { createClient } from "@/lib/supabase/server";
import { deleteArticle } from "./actions";

export const metadata: Metadata = { title: "Mes articles" };

async function MyArticles() {
  const user = await requireWriter();
  const supabase = await createClient();

  const [{ data: author }, { data: articles }] = await Promise.all([
    supabase.from("authors").select("id").eq("id", user.id).maybeSingle(),
    supabase
      .from("articles")
      .select("id, slug, title, status, published_at, updated_at")
      .eq("author_id", user.id)
      .order("updated_at", { ascending: false }),
  ]);

  if (!author) {
    return (
      <div className="mt-10 border border-brand/20 bg-brand/5 p-6">
        <p className="text-brand">
          Avant d’écrire un article, créez votre fiche auteur (nom et photo
          affichés sur vos articles).
        </p>
        <Link
          href="/compte/auteur"
          className="mt-4 inline-block text-sm font-medium text-brand underline underline-offset-4"
        >
          Créer ma fiche auteur
        </Link>
      </div>
    );
  }

  return (
    <>
      <Link
        href="/compte/articles/nouveau"
        className="mt-8 inline-flex h-10 items-center bg-brand px-6 text-sm font-medium uppercase tracking-wide text-white hover:bg-brand/90"
      >
        Nouvel article
      </Link>

      {articles && articles.length > 0 ? (
        <ul className="mt-10 divide-y border-y">
          {articles.map((article) => (
            <li key={article.id} className="flex flex-wrap items-center gap-x-6 gap-y-2 py-5">
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-brand">{article.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {article.status === "published"
                    ? `Publié le ${formatDate(article.published_at)}`
                    : `Brouillon · modifié le ${formatDate(article.updated_at)}`}
                </p>
              </div>
              <div className="flex items-center gap-4 text-sm">
                {article.status === "published" && (
                  <Link href={`/actualite/${article.slug}`} className="text-brand underline underline-offset-4">
                    Voir
                  </Link>
                )}
                <Link href={`/compte/articles/${article.id}`} className="text-brand underline underline-offset-4">
                  Modifier
                </Link>
                <form action={deleteArticle.bind(null, article.id)}>
                  <button type="submit" className="text-destructive underline underline-offset-4">
                    Supprimer
                  </button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-10 text-muted-foreground">Vous n’avez encore écrit aucun article.</p>
      )}
    </>
  );
}

export default function MyArticlesPage() {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-16 sm:px-6">
      <Link href="/compte" className="text-sm text-brand hover:underline hover:underline-offset-4">
        ← Mon compte
      </Link>
      <h1 className="mt-6 text-3xl font-semibold tracking-tight text-brand">Mes articles</h1>
      <Suspense fallback={<p className="mt-10 text-muted-foreground">Chargement…</p>}>
        <MyArticles />
      </Suspense>
    </main>
  );
}
