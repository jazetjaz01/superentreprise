import Image from "next/image";
import { getFormatter, getTranslations } from "next-intl/server";

import { FollowButton } from "@/components/follow-button";
import { PostComments, type PostComment } from "@/components/post-comments";
import { PostContent } from "@/components/post-content";
import { PostDeleteButton } from "@/components/post-delete-button";
import { PostEditDialog } from "@/components/post-edit-dialog";
import { PostLikeButton } from "@/components/post-like-button";
import { Card, CardContent } from "@/components/ui/card";
import { UserAvatar } from "@/components/user-avatar";
import { Link } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";

type FeedPost = {
  id: string;
  author_id: string;
  content: string | null;
  image_path: string | null;
  video_path: string | null;
  created_at: string;
  profiles: { slug: string; full_name: string | null; avatar_url: string | null } | null;
};

type PostFeedProps = {
  viewerName: string;
  viewerAvatarUrl: string | null;
};

export const PostFeed = async ({ viewerName, viewerAvatarUrl }: PostFeedProps) => {
  const t = await getTranslations("Feed");
  const format = await getFormatter();
  const supabase = await createClient();

  const [{ data }, { data: claimsData }] = await Promise.all([
    supabase
      .from("posts")
      .select(
        "id, author_id, content, image_path, video_path, created_at, profiles!posts_author_id_fkey(slug, full_name, avatar_url)",
      )
      .order("created_at", { ascending: false })
      .limit(20)
      .overrideTypes<FeedPost[], { merge: false }>(),
    supabase.auth.getClaims(),
  ]);
  const posts = data ?? [];
  const currentUserId = claimsData?.claims?.sub;

  const authorIds = [...new Set(posts.map((post) => post.author_id))].filter(
    (authorId) => authorId !== currentUserId,
  );
  const { data: followedRows } =
    currentUserId && authorIds.length > 0
      ? await supabase
          .from("follows")
          .select("followee_id")
          .eq("follower_id", currentUserId)
          .in("followee_id", authorIds)
      : { data: null };
  const followedAuthorIds = new Set((followedRows ?? []).map((row) => row.followee_id));

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
      <p className="py-8 text-center text-sm text-foreground">
        {t("empty")}
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {posts.map((post) => {
        const authorName = post.profiles?.full_name ?? t("anonymous");
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
            <CardContent className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                {post.profiles?.slug ? (
                  <Link
                    href={`/profile/${post.profiles.slug}`}
                    className="flex min-w-0 items-center gap-3"
                  >
                    <UserAvatar
                      name={authorName}
                      avatarUrl={post.profiles?.avatar_url}
                      size={48}
                    />
                    <div className="min-w-0">
                      <p className="font-semibold break-words hover:underline">{authorName}</p>
                      <p className="text-xs text-foreground">
                        {format.dateTime(new Date(post.created_at), {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </p>
                    </div>
                  </Link>
                ) : (
                  <>
                    <UserAvatar
                      name={authorName}
                      avatarUrl={post.profiles?.avatar_url}
                      size={48}
                    />
                    <div className="min-w-0">
                      <p className="font-semibold break-words">{authorName}</p>
                      <p className="text-xs text-foreground">
                        {format.dateTime(new Date(post.created_at), {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </p>
                    </div>
                  </>
                )}
                {currentUserId === post.author_id ? (
                  <div className="ml-auto flex items-center">
                    <PostEditDialog postId={post.id} content={post.content} />
                    <PostDeleteButton
                      postId={post.id}
                      imagePath={post.image_path}
                      videoPath={post.video_path}
                    />
                  </div>
                ) : (
                  currentUserId && (
                    <FollowButton
                      key={`${post.author_id}-${followedAuthorIds.has(post.author_id)}`}
                      viewerId={currentUserId}
                      profileId={post.author_id}
                      initialIsFollowing={followedAuthorIds.has(post.author_id)}
                      variant="text"
                      className="ml-auto"
                    />
                  )
                )}
              </div>
              {post.content && <PostContent content={post.content} />}
              {imageUrl && (
                <Image
                  src={imageUrl}
                  alt={t("imageAlt", { name: authorName })}
                  width={1200}
                  height={800}
                  unoptimized
                  className="h-auto w-full rounded-lg"
                />
              )}
              {videoUrl && (
                // eslint-disable-next-line jsx-a11y/media-has-caption
                <video
                  src={videoUrl}
                  controls
                  className="h-auto w-full rounded-lg"
                />
              )}

              {currentUserId && (
                <div className="flex items-start gap-1 border-t pt-2">
                  <PostLikeButton
                    postId={post.id}
                    viewerId={currentUserId}
                    initialLikeCount={likes.count}
                    initialIsLiked={likes.likedByViewer}
                  />
                  <PostComments
                    postId={post.id}
                    postAuthorId={post.author_id}
                    viewerId={currentUserId}
                    viewerName={viewerName}
                    viewerAvatarUrl={viewerAvatarUrl}
                    initialComments={comments}
                    anonymousLabel={t("anonymous")}
                    className="flex-1"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
