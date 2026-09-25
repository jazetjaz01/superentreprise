import { notFound, redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { ArticleForm } from "@/components/article-form";
import { createClient } from "@/lib/supabase/server";

type EditArticlePageProps = {
  params: Promise<{ slug: string }>;
};

export default async function EditArticlePage({ params }: EditArticlePageProps) {
  const { slug } = await params;
  const tProfile = await getTranslations("Profile");
  const supabase = await createClient();

  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;
  if (!claims) redirect("/auth/login");

  const [{ data: article }, { data: profile }] = await Promise.all([
    supabase
      .from("articles")
      .select("id, author_id, title, content, cover_image_path")
      .eq("slug", slug)
      .maybeSingle(),
    supabase
      .from("profiles")
      .select("full_name, avatar_url")
      .eq("id", claims.sub)
      .maybeSingle(),
  ]);

  if (!article) notFound();
  if (article.author_id !== claims.sub) redirect(`/articles/${slug}`);

  const name = profile?.full_name ?? claims.email ?? tProfile("anonymous");
  const avatarUrl: string | null =
    profile?.avatar_url ?? claims.user_metadata?.avatar_url ?? null;

  return (
    <ArticleForm
      userId={claims.sub}
      authorName={name}
      authorAvatarUrl={avatarUrl}
      article={{
        id: article.id,
        slug,
        title: article.title,
        content: article.content,
        coverImagePath: article.cover_image_path,
      }}
    />
  );
}
