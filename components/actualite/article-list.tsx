import Link from "next/link";
import { getCategories, getPublishedArticles } from "@/lib/articles";
import { ArticleCard } from "@/components/actualite/article-card";

// En-tête, filtre par catégorie et grille d'articles (page générale ou catégorie)
export async function ArticleList({ categorySlug }: { categorySlug?: string }) {
  const [categories, articles] = await Promise.all([
    getCategories(),
    getPublishedArticles(categorySlug),
  ]);
  const current = categories.find((c) => c.slug === categorySlug);

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
    </main>
  );
}
