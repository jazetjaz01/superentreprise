import { getFormatter, getLocale, getTranslations } from "next-intl/server";

import { AdSlot } from "@/components/ad-slot";
import { type NetworkConnectionSummary } from "@/components/network-connection-card";
import { NetworkView } from "@/components/network-view";
import { NewsSlot } from "@/components/news-slot";
import { PremiumAdSlot } from "@/components/premium-ad-slot";
import { redirect } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";

type FollowRow = {
  follower_id: string;
  created_at: string;
  profiles: {
    slug: string;
    full_name: string | null;
    avatar_url: string | null;
    headline: string | null;
  } | null;
};

export default async function NetworkPage() {
  const t = await getTranslations("Network");
  const tProfile = await getTranslations("Profile");
  const locale = await getLocale();
  const format = await getFormatter();
  const supabase = await createClient();

  const { data: claimsData } = await supabase.auth.getClaims();
  const claims = claimsData?.claims;
  if (!claims) {
    return redirect({ href: "/auth/login", locale });
  }

  const { data: viewerProfile } = await supabase
    .from("profiles")
    .select("full_name, avatar_url")
    .eq("id", claims.sub)
    .maybeSingle();
  const viewerName = viewerProfile?.full_name ?? claims.email ?? tProfile("anonymous");
  const viewerAvatarUrl: string | null = viewerProfile?.avatar_url ?? null;

  const { data: followRows } = await supabase
    .from("follows")
    .select(
      "follower_id, created_at, profiles!follows_follower_id_fkey(slug, full_name, avatar_url, headline)",
    )
    .eq("followee_id", claims.sub)
    .order("created_at", { ascending: false })
    .overrideTypes<FollowRow[], { merge: false }>();

  const connections: NetworkConnectionSummary[] = (followRows ?? []).map((row) => ({
    followerId: row.follower_id,
    name: row.profiles?.full_name ?? tProfile("anonymous"),
    avatarUrl: row.profiles?.avatar_url ?? null,
    headline: row.profiles?.headline ?? null,
    slug: row.profiles?.slug ?? null,
    connectedSinceLabel: t("connectedSince", {
      date: format.dateTime(new Date(row.created_at), { dateStyle: "long" }),
    }),
  }));

  return (
    <div className="mx-auto grid w-full max-w-(--breakpoint-xl) flex-1 content-start gap-4 px-4 py-6 sm:px-6 lg:grid-cols-[minmax(0,1fr)_300px] lg:px-8">
      <NetworkView initialConnections={connections} viewerId={claims.sub} />
      <aside className="sticky top-20 hidden self-start lg:flex lg:flex-col lg:gap-4">
        <NewsSlot />
        <PremiumAdSlot name={viewerName} avatarUrl={viewerAvatarUrl} />
        <AdSlot />
      </aside>
    </div>
  );
}
