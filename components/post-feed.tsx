import Image from "next/image";
import { getFormatter, getTranslations } from "next-intl/server";

import { CompanyFollowButton } from "@/components/company-follow-button";
import { FollowButton } from "@/components/follow-button";
import { PostComments, type PostComment } from "@/components/post-comments";
import { PostContent } from "@/components/post-content";
import { PostDeleteButton } from "@/components/post-delete-button";
import { PostEditDialog } from "@/components/post-edit-dialog";
import { PostLikeButton } from "@/components/post-like-button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { UserAvatar } from "@/components/user-avatar";
import { Link } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";

type FeedPost = {
  id: string;
  author_id: string | null;
  company_id: string | null;
  content: string | null;
  image_path: string | null;
  video_path: string | null;
  comments_disabled: boolean;
  created_at: string;
  profiles: {
    slug: string;
    full_name: string | null;
    avatar_url: string | null;
    headline: string | null;
  } | null;
  companies: { slug: string; name: string; logo_url: string | null; tagline: string | null } | null;
};

type PostFeedProps = {
  viewerName: string;
  viewerAvatarUrl: string | null;
  companyId?: string;
};

export const PostFeed = async ({ viewerName, viewerAvatarUrl, companyId }: PostFeedProps) => {
  const t = await getTranslations("Feed");
  const format = await getFormatter();
  const supabase = await createClient();

  let postsQuery = supabase
    .from("posts")
    .select(
      "id, author_id, company_id, content, image_path, video_path, comments_disabled, created_at, profiles!posts_author_id_fkey(slug, full_name, avatar_url, headline), companies(slug, name, logo_url, tagline)",
    )
    .order("created_at", { ascending: false })
    .limit(20);
  if (companyId) {
    postsQuery = postsQuery.eq("company_id", companyId);
  }

  const [{ data }, { data: claimsData }] = await Promise.all([
    postsQuery.overrideTypes<FeedPost[], { merge: false }>(),
    supabase.auth.getClaims(),
  ]);
  const posts = data ?? [];
  const currentUserId = claimsData?.claims?.sub;

  const authorIds = [
    ...new Set(posts.map((post) => post.author_id).filter((id): id is string => !!id)),
  ].filter((authorId) => authorId !== currentUserId);
  const companyIds = [
    ...new Set(posts.map((post) => post.company_id).filter((id): id is string => !!id)),
  ];

  const [{ data: followedRows }, { data: adminCompanyRows }, { data: followedCompanyRows }] =
    await Promise.all([
      currentUserId && authorIds.length > 0
        ? supabase
            .from("follows")
            .select("followee_id")
            .eq("follower_id", currentUserId)
            .in("followee_id", authorIds)
        : Promise.resolve({ data: null }),
      currentUserId && companyIds.length > 0
        ? supabase
            .from("company_admins")
            .select("company_id")
            .eq("admin_id", currentUserId)
            .in("company_id", companyIds)
        : Promise.resolve({ data: null }),
      currentUserId && companyIds.length > 0
        ? supabase
            .from("company_follows")
            .select("company_id")
            .eq("follower_id", currentUserId)
            .in("company_id", companyIds)
        : Promise.resolve({ data: null }),
    ]);
  const followedAuthorIds = new Set((followedRows ?? []).map((row) => row.followee_id));
  const adminCompanyIds = new Set((adminCompanyRows ?? []).map((row) => row.company_id));
  const followedCompanyIds = new Set((followedCompanyRows ?? []).map((row) => row.company_id));

  const postIds = posts.map((post) => post.id);
  const [{ data: likeRows }, { data: commentRows }] =
    postIds.length > 0
      ? await Promise.all([
          supabase.from("post_likes").select("post_id, user_id").in("post_id", postIds),
          supabase
            .from("post_comments")
            .select("id, post_id, author_id, content, created_at, profiles(slug, full_name, avatar_url)")
            .in("post_id", postIds)
            .order("created_at", { ascending: true })
            .overrideTypes<(PostComment & { post_id: string })[], { merge: false }>(),
        ])
      : [{ data: null }, { data: null }];

  const likesByPost = new Map<string, { count: number; likedByViewer: boolean }>();
  for (const row of likeRows ?? []) {
    const entry = likesByPost.get(row.post_id) ?? { count: 0, likedByViewer: false };
    entry.count += 1;
    if (row.user_id === currentUserId) entry.likedByViewer = true;
    likesByPost.set(row.post_id, entry);
  }

  const commentsByPost = new Map<string, PostComment[]>();
  for (const { post_id, ...comment } of commentRows ?? []) {
    const list = commentsByPost.get(post_id) ?? [];
    list.push(comment);
    commentsByPost.set(post_id, list);
  }

  if (posts.length === 0) {
    return (
      <p className="py-8 text-center text-base text-foreground">
        {t("empty")}
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {posts.map((post) => {
        const isCompanyPost = !!post.company_id;
        const entityName = isCompanyPost
          ? (post.companies?.name ?? t("anonymous"))
          : (post.profiles?.full_name ?? t("anonymous"));
        const entityAvatarUrl = isCompanyPost
          ? (post.companies?.logo_url ?? null)
          : (post.profiles?.avatar_url ?? null);
        const entityHeadline = isCompanyPost ? post.companies?.tagline : post.profiles?.headline;
        const entityHref = isCompanyPost
          ? post.companies?.slug
            ? `/company/${post.companies.slug}`
            : null
          : post.profiles?.slug
            ? `/profile/${post.profiles.slug}`
            : null;
        const canManage = isCompanyPost
          ? !!post.company_id && adminCompanyIds.has(post.company_id)
          : currentUserId === post.author_id;
        const imageUrl = post.image_path
          ? supabase.storage.from("post-images").getPublicUrl(post.image_path)
              .data.publicUrl
          : null;
        const likes = likesByPost.get(post.id) ?? { count: 0, likedByViewer: false };
        const comments = commentsByPost.get(post.id) ?? [];
        const videoUrl = post.video_path
          ? supabase.storage.from("post-videos").getPublicUrl(post.video_path)
              .data.publicUrl
          : null;

        return (
          <Card key={post.id}>
            <CardContent className="flex flex-col gap-[13.8px] p-[18.4px]">
              <div className="flex items-center gap-3">
                {entityHref ? (
                  <Link href={entityHref} className="flex min-w-0 items-center gap-3">
                    <UserAvatar name={entityName} avatarUrl={entityAvatarUrl} size={44} />
                    <div className="min-w-0">
                      <p className="font-heading wrap-break-word text-lg font-semibold hover:underline">
                        {entityName}
                      </p>
                      {entityHeadline && (
                        <p className="text-ink-600 truncate text-base">{entityHeadline}</p>
                      )}
                      <p className="text-foreground text-base">
                        {format.dateTime(new Date(post.created_at), {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </p>
                    </div>
                  </Link>
                ) : (
                  <>
                    <UserAvatar name={entityName} avatarUrl={entityAvatarUrl} size={44} />
                    <div className="min-w-0">
                      <p className="font-heading wrap-break-word text-lg font-semibold">
                        {entityName}
                      </p>
                      {entityHeadline && (
                        <p className="text-ink-600 truncate text-base">{entityHeadline}</p>
                      )}
                      <p className="text-foreground text-base">
                        {format.dateTime(new Date(post.created_at), {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </p>
                    </div>
                  </>
                )}
                {canManage ? (
                  <div className="ml-auto flex items-center">
                    <PostEditDialog
                      postId={post.id}
                      content={post.content}
                      imagePath={post.image_path}
                      imageUrl={imageUrl}
                      videoPath={post.video_path}
                      videoUrl={videoUrl}
                      uploaderId={currentUserId ?? ""}
                    />
                    <PostDeleteButton
                      postId={post.id}
                      imagePath={post.image_path}
                      videoPath={post.video_path}
                    />
                  </div>
                ) : (
                  currentUserId &&
                  (isCompanyPost
                    ? post.company_id && (
                        <CompanyFollowButton
                          key={`${post.company_id}-${followedCompanyIds.has(post.company_id)}`}
                          viewerId={currentUserId}
                          companyId={post.company_id}
                          initialIsFollowing={followedCompanyIds.has(post.company_id)}
                          variant="text"
                          className="ml-auto"
                        />
                      )
                    : post.author_id && (
                        <FollowButton
                          key={`${post.author_id}-${followedAuthorIds.has(post.author_id)}`}
                          viewerId={currentUserId}
                          profileId={post.author_id}
                          initialIsFollowing={followedAuthorIds.has(post.author_id)}
                          variant="text"
                          className="ml-auto"
                        />
                      ))
                )}
              </div>
              {post.content && <PostContent content={post.content} />}
              {imageUrl && (
                <div className="overflow-hidden rounded-md">
                  <Image
                    src={imageUrl}
                    alt={t("imageAlt", { name: entityName })}
                    width={1200}
                    height={800}
                    unoptimized
                    className="h-auto w-full"
                  />
                </div>
              )}
              {videoUrl && (
                // eslint-disable-next-line jsx-a11y/media-has-caption
                <video
                  src={videoUrl}
                  controls
                  className="h-auto w-full rounded-md"
                />
              )}

              {currentUserId && (
                <>
                  {(likes.count > 0 || (!post.comments_disabled && comments.length > 0)) && (
                    <p className="text-ink-600 text-base [font-variant-numeric:tabular-nums]">
                      {likes.count > 0 &&
                        t("likeCount", { count: likes.count })}
                      {likes.count > 0 && !post.comments_disabled && comments.length > 0 && " · "}
                      {!post.comments_disabled && comments.length > 0 &&
                        t("commentCount", { count: comments.length })}
                    </p>
                  )}
                  <Separator />
                  <div className="flex items-start gap-1">
                    <PostLikeButton
                      postId={post.id}
                      viewerId={currentUserId}
                      initialIsLiked={likes.likedByViewer}
                    />
                    {!post.comments_disabled && (
                      <PostComments
                        postId={post.id}
                        postAuthorId={post.author_id ?? ""}
                        viewerId={currentUserId}
                        viewerName={viewerName}
                        viewerAvatarUrl={viewerAvatarUrl}
                        initialComments={comments}
                        anonymousLabel={t("anonymous")}
                        className="flex-1"
                      />
                    )}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
