import { useTranslations } from "next-intl";

export const AdSlot = () => {
  const t = useTranslations("Ads");

  return (
    <div className="flex h-64 items-center justify-center rounded-2xl border border-dashed text-center text-sm text-foreground">
      {t("placeholder")}
    </div>
  );
};
