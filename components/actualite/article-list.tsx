import Link from "next/link";
import { notFound } from "next/navigation";
import { getArticlesPage, getCategories } from "@/lib/articles";
import { ArticleCard } from "@/components/actualite/article-card";
import { Pagination } from "@/components/actualite/pagination";

// En-tête, filtre par catégorie, grille d'articles et pagination
export async function ArticleList({
  categorySlug,
  page = 1,
}: {
  categorySlug?: string;
  page?: number;
}) {
  const [categories, { articles, totalPages }] = await Promise.all([
    getCategories(),
    getArticlesPage(categorySlug, page),
  ]);
  // Page au-delà de la dernière
  if (page > 1 && articles.length === 0) notFound();

  const current = categories.find((c) => c.slug === categorySlug);
  const basePath = categorySlug ? `/actualite/categorie/${categorySlug}` : "/actualite";

  const filters = [{ href: "/actualite", label: "Tous", active: !categorySlug }].concat(
    categories.map((c) => ({
      href: `/actualite/categorie/${c.slug}`,
      label: c.name,
      active: c.slug === categorySlug,
    }))
  );

  return (
    <main className="mx-auto w-full max-w-page flex-1 px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-brand">
        <p className="flex items-center gap-6 text-base">
          <span className="h-px w-14 bg-brand" />
          Actualité
        </p>
        <h1 className="mt-6 text-3xl font-semibold tracking-tight sm:text-4xl">
          {current ? current.name : "Nos derniers articles"}
        </h1>
      </div>

      <nav aria-label="Catégories" className="mt-10 flex flex-wrap gap-2">
        {filters.map(({ href, label, active }) => (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className="border border-brand/20 px-4 py-2 text-xs font-medium uppercase tracking-wide text-brand transition-colors hover:border-brand aria-[current=page]:border-brand aria-[current=page]:bg-brand aria-[current=page]:text-white"
          >
            {label}
          </Link>
        ))}
      </nav>

      {articles.length > 0 ? (
        <div className="mt-12 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      ) : (
        <p className="mt-12 text-muted-foreground">
          Aucun article publié pour le moment.
        </p>
      )}

      <Pagination current={page} total={totalPages} basePath={basePath} />
    </main>
  );
}
