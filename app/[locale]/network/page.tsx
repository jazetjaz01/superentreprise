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

type NetworkPageProps = {
  searchParams: Promise<{ q?: string }>;
};

const escapeLike = (value: string) => value.replace(/[\\%_]/g, (char) => `\\${char}`);

export default async function NetworkPage({ searchParams }: NetworkPageProps) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";
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

  const profilesJoin = query
    ? "profiles!inner!follows_follower_id_fkey"
    : "profiles!follows_follower_id_fkey";

  let followsQuery = supabase
    .from("follows")
    .select(`follower_id, created_at, ${profilesJoin}(slug, full_name, avatar_url, headline)`)
    .eq("followee_id", claims.sub)
    .order("created_at", { ascending: false });

  if (query) {
    followsQuery = followsQuery.ilike("profiles.full_name", `%${escapeLike(query)}%`);
  }

  const [{ data: followRows }, { count: totalCount }] = await Promise.all([
    followsQuery.overrideTypes<FollowRow[], { merge: false }>(),
    supabase
      .from("follows")
      .select("*", { count: "exact", head: true })
      .eq("followee_id", claims.sub),
  ]);

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
      <NetworkView
        key={query}
        initialConnections={connections}
        viewerId={claims.sub}
        totalCount={totalCount ?? 0}
        query={query}
      />
      <aside className="sticky top-20 hidden self-start lg:flex lg:flex-col lg:gap-4">
        <NewsSlot />
        <PremiumAdSlot name={viewerName} avatarUrl={viewerAvatarUrl} />
        <AdSlot />
      </aside>
    </div>
  );
}
