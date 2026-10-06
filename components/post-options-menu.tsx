"use client";

import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import {
  AlertTriangle,
  Bookmark,
  BookmarkCheck,
  CodeXml,
  Eye,
  Flag,
  Link2,
  ThumbsDown,
  UserX,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { createClient } from "@/lib/supabase/client";

type PostOptionsMenuProps = {
  entityName: string;
  postId: string;
  viewerId: string;
  initialIsSaved: boolean;
};

export const PostOptionsMenu = ({
  entityName,
  postId,
  viewerId,
  initialIsSaved,
}: PostOptionsMenuProps) => {
  const t = useTranslations("Feed.options");
  const [open, setOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(initialIsSaved);
  const [isSaving, setIsSaving] = useState(false);

  const handleToggleSave = async () => {
    setIsSaving(true);
    const supabase = createClient();

    if (isSaved) {
      const { error } = await supabase
        .from("saved_posts")
        .delete()
        .eq("profile_id", viewerId)
        .eq("post_id", postId);
      if (!error) setIsSaved(false);
    } else {
      const { error } = await supabase
        .from("saved_posts")
        .insert({ profile_id: viewerId, post_id: postId });
      // A duplicate-key error just means it was already saved; treat as success.
      if (!error || error.code === "23505") setIsSaved(true);
    }
    setIsSaving(false);
    setOpen(false);
  };

  const items = [
    {
      key: "save",
      icon: isSaved ? BookmarkCheck : Bookmark,
      label: isSaved ? t("unsave") : t("save"),
      onClick: handleToggleSave,
    },
    { key: "copyLink", icon: Link2, label: t("copyLink"), onClick: () => {} },
    { key: "embed", icon: CodeXml, label: t("embed"), onClick: () => {} },
    {
      key: "unfollow",
      icon: UserX,
      label: t("unfollow", { name: entityName }),
      onClick: () => {},
    },
    { key: "hide", icon: Eye, label: t("hide", { name: entityName }), onClick: () => {} },
    { key: "notInterested", icon: ThumbsDown, label: t("notInterested"), onClick: () => {} },
    { key: "aiSlop", icon: AlertTriangle, label: t("aiSlop"), onClick: () => {} },
    { key: "report", icon: Flag, label: t("report"), onClick: () => {} },
  ];

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={t("trigger")}
        className="text-ink-600 hover:bg-foreground/[.07] flex size-8 shrink-0 items-center justify-center rounded-full"
      >
        <span className="flex gap-0.5">
          <span className="bg-green-700 size-1 rounded-full" />
          <span className="bg-green-700 size-1 rounded-full" />
          <span className="bg-green-700 size-1 rounded-full" />
        </span>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-sm">
          <VisuallyHidden>
            <DialogHeader>
              <DialogTitle>{t("trigger")}</DialogTitle>
            </DialogHeader>
          </VisuallyHidden>

          <div className="flex flex-col">
            {items.map(({ key, icon: Icon, label, onClick }) => (
              <button
                key={key}
                type="button"
                disabled={key === "save" && isSaving}
                onClick={onClick}
                className="hover:bg-foreground/[.05] flex items-center gap-4 py-3 text-left disabled:opacity-45"
              >
                <Icon className="text-foreground size-5 shrink-0" strokeWidth={1.5} />
                <span className="text-base font-medium">{label}</span>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
