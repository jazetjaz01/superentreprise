import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { ArticleForm } from "@/components/article-form";
import { createClient } from "@/lib/supabase/server";

export default async function WriteArticlePage() {
  const tProfile = await getTranslations("Profile");
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;

  if (!claims) redirect("/auth/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, avatar_url")
    .eq("id", claims.sub)
    .maybeSingle();

  const name = profile?.full_name ?? claims.email ?? tProfile("anonymous");
  const avatarUrl: string | null =
    profile?.avatar_url ?? claims.user_metadata?.avatar_url ?? null;

  return <ArticleForm userId={claims.sub} authorName={name} authorAvatarUrl={avatarUrl} />;
}
