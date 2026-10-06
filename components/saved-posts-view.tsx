"use client";

import { Bookmark } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { AdSlot } from "@/components/ad-slot";
import { SavedPostCard, type SavedPostSummary } from "@/components/saved-post-card";
import { Card } from "@/components/ui/card";

type SavedPostsViewProps = {
  initialPosts: SavedPostSummary[];
  viewerId: string;
};

export const SavedPostsView = ({ initialPosts, viewerId }: SavedPostsViewProps) => {
  const t = useTranslations("Saved");
  const [posts, setPosts] = useState(initialPosts);

  const handleRemove = (postId: string) => {
    setPosts((current) => current.filter((post) => post.postId !== postId));
  };

  return (
    <div className="mx-auto grid w-full max-w-(--breakpoint-xl) flex-1 content-start gap-4 px-4 py-6 sm:px-6 md:grid-cols-[240px_minmax(0,1fr)] lg:grid-cols-[240px_minmax(0,1fr)_300px] lg:px-8">
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
              {t("savedPostsLabel")} <span className="text-ink-600">{posts.length}</span>
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

          {posts.length === 0 ? (
            <p className="border-t border-border p-8 text-center text-base text-foreground">
              {t("empty")}
            </p>
          ) : (
            <div className="border-t border-border">
              {posts.map((post) => (
                <SavedPostCard
                  key={post.postId}
                  post={post}
                  viewerId={viewerId}
                  onRemoved={() => handleRemove(post.postId)}
                />
              ))}
            </div>
          )}
        </Card>
      </main>

      <aside className="hidden self-start lg:block">
        <AdSlot />
      </aside>
    </div>
  );
};
