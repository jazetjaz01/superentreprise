import { FileText } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatActualiteDate } from "@/components/actualite";
import { Badge } from "@/components/ui/badge";
import { getDisplayName } from "@/lib/profile/display-name";
import { createClient } from "@/lib/supabase/server";

async function getArticle(slug: string) {
  const supabase = await createClient();

  const { data: article } = await supabase
    .from("actualite_articles")
    .select("*, actualite_categories(name)")
    .eq("slug", slug)
    .single();

  if (!article) {
    return null;
  }

  const imageUrl = article.cover_image_path
    ? supabase.storage
        .from("actualite-images")
        .getPublicUrl(article.cover_image_path).data.publicUrl
    : null;

  const { data: author } = await supabase
    .from("public_profiles")
    .select("*")
    .eq("id", article.author_id)
    .maybeSingle();
  const authorName = getDisplayName(author, "Superentreprise");

  return {
    article,
    imageUrl,
    authorName,
    authorImage: author?.avatar_url ?? null,
    categoryName: article.actualite_categories?.name ?? null,
  };
}

function getExcerpt(article: {
  excerpt: string | null;
  content: string | null;
}) {
  if (article.excerpt) {
    return article.excerpt;
  }
  if (article.content) {
    return article.content.length > 160
      ? `${article.content.slice(0, 157)}...`
      : article.content;
  }
  return "Actualité Superentreprise : cession, acquisition et transmission d'entreprises.";
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = await getArticle(slug);

  if (!data) {
    return { title: "Article introuvable" };
  }

  const { article, imageUrl } = data;
  const description = getExcerpt(article);
  const publishedTime = article.published_at ?? article.created_at;

  return {
    title: `${article.title} | Superentreprise`,
    description,
    alternates: {
      canonical: `/actualite/${article.slug}`,
    },
    openGraph: {
      title: article.title,
      description,
      type: "article",
      publishedTime,
      url: `/actualite/${article.slug}`,
      images: imageUrl ? [{ url: imageUrl }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description,
      images: imageUrl ? [imageUrl] : undefined,
    },
  };
}

export default async function ActualiteDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await getArticle(slug);

  if (!data) {
    notFound();
  }

  const { article, imageUrl, authorName, authorImage, categoryName } = data;
  const displayDate = formatActualiteDate(
    article.published_at ?? article.created_at,
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    image: imageUrl ? [imageUrl] : undefined,
    datePublished: article.published_at ?? article.created_at,
    dateModified: article.updated_at,
    author: {
      "@type": "Person",
      name: authorName,
    },
    publisher: {
      "@type": "Organization",
      name: "Superentreprise",
    },
    description: getExcerpt(article),
  };

  return (
    <article className="mx-auto w-full max-w-(--breakpoint-lg) px-6 py-12">
      {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static JSON-LD generated server-side, no user input */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="flex flex-col gap-4">
        {categoryName && (
          <Link href="/actualite">
            <Badge variant="secondary">{categoryName}</Badge>
          </Link>
        )}
        <h1 className="font-semibold text-3xl tracking-tight">
          {article.title}
        </h1>
        <div className="flex items-center gap-3">
          {authorImage ? (
            <Image
              alt={authorName}
              className="size-9 rounded-full object-cover"
              height={36}
              src={authorImage}
              width={36}
            />
          ) : (
            <div className="flex size-9 items-center justify-center rounded-full bg-muted text-muted-foreground text-xs">
              {authorName.slice(0, 1).toUpperCase()}
            </div>
          )}
          <div className="flex flex-col text-sm">
            <span className="font-medium">{authorName}</span>
            <span className="text-muted-foreground">{displayDate}</span>
          </div>
        </div>
      </div>

      <div className="relative mt-8 h-80 w-full overflow-hidden rounded-xl bg-muted">
        {imageUrl ? (
          <Image
            alt={article.title}
            className="object-cover"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 1024px"
            src={imageUrl}
          />
        ) : (
          <div className="flex size-full items-center justify-center text-muted-foreground">
            <FileText className="size-8" />
          </div>
        )}
      </div>

      {article.content && (
        <div className="mt-8 whitespace-pre-line text-base text-foreground/90 leading-relaxed">
          {article.content}
        </div>
      )}

      <div className="mt-12 border-border border-t pt-6">
        <Link
          href="/actualite"
          className="text-muted-foreground text-sm hover:text-foreground"
        >
          ← Retour aux actualités
        </Link>
      </div>
    </article>
  );
}
