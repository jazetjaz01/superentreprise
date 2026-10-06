"use client";

import { Bookmark } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { PostContent } from "@/components/post-content";
import { UserAvatar } from "@/components/user-avatar";
import { Link } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/client";

export type SavedPostSummary = {
  postId: string;
  entityName: string;
  entityAvatarUrl: string | null;
  entityHref: string | null;
  content: string | null;
  imageUrl: string | null;
  dateLabel: string;
};

type SavedPostCardProps = {
  post: SavedPostSummary;
  viewerId: string;
  onRemoved: () => void;
};

export const SavedPostCard = ({ post, viewerId, onRemoved }: SavedPostCardProps) => {
  const t = useTranslations("Saved");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleUnsave = async () => {
    setIsSubmitting(true);
    const supabase = createClient();
    const { error } = await supabase
      .from("saved_posts")
      .delete()
      .eq("profile_id", viewerId)
      .eq("post_id", post.postId);
    setIsSubmitting(false);
    if (!error) onRemoved();
  };

  return (
    <div className="border-b border-border p-4 last:border-b-0">
      <div className="flex items-start gap-3">
        {post.entityHref ? (
          <Link href={post.entityHref} className="flex min-w-0 flex-1 items-center gap-3">
            <UserAvatar name={post.entityName} avatarUrl={post.entityAvatarUrl} size={44} />
            <div className="min-w-0">
              <p className="font-heading wrap-break-word text-base font-semibold hover:underline">
                {post.entityName}
              </p>
              <p className="text-ink-600 text-base">{post.dateLabel}</p>
            </div>
          </Link>
        ) : (
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <UserAvatar name={post.entityName} avatarUrl={post.entityAvatarUrl} size={44} />
            <div className="min-w-0">
              <p className="font-heading wrap-break-word text-base font-semibold">
                {post.entityName}
              </p>
              <p className="text-ink-600 text-base">{post.dateLabel}</p>
            </div>
          </div>
        )}
        <button
          type="button"
          disabled={isSubmitting}
          onClick={handleUnsave}
          aria-label={t("remove")}
          className="text-green-700 hover:bg-foreground/[.07] flex size-8 shrink-0 items-center justify-center rounded-full disabled:opacity-45"
        >
          <Bookmark className="size-5" fill="currentColor" strokeWidth={1.5} />
        </button>
      </div>

      {post.content && (
        <div className="mt-2">
          <PostContent content={post.content} />
        </div>
      )}

      {post.imageUrl && (
        <div className="mt-2 overflow-hidden rounded-md">
          <Image
            src={post.imageUrl}
            alt=""
            width={1200}
            height={800}
            unoptimized
            className="h-auto w-full"
          />
        </div>
      )}
    </div>
  );
};
