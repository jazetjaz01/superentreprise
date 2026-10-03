import { getTranslations } from "next-intl/server";

import { AdSlot } from "@/components/ad-slot";
import Hero from "@/components/hero";
import ImageCarouselSection from "@/components/image-carousel-section";
import { ManagedCompaniesCard, type ManagedCompany } from "@/components/managed-companies-card";
import { NewsSlot } from "@/components/news-slot";
import { PostComposer } from "@/components/post-composer";
import { PostFeed } from "@/components/post-feed";
import { PremiumAdSlot } from "@/components/premium-ad-slot";
import { ProfileCard } from "@/components/profile-card";
import { QuickLinksCard } from "@/components/quick-links-card";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const tProfile = await getTranslations("Profile");
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;

  if (!claims) {
    return (
      <div className="flex flex-1 flex-col bg-white">
        <Hero />
        <ImageCarouselSection />
        
      </div>
    );
  }

  const [
    { data: profile },
    { count: followerCount },
    { count: followingCount },
    { count: profileViewCount },
    { data: managedCompaniesRows },
  ] = await Promise.all([
    supabase
      .from("profiles")
      .select("full_name, avatar_url, banner_url, headline, city, region")
      .eq("id", claims.sub)
      .maybeSingle(),
    supabase
      .from("follows")
      .select("*", { count: "exact", head: true })
      .eq("followee_id", claims.sub),
    supabase
      .from("follows")
      .select("*", { count: "exact", head: true })
      .eq("follower_id", claims.sub),
    supabase
      .from("profile_views")
      .select("*", { count: "exact", head: true })
      .eq("profile_id", claims.sub),
    supabase
      .from("company_admins")
      .select("companies(slug, name, logo_url, company_follows(count))")
      .eq("admin_id", claims.sub)
      .overrideTypes<
        { companies: (Omit<ManagedCompany, "followerCount"> & { company_follows: { count: number }[] }) | null }[],
        { merge: false }
      >(),
  ]);

  const managedCompanies: ManagedCompany[] = (managedCompaniesRows ?? [])
    .map((row) => row.companies)
    .filter((company): company is NonNullable<typeof company> => !!company)
    .map(({ company_follows, ...company }) => ({
      ...company,
      followerCount: company_follows?.[0]?.count ?? 0,
    }));

  const name = profile?.full_name ?? claims.email ?? tProfile("anonymous");
  const avatarUrl: string | null =
    profile?.avatar_url ?? claims.user_metadata?.avatar_url ?? null;
  const location = [profile?.city, profile?.region].filter(Boolean).join(", ");

  return (
    <div className="mx-auto grid w-full max-w-(--breakpoint-xl) flex-1 content-start gap-6 px-4 py-6 sm:px-6 md:grid-cols-[240px_minmax(0,1fr)] lg:grid-cols-[240px_minmax(0,1fr)_300px] lg:px-8 ">
      <aside className="sticky top-20 hidden self-start md:flex md:flex-col md:gap-4">
        <ProfileCard
          name={name}
          avatarUrl={avatarUrl}
          headline={profile?.headline ?? null}
          location={location || null}
          bannerUrl={profile?.banner_url ?? null}
          followerCount={followerCount ?? 0}
          followingCount={followingCount ?? 0}
          profileViewCount={profileViewCount ?? 0}
        />
        <ManagedCompaniesCard companies={managedCompanies} />
        <QuickLinksCard />
      </aside>
      <main className="mx-auto flex w-full max-w-2xl flex-col gap-4">
        <PostComposer userId={claims.sub} name={name} avatarUrl={avatarUrl} />
        <PostFeed viewerName={name} viewerAvatarUrl={avatarUrl} />
      </main>
      <aside className="sticky top-20 hidden self-start lg:flex lg:flex-col lg:gap-4">
        <NewsSlot />
        <PremiumAdSlot name={name} avatarUrl={avatarUrl} />
        <AdSlot />
      </aside>
    </div>
  );
}
