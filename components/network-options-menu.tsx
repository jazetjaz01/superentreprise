"use client";

import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { UserX } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { createClient } from "@/lib/supabase/client";

type NetworkOptionsMenuProps = {
  followerId: string;
  viewerId: string;
  onRemoved: () => void;
};

export const NetworkOptionsMenu = ({
  followerId,
  viewerId,
  onRemoved,
}: NetworkOptionsMenuProps) => {
  const t = useTranslations("Network");
  const [open, setOpen] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  const handleRemove = async () => {
    setIsRemoving(true);
    const supabase = createClient();
    const { error } = await supabase
      .from("follows")
      .delete()
      .eq("follower_id", followerId)
      .eq("followee_id", viewerId);
    setIsRemoving(false);
    if (!error) {
      setOpen(false);
      onRemoved();
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={t("optionsTrigger")}
        className="text-ink-600 hover:bg-foreground/[.07] flex size-8 shrink-0 items-center justify-center rounded-full"
      >
        <span className="flex gap-0.5">
          <span className="bg-ink-600 size-1 rounded-full" />
          <span className="bg-ink-600 size-1 rounded-full" />
          <span className="bg-ink-600 size-1 rounded-full" />
        </span>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-sm">
          <VisuallyHidden>
            <DialogHeader>
              <DialogTitle>{t("optionsTrigger")}</DialogTitle>
            </DialogHeader>
          </VisuallyHidden>

          <button
            type="button"
            disabled={isRemoving}
            onClick={handleRemove}
            className="hover:bg-foreground/[.05] flex items-center gap-4 py-3 text-left disabled:opacity-45"
          >
            <UserX className="text-destructive size-5 shrink-0" strokeWidth={1.5} />
            <span className="text-destructive text-base font-medium">
              {t("removeRelation")}
            </span>
          </button>
        </DialogContent>
      </Dialog>
    </>
  );
};
