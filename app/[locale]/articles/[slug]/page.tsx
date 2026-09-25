import { Info } from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getFormatter, getTranslations } from "next-intl/server";
import sanitizeHtml from "sanitize-html";

import { ArticleBanner } from "@/components/article-banner";
import { ArticleDeleteButton } from "@/components/article-delete-button";
import { ArticleShareButton } from "@/components/article-share-button";
import { NewsSlot } from "@/components/news-slot";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { UserAvatar } from "@/components/user-avatar";
import { Link } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";

type ArticlePageProps = {
  params: Promise<{ slug: string }>;
};

type ArticleRow = {
  id: string;
  author_id: string;
  title: string;
  content: string;
  cover_image_path: string | null;
  created_at: string;
  profiles: { slug: string; full_name: string | null; avatar_url: string | null } | null;
};

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const t = await getTranslations("Articles");
  const format = await getFormatter();
  const supabase = await createClient();

  const [{ data: article }, { data: claimsData }] = await Promise.all([
    supabase
      .from("articles")
      .select(
        "id, author_id, title, content, cover_image_path, created_at, profiles(slug, full_name, avatar_url)",
      )
      .eq("slug", slug)
      .maybeSingle()
      .overrideTypes<ArticleRow, { merge: false }>(),
    supabase.auth.getClaims(),
  ]);

  if (!article) notFound();

  const isOwnArticle = claimsData?.claims?.sub === article.author_id;
  const author = article.profiles;
  const authorName = author?.full_name ?? t("anonymous");
  const coverUrl = article.cover_image_path
    ? supabase.storage.from("article-covers").getPublicUrl(article.cover_image_path)
        .data.publicUrl
    : null;
  const contentHtml = sanitizeHtml(article.content, {
    allowedTags: [
      "p",
      "br",
      "strong",
      "em",
      "s",
      "code",
      "pre",
      "blockquote",
      "ul",
      "ol",
      "li",
      "h2",
      "h3",
      "a",
      "img",
      "hr",
    ],
    allowedAttributes: {
      a: ["href", "target", "rel"],
      img: ["src", "alt"],
    },
    allowedSchemes: ["http", "https"],
  });
  const plainText = sanitizeHtml(article.content, { allowedTags: [], allowedAttributes: {} })
    .replace(/\s+/g, " ")
    .trim();
  const introText =
    plainText.length > 220 ? `${plainText.slice(0, 220).trimEnd()}…` : plainText;

  return (
    <div className="mx-auto grid w-full max-w-(--breakpoint-xl) gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_300px] lg:px-8">
      <Card className="gap-0 overflow-hidden pt-0">
        <ArticleBanner />

        <CardContent className="px-4  pb-4 sm:px-12  sm:pb-12">
          <div className="bg-slate-100 p-8 sm:p-12">
            <p className="text-sm text-muted-foreground">
              {t("publishedTimeAgo", { time: format.relativeTime(new Date(article.created_at)) })}
            </p>

            {introText && <p className="mt-2 text-foreground">{introText}</p>}

            <div className="mt-6 flex items-center justify-between gap-2">
              <h2 className="text-lg font-bold text-foreground">{t("articleContent")}</h2>
              {isOwnArticle && (
                <div className="flex shrink-0 items-center gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    nativeButton={false}
                    render={<Link href={`/articles/${slug}/edit`} />}
                  >
                    {t("edit")}
                  </Button>
                  <ArticleDeleteButton
                    articleId={article.id}
                    coverImagePath={article.cover_image_path}
                  />
                </div>
              )}
            </div>

            <div className="mt-4 rounded-xl border bg-white p-6">
              <div className="flex items-start justify-between gap-3">
                <h1 className="text-3xl font-bold text-foreground">{article.title}</h1>
                <ArticleShareButton path={`/articles/${slug}`} />
              </div>

              <div className="mt-3 flex items-center gap-2">
                {author?.slug ? (
                  <Link href={`/profile/${author.slug}`} className="flex items-center gap-3">
                    <UserAvatar name={authorName} avatarUrl={author.avatar_url} size={32} />
                    <span className="text-sm font-semibold hover:underline">{authorName}</span>
                  </Link>
                ) : (
                  <>
                    <UserAvatar name={authorName} avatarUrl={null} size={32} />
                    <span className="text-sm font-semibold">{authorName}</span>
                  </>
                )}
                <Info className="size-3.5 shrink-0 text-muted-foreground" />
              </div>

              <div
                className="prose prose-sm mt-4 max-w-none font-normal text-foreground **:font-normal **:text-foreground"
                // eslint-disable-next-line react/no-danger -- sanitized above with DOMPurify's allowlist
                dangerouslySetInnerHTML={{ __html: contentHtml }}
              />

              {coverUrl && (
                <div className="relative -mx-6 -mb-6 mt-6 h-56 overflow-hidden rounded-b-xl sm:h-72">
                  <Image src={coverUrl} alt="" fill unoptimized className="object-cover" />
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <aside className="hidden lg:block">
        <NewsSlot />
      </aside>
    </div>
  );
}
