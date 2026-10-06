"use client";

import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import {
  AlertTriangle,
  Bookmark,
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

type PostOptionsMenuProps = {
  entityName: string;
};

export const PostOptionsMenu = ({ entityName }: PostOptionsMenuProps) => {
  const t = useTranslations("Feed.options");
  const [open, setOpen] = useState(false);

  const items = [
    { key: "save", icon: Bookmark, label: t("save") },
    { key: "copyLink", icon: Link2, label: t("copyLink") },
    { key: "embed", icon: CodeXml, label: t("embed") },
    { key: "unfollow", icon: UserX, label: t("unfollow", { name: entityName }) },
    { key: "hide", icon: Eye, label: t("hide", { name: entityName }) },
    { key: "notInterested", icon: ThumbsDown, label: t("notInterested") },
    { key: "aiSlop", icon: AlertTriangle, label: t("aiSlop") },
    { key: "report", icon: Flag, label: t("report") },
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
            {items.map(({ key, icon: Icon, label }) => (
              <button
                key={key}
                type="button"
                className="hover:bg-foreground/[.05] flex items-center gap-4 py-3 text-left"
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
