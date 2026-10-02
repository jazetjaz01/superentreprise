import Image from "next/image";
import { useTranslations } from "next-intl";

export const AdSlot = () => {
  const t = useTranslations("Ads");

  return (
    <div className="overflow-hidden rounded-md border border-border bg-card">
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
          <p className="font-heading font-medium">{t("letsgoTitle")}</p>
          <p className="mt-1 text-base text-foreground">{t("letsgoBody")}</p>
        </div>
      </a>
      <p className="border-t border-border px-4 py-2 text-base text-foreground">
        {t("sponsored")}
      </p>
    </div>
  );
};
