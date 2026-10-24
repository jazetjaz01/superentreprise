import Image from "next/image";
import Link from "next/link";
import { getLatestArticles } from "@/lib/articles";
import { formatDate } from "@/lib/format";
import { SectionTitle } from "@/components/section-title";

// Colonne latérale : les 3 derniers articles (miniature, titre, date)
export async function LatestArticles({ excludeSlug }: { excludeSlug: string }) {
  const articles = await getLatestArticles(excludeSlug);
  if (articles.length === 0) return null;

  return (
    <aside aria-labelledby="latest-articles-title" className="lg:sticky lg:top-8">
      <SectionTitle>
        <span id="latest-articles-title">Derniers articles</span>
      </SectionTitle>
      <ul className="mt-6 divide-y border-y">
        {articles.map((article) => (
          <li key={article.id}>
            <Link href={`/actualite/${article.slug}`} className="group flex gap-4 py-5">
              <div className="relative aspect-[4/3] w-24 shrink-0 overflow-hidden bg-brand/5">
                {article.cover_image_url ? (
                  <Image
                    src={article.cover_image_url}
                    alt=""
                    fill
                    sizes="96px"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <Image
                    src="/logo.svg"
                    alt=""
                    width={28}
                    height={28}
                    className="absolute inset-0 m-auto size-7 opacity-20"
                  />
                )}
              </div>
              <div className="min-w-0">
                <p className="line-clamp-3 text-sm font-medium leading-snug text-brand group-hover:underline group-hover:underline-offset-4">
                  {article.title}
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  {formatDate(article.published_at)}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
