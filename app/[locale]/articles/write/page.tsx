import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { ArticleForm } from "@/components/article-form";
import { createClient } from "@/lib/supabase/server";

export default async function WriteArticlePage() {
  const t = await getTranslations("Articles.write");
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;

  if (!claims) redirect("/auth/login");

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8 sm:px-6">
      <h1 className="mb-4 text-2xl font-semibold">{t("pageTitle")}</h1>
      <ArticleForm userId={claims.sub} />
    </div>
  );
}
