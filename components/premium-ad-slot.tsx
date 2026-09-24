import { Crown, MoreHorizontal } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { UserAvatar } from "@/components/user-avatar";

type PremiumAdSlotProps = {
  name: string;
  avatarUrl: string | null;
};

export const PremiumAdSlot = async ({ name, avatarUrl }: PremiumAdSlotProps) => {
  const t = await getTranslations("PremiumAd");

  return (
    <div className="overflow-hidden rounded-2xl border bg-white p-4">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{t("sponsored")}</span>
        <MoreHorizontal className="size-4 text-muted-foreground" />
      </div>

      <p className="mt-2 text-sm text-foreground">
        {t("headline", { name })}
      </p>

      <div className="mt-4 flex items-center justify-center gap-3">
        <UserAvatar name={name} avatarUrl={avatarUrl} size={56} />
        <span className="flex items-center gap-1 font-semibold text-foreground">
          <Crown className="size-4 fill-amber-400 text-amber-500" />
          {t("premiumBadge")}
        </span>
      </div>

      <p className="mt-4 text-center text-lg font-semibold text-foreground">
        {t("question")}
      </p>

      <div className="mt-4 flex justify-center">
        <button
          type="button"
          className="rounded-full border-2 border-sky-700 px-6 py-2 text-sm font-semibold text-sky-700 transition-colors hover:bg-sky-50"
        >
          {t("cta")}
        </button>
      </div>
    </div>
  );
};
