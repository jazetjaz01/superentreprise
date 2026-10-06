import { getFormatter, getLocale, getTranslations } from "next-intl/server";

import { AdSlot } from "@/components/ad-slot";
import { NewsSlot } from "@/components/news-slot";
import { PremiumAdSlot } from "@/components/premium-ad-slot";
import { type SavedPostSummary } from "@/components/saved-post-card";
import { SavedPostsView } from "@/components/saved-posts-view";
import { redirect } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";

type SavedPostRow = {
  post_id: string;
  posts: {
    id: string;
    content: string | null;
    image_path: string | null;
    author_id: string | null;
    company_id: string | null;
    created_at: string;
    profiles: { slug: string; full_name: string | null; avatar_url: string | null } | null;
    companies: { slug: string; name: string; logo_url: string | null } | null;
  } | null;
};

export default async function SavedPage() {
  const tFeed = await getTranslations("Feed");
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

  const { data: savedRows } = await supabase
    .from("saved_posts")
    .select(
      "post_id, posts(id, content, image_path, author_id, company_id, created_at, profiles!posts_author_id_fkey(slug, full_name, avatar_url), companies(slug, name, logo_url))",
    )
    .eq("profile_id", claims.sub)
    .order("created_at", { ascending: false })
    .overrideTypes<SavedPostRow[], { merge: false }>();

  const summaries: SavedPostSummary[] = (savedRows ?? [])
    .map((row) => row.posts)
    .filter((post): post is NonNullable<typeof post> => !!post)
    .map((post) => {
      const isCompanyPost = !!post.company_id;
      const entityName = isCompanyPost
        ? (post.companies?.name ?? tFeed("anonymous"))
        : (post.profiles?.full_name ?? tFeed("anonymous"));
      const entityAvatarUrl = isCompanyPost
        ? (post.companies?.logo_url ?? null)
        : (post.profiles?.avatar_url ?? null);
      const entityHref = isCompanyPost
        ? post.companies?.slug
          ? `/company/${post.companies.slug}`
          : null
        : post.profiles?.slug
          ? `/profile/${post.profiles.slug}`
          : null;
      const imageUrl = post.image_path
        ? supabase.storage.from("post-images").getPublicUrl(post.image_path).data.publicUrl
        : null;

      return {
        postId: post.id,
        entityName,
        entityAvatarUrl,
        entityHref,
        content: post.content,
        imageUrl,
        dateLabel: format.dateTime(new Date(post.created_at), {
          dateStyle: "medium",
          timeStyle: "short",
        }),
      };
    });

  return (
    <div className="mx-auto grid w-full max-w-(--breakpoint-xl) flex-1 content-start gap-4 px-4 py-6 sm:px-6 md:grid-cols-[240px_minmax(0,1fr)] lg:grid-cols-[240px_minmax(0,1fr)_300px] lg:px-8">
      <SavedPostsView initialPosts={summaries} viewerId={claims.sub} />
      <aside className="sticky top-20 hidden self-start lg:flex lg:flex-col lg:gap-4">
        <NewsSlot />
        <PremiumAdSlot name={viewerName} avatarUrl={viewerAvatarUrl} />
        <AdSlot />
      </aside>
    </div>
  );
}
