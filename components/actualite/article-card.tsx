import Image from "next/image";
import Link from "next/link";
import type { Article } from "@/lib/articles";
import { formatDate } from "@/lib/format";
import { AuthorBadge } from "@/components/actualite/author-badge";

export const ArticleCard = ({ article }: { article: Article }) => (
  <article className="group flex flex-col">
    <Link href={`/actualite/${article.slug}`} className="flex flex-1 flex-col">
      <div className="relative aspect-[3/2] overflow-hidden bg-brand/5">
        {article.cover_image_url ? (
          <Image
            src={article.cover_image_url}
            alt=""
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <Image
            src="/logo.svg"
            alt=""
            width={64}
            height={64}
            className="absolute inset-0 m-auto size-16 opacity-20"
          />
        )}
      </div>
      {article.category && (
        <p className="mt-5 text-xs font-medium uppercase tracking-wide text-brand/60">
          {article.category.name}
        </p>
      )}
      <h2 className="mt-2 text-xl font-semibold tracking-tight text-brand group-hover:underline group-hover:underline-offset-4">
        {article.title}
      </h2>
      {article.excerpt && (
        <p className="mt-3 line-clamp-3 text-muted-foreground">{article.excerpt}</p>
      )}
    </Link>
    <div className="mt-5">
      <AuthorBadge author={article.author} date={formatDate(article.published_at)} />
    </div>
  </article>
);
