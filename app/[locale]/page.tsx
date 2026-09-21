import { getTranslations } from "next-intl/server";

import Hero from "@/components/hero";
import { PostComposer } from "@/components/post-composer";
import { PostFeed } from "@/components/post-feed";
import { ProfileCard } from "@/components/profile-card";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const tProfile = await getTranslations("Profile");
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;

  if (!claims) {
    return <Hero />;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, avatar_url, headline")
    .eq("id", claims.sub)
    .maybeSingle();

  const name = profile?.full_name ?? claims.email ?? tProfile("anonymous");
  const avatarUrl: string | null =
    profile?.avatar_url ?? claims.user_metadata?.avatar_url ?? null;

  return (
    <div className="mx-auto grid w-full max-w-(--breakpoint-xl) flex-1 content-start gap-6 px-4 py-6 sm:px-6 md:grid-cols-[240px_minmax(0,1fr)] lg:px-8">
      <aside className="hidden md:block">
        <ProfileCard
          name={name}
          avatarUrl={avatarUrl}
          headline={profile?.headline ?? null}
        />
      </aside>
      <main className="mx-auto flex w-full max-w-2xl flex-col gap-4">
        <PostComposer userId={claims.sub} name={name} avatarUrl={avatarUrl} />
        <PostFeed />
      </main>
    </div>
  );
}
