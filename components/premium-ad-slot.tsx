import { Crown, MoreHorizontal } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/user-avatar";

type PremiumAdSlotProps = {
  name: string;
  avatarUrl: string | null;
};

export const PremiumAdSlot = async ({ name, avatarUrl }: PremiumAdSlotProps) => {
  const t = await getTranslations("PremiumAd");

  return (
    <div className="overflow-hidden rounded-md border border-border bg-card p-4">
      <div className="flex items-center justify-between">
        <span className="text-primary text-base font-normal tracking-wide uppercase">
          {t("sponsored")}
        </span>
        <MoreHorizontal className="text-muted-foreground size-4" strokeWidth={1.5} />
      </div>

      <p className="mt-2 text-base text-foreground">
        {t("headline", { name })}
      </p>

      <div className="mt-4 flex items-center justify-center gap-3">
        <UserAvatar name={name} avatarUrl={avatarUrl} size={52} />
        <span className="font-heading text-gold-700 flex items-center gap-1 text-lg font-semibold">
          <Crown className="size-4" strokeWidth={1.5} />
          {t("premiumBadge")}
        </span>
      </div>

      <p className="font-heading mt-4 text-center text-[19px] font-normal text-foreground">
        {t("question")}
      </p>

      <div className="mt-4 flex justify-center">
        <Button type="button" variant="default">
          {t("cta")}
        </Button>
      </div>
    </div>
  );
};
