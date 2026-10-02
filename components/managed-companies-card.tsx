import { Gem, Target } from "lucide-react";
import Image from "next/image";
import { getTranslations } from "next-intl/server";

import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Link } from "@/i18n/navigation";

export type ManagedCompany = { slug: string; name: string; logo_url: string | null };

type ManagedCompaniesCardProps = {
  companies: ManagedCompany[];
};

export const ManagedCompaniesCard = async ({ companies }: ManagedCompaniesCardProps) => {
  const t = await getTranslations("Company.managedCard");

  if (companies.length === 0) return null;

  return (
    <Card>
      <CardContent>
        <h2 className="font-heading text-lg font-medium">{t("title")}</h2>
        <div className="mt-3 flex flex-col gap-3">
          {companies.map((company) => (
            <Link
              key={company.slug}
              href={`/company/${company.slug}`}
              className="flex items-center gap-2 hover:underline"
            >
              <span className="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-secondary">
                {company.logo_url ? (
                  <Image
                    src={company.logo_url}
                    alt=""
                    width={32}
                    height={32}
                    unoptimized
                    className="size-full object-cover"
                  />
                ) : (
                  <span className="font-heading text-ink-600 text-xs">
                    {company.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </span>
              <span className="wrap-break-word text-base font-medium text-foreground">
                {company.name}
              </span>
            </Link>
          ))}
        </div>

        <Separator className="my-3" />

        <h3 className="text-ink-700 text-base">{t("growTitle")}</h3>
        <div className="mt-2 flex flex-col gap-2">
          <Link href="#" className="flex items-center gap-2 text-base font-medium hover:underline">
            <Gem className="text-primary size-4" strokeWidth={1.5} />
            {t("premiumLink")}
          </Link>
          <Link href="#" className="flex items-center gap-2 text-base font-medium hover:underline">
            <Target className="text-ink-600 size-4" strokeWidth={1.5} />
            {t("adsLink")}
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};
