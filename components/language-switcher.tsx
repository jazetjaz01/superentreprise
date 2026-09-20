"use client";

import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

export const LanguageSwitcher = () => {
  const t = useTranslations("LanguageSwitcher");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const targetLocale = routing.locales.find((l) => l !== locale) ?? locale;

  return (
    <Button
      variant="ghost"
      aria-label={t("label")}
      onClick={() => router.replace(pathname, { locale: targetLocale })}
    >
      {t(targetLocale)}
    </Button>
  );
};
