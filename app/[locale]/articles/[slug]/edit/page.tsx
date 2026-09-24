import { notFound, redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { ArticleForm } from "@/components/article-form";
import { createClient } from "@/lib/supabase/server";

type EditArticlePageProps = {
  params: Promise<{ slug: string }>;
};

export default async function EditArticlePage({ params }: EditArticlePageProps) {
  const { slug } = await params;
  const t = await getTranslations("Articles.write");
  const supabase = await createClient();

  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;
  if (!claims) redirect("/auth/login");

  const { data: article } = await supabase
    .from("articles")
    .select("id, author_id, title, content, cover_image_path")
    .eq("slug", slug)
    .maybeSingle();

  if (!article) notFound();
  if (article.author_id !== claims.sub) redirect(`/articles/${slug}`);

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8 sm:px-6">
      <h1 className="mb-4 text-2xl font-semibold">{t("editPageTitle")}</h1>
      <ArticleForm
        userId={claims.sub}
        article={{
          id: article.id,
          slug,
          title: article.title,
          content: article.content,
          coverImagePath: article.cover_image_path,
        }}
      />
    </div>
  );
}
