import Image from "next/image";
import { getFormatter, getTranslations } from "next-intl/server";

import { Card, CardContent } from "@/components/ui/card";
import { UserAvatar } from "@/components/user-avatar";
import { createClient } from "@/lib/supabase/server";

type FeedPost = {
  id: string;
  content: string | null;
  image_path: string | null;
  created_at: string;
  profiles: { full_name: string | null; avatar_url: string | null } | null;
};

export const PostFeed = async () => {
  const t = await getTranslations("Feed");
  const format = await getFormatter();
  const supabase = await createClient();

  const { data } = await supabase
    .from("posts")
    .select("id, content, image_path, created_at, profiles(full_name, avatar_url)")
    .order("created_at", { ascending: false })
    .limit(20)
    .overrideTypes<FeedPost[], { merge: false }>();
  const posts = data ?? [];

  if (posts.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
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

        return (
          <Card key={post.id}>
            <CardContent className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <UserAvatar
                  name={authorName}
                  avatarUrl={post.profiles?.avatar_url}
                  size={48}
                />
                <div className="min-w-0">
                  <p className="font-semibold break-words">{authorName}</p>
                  <p className="text-xs text-muted-foreground">
                    {format.dateTime(new Date(post.created_at), {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </p>
                </div>
              </div>
              {post.content && (
                <p className="break-words whitespace-pre-wrap">{post.content}</p>
              )}
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
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
