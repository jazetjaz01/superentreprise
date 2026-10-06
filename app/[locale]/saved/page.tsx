import { Bookmark } from "lucide-react";
import { getFormatter, getLocale, getTranslations } from "next-intl/server";

import { SavedPostCard, type SavedPostSummary } from "@/components/saved-post-card";
import { Card } from "@/components/ui/card";
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
  const t = await getTranslations("Saved");
  const tFeed = await getTranslations("Feed");
  const locale = await getLocale();
  const format = await getFormatter();
  const supabase = await createClient();

  const { data: claimsData } = await supabase.auth.getClaims();
  const claims = claimsData?.claims;
  if (!claims) {
    return redirect({ href: "/auth/login", locale });
  }

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
    <div className="mx-auto grid w-full max-w-(--breakpoint-xl) flex-1 content-start gap-4 px-4 py-6 sm:px-6 md:grid-cols-[240px_minmax(0,1fr)] lg:px-8">
      <aside className="self-start">
        <Card className="overflow-hidden py-0">
          <div className="border-b border-border px-4 py-3">
            <p className="flex items-center gap-2 text-base font-semibold text-foreground">
              <Bookmark className="size-4" strokeWidth={1.5} />
              {t("myItems")}
            </p>
          </div>
          <div className="flex flex-col">
            <span className="border-l-4 border-primary px-4 py-3 text-base font-semibold text-foreground">
              {t("savedPostsLabel")} <span className="text-ink-600">{summaries.length}</span>
            </span>
          </div>
        </Card>
      </aside>

      <main>
        <Card className="overflow-hidden py-0">
          <div className="p-4">
            <h1 className="font-heading text-2xl font-medium">{t("title")}</h1>
            <span className="bg-green-700 mt-3 inline-block rounded-full px-4 py-1.5 text-base font-medium text-white">
              {t("allFilter")}
            </span>
          </div>

          {summaries.length === 0 ? (
            <p className="border-t border-border p-8 text-center text-base text-foreground">
              {t("empty")}
            </p>
          ) : (
            <div className="border-t border-border">
              {summaries.map((post) => (
                <SavedPostCard key={post.postId} post={post} viewerId={claims.sub} />
              ))}
            </div>
          )}
        </Card>
      </main>
    </div>
  );
}
