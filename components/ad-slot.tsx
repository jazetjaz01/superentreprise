import Image from "next/image";
import { useTranslations } from "next-intl";

export const AdSlot = () => {
  const t = useTranslations("Ads");

  return (
    <div className="overflow-hidden rounded-2xl border">
      <a
        href="https://www.letsgo-today.com"
        target="_blank"
        rel="noopener noreferrer sponsored"
        className="block"
      >
        <Image
          src="/publicite/iphone-screen.png"
          alt={t("letsgoAlt")}
          width={1111}
          height={1271}
          className="h-auto w-full"
        />
        <div className="p-4">
          <p className="font-semibold">{t("letsgoTitle")}</p>
          <p className="mt-1 text-sm text-foreground">{t("letsgoBody")}</p>
        </div>
      </a>
      <p className="border-t px-4 py-2 text-xs text-muted-foreground">
        {t("sponsored")}
      </p>
    </div>
  );
};
