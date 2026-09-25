import Image from "next/image";
import { notFound } from "next/navigation";
import { getFormatter, getTranslations } from "next-intl/server";
import sanitizeHtml from "sanitize-html";

import { ArticleDeleteButton } from "@/components/article-delete-button";
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

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8 sm:px-6">
      <Card className="overflow-hidden pt-0">
        {coverUrl && (
          <div className="relative h-64 w-full sm:h-96">
            <Image src={coverUrl} alt="" fill unoptimized className="object-cover" />
          </div>
        )}
        <CardContent>
          <div className="flex items-start justify-between gap-2">
            <h1 className="text-3xl font-bold">{article.title}</h1>
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

          <div className="mt-4 flex items-center gap-3">
            {author?.slug ? (
              <Link href={`/profile/${author.slug}`} className="flex items-center gap-3">
                <UserAvatar name={authorName} avatarUrl={author.avatar_url} size={40} />
                <span className="font-semibold hover:underline">{authorName}</span>
              </Link>
            ) : (
              <>
                <UserAvatar name={authorName} avatarUrl={null} size={40} />
                <span className="font-semibold">{authorName}</span>
              </>
            )}
            <span className="text-sm text-muted-foreground">
              {format.dateTime(new Date(article.created_at), {
                dateStyle: "medium",
              })}
            </span>
          </div>

          <div
            className="prose prose-lg mt-6 max-w-none text-foreground **:text-foreground"
            // eslint-disable-next-line react/no-danger -- sanitized above with DOMPurify's allowlist
            dangerouslySetInnerHTML={{ __html: contentHtml }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
