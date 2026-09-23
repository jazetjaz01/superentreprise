import { getTranslations } from "next-intl/server";

import { AdSlot } from "@/components/ad-slot";
import Hero from "@/components/hero";
import ImageCarouselSection from "@/components/image-carousel-section";
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
    return (
      <>
        <ImageCarouselSection />
        <Hero />
      </>
    );
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, avatar_url, banner_url, headline, city, region")
    .eq("id", claims.sub)
    .maybeSingle();

  const name = profile?.full_name ?? claims.email ?? tProfile("anonymous");
  const avatarUrl: string | null =
    profile?.avatar_url ?? claims.user_metadata?.avatar_url ?? null;
  const location = [profile?.city, profile?.region].filter(Boolean).join(", ");

  return (
    <div className="mx-auto grid w-full max-w-(--breakpoint-xl) flex-1 content-start gap-6 px-4 py-6 sm:px-6 md:grid-cols-[240px_minmax(0,1fr)] lg:grid-cols-[240px_minmax(0,1fr)_300px] lg:px-8 ">
      <aside className="hidden md:block">
        <ProfileCard
          name={name}
          avatarUrl={avatarUrl}
          headline={profile?.headline ?? null}
          location={location || null}
          bannerUrl={profile?.banner_url ?? null}
        />
      </aside>
      <main className="mx-auto flex w-full max-w-2xl flex-col gap-4">
        <PostComposer userId={claims.sub} name={name} avatarUrl={avatarUrl} />
        <PostFeed />
      </main>
      <aside className="hidden lg:block">
        <AdSlot />
      </aside>
    </div>
  );
}
