import type { Metadata } from "next";
import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getPublishedArticle, getPublishedArticles } from "@/lib/articles";
import { formatDate } from "@/lib/format";
import { AuthorBadge } from "@/components/actualite/author-badge";

// Avec cacheComponents, au moins un paramètre est requis au build :
// tant qu'aucun article n'est publié, on prérend une page factice (404).
const PLACEHOLDER = "__aucun-article__";

export async function generateStaticParams() {
  const articles = await getPublishedArticles();
  return articles.length > 0
    ? articles.map((a) => ({ slug: a.slug }))
    : [{ slug: PLACEHOLDER }];
}

export async function generateMetadata(
  props: PageProps<"/actualite/[slug]">
): Promise<Metadata> {
  const { slug } = await props.params;
  const article = await getPublishedArticle(slug);
  if (!article) return { title: "Article introuvable" };
  return {
    title: article.title,
    description: article.excerpt ?? undefined,
    openGraph: article.cover_image_url ? { images: [article.cover_image_url] } : undefined,
  };
}

async function ArticleContent(props: PageProps<"/actualite/[slug]">) {
  const { slug } = await props.params;
  const article = await getPublishedArticle(slug);
  if (!article) notFound();

  // Paragraphes séparés par une ligne vide
  const paragraphs = article.content.split(/\n\s*\n/).filter((p) => p.trim());

  return (
    <article>
      <Link
        href="/actualite"
        className="inline-flex items-center gap-2 text-sm text-brand hover:underline hover:underline-offset-4"
      >
        <ArrowLeft className="size-4" />
        Toutes les actualités
      </Link>

      {article.category && (
        <Link
          href={`/actualite/categorie/${article.category.slug}`}
          className="mt-10 block text-xs font-medium uppercase tracking-wide text-brand/60 hover:text-brand"
        >
          {article.category.name}
        </Link>
      )}
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-brand sm:text-5xl">
        {article.title}
      </h1>
      {article.excerpt && (
        <p className="mt-6 text-xl text-brand/80">{article.excerpt}</p>
      )}
      <div className="mt-8">
        <AuthorBadge author={article.author} date={formatDate(article.published_at)} size={44} />
      </div>

      {article.cover_image_url && (
        <div className="relative mt-10 aspect-[16/9] overflow-hidden bg-brand/5">
          <Image
            src={article.cover_image_url}
            alt=""
            fill
            priority
            sizes="(min-width: 768px) 768px, 100vw"
            className="object-cover"
          />
        </div>
      )}

      <div className="mt-10 space-y-6 text-lg leading-relaxed text-foreground/90">
        {paragraphs.map((paragraph, i) => (
          <p key={i} className="whitespace-pre-line">
            {paragraph}
          </p>
        ))}
      </div>
    </article>
  );
}

export default function ArticlePage(props: PageProps<"/actualite/[slug]">) {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-16 sm:px-6">
      {/* params est lu dans le Suspense (articles publiés après le build) */}
      <Suspense fallback={<p className="text-muted-foreground">Chargement…</p>}>
        <ArticleContent {...props} />
      </Suspense>
    </main>
  );
}
