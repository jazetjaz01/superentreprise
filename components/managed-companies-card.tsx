import { Activity, Gem, Target } from "lucide-react";
import Image from "next/image";
import { getTranslations } from "next-intl/server";

import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Link } from "@/i18n/navigation";

export type ManagedCompany = {
  slug: string;
  name: string;
  logo_url: string | null;
  followerCount: number;
};

type ManagedCompaniesCardProps = {
  companies: ManagedCompany[];
};

export const ManagedCompaniesCard = async ({ companies }: ManagedCompaniesCardProps) => {
  const t = await getTranslations("Company.managedCard");
  const tSidebar = await getTranslations("Company.adminSidebar");
  const tFollow = await getTranslations("Company.follow");

  if (companies.length === 0) return null;

  return (
    <Card>
      <CardContent>
        <h2 className="font-heading text-lg font-medium">{t("title")}</h2>
        <div className="mt-3 flex flex-col gap-3">
          {companies.map((company) => (
            <div key={company.slug} className="flex items-center gap-2">
              <Link href={`/company/${company.slug}`} className="shrink-0">
                <span className="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-secondary">
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
                    <span className="font-heading text-foreground text-xs">
                      {company.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </span>
              </Link>
              <div className="min-w-0 flex-1">
                <Link
                  href={`/company/${company.slug}`}
                  className="wrap-break-word block text-base font-medium text-foreground hover:underline"
                >
                  {company.name}
                </Link>
                <Link
                  href={`/company/${company.slug}?view=admin&tab=stats`}
                  className="text-ink-600 flex items-center gap-1 text-base hover:underline"
                >
                  <Activity className="size-3.5 shrink-0" strokeWidth={1.5} />
                  <span className="truncate">
                    {tSidebar("activity")} · {tFollow("followersCount", { count: company.followerCount })}
                  </span>
                </Link>
              </div>
            </div>
          ))}
        </div>

        <Separator className="my-3" />

        <h3 className="text-foreground text-base">{t("growTitle")}</h3>
        <div className="mt-2 flex flex-col gap-2">
          <Link href="#" className="flex items-center gap-2 text-base font-medium hover:underline">
            <Gem className="text-foreground size-4" strokeWidth={1.5} />
            {t("premiumLink")}
          </Link>
          <Link href="#" className="flex items-center gap-2 text-base font-medium hover:underline">
            <Target className="text-foreground size-4" strokeWidth={1.5} />
            {t("adsLink")}
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};
