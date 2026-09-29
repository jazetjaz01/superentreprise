import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { CompanyFollowButton } from "@/components/company-follow-button";
import { Card, CardContent } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";

type CompanyPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function CompanyPage({ params }: CompanyPageProps) {
  const { slug } = await params;
  const t = await getTranslations("Company.page");
  const tFollow = await getTranslations("Company.follow");
  const supabase = await createClient();

  const [{ data: company }, { data: claimsData }] = await Promise.all([
    supabase
      .from("companies")
      .select(
        "id, name, tagline, about, industry, company_size, website, logo_url, banner_url",
      )
      .eq("slug", slug)
      .maybeSingle(),
    supabase.auth.getClaims(),
  ]);

  if (!company) notFound();

  const viewerId = claimsData?.claims?.sub;

  const [{ count: followerCount }, followingRow, adminRow] = await Promise.all([
    supabase
      .from("company_follows")
      .select("*", { count: "exact", head: true })
      .eq("company_id", company.id),
    viewerId
      ? supabase
          .from("company_follows")
          .select("follower_id")
          .eq("follower_id", viewerId)
          .eq("company_id", company.id)
          .maybeSingle()
      : Promise.resolve({ data: null }),
    viewerId
      ? supabase
          .from("company_admins")
          .select("admin_id")
          .eq("admin_id", viewerId)
          .eq("company_id", company.id)
          .maybeSingle()
      : Promise.resolve({ data: null }),
  ]);

  const isFollowing = !!followingRow?.data;
  const isAdmin = !!adminRow?.data;

  return (
    <div className="w-full flex-1 bg-secondary">
      <div className="mx-auto w-full max-w-(--breakpoint-md) px-4 py-8 sm:px-6">
        <Card className="overflow-hidden pt-0">
          <div className="relative h-37.5 w-full bg-secondary">
            {company.banner_url && (
              <Image src={company.banner_url} alt="" fill unoptimized className="object-cover" />
            )}
          </div>
          <CardContent className="relative p-[27.6px]">
            <div className="-mt-15 flex items-end justify-between gap-3">
              <div className="rounded-full border border-primary bg-background p-1.5">
                <div className="flex size-30 items-center justify-center overflow-hidden rounded-full bg-secondary">
                  {company.logo_url ? (
                    <Image
                      src={company.logo_url}
                      alt=""
                      width={120}
                      height={120}
                      unoptimized
                      className="size-full object-cover"
                    />
                  ) : (
                    <span className="font-heading text-3xl text-ink-600">
                      {company.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
              </div>
              {viewerId && !isAdmin && (
                <CompanyFollowButton
                  viewerId={viewerId}
                  companyId={company.id}
                  initialIsFollowing={isFollowing}
                />
              )}
            </div>

            <h1 className="font-heading mt-3 text-[44px] leading-tight font-normal">
              {company.name}
            </h1>
            {company.tagline && (
              <p className="mt-1 text-[15px] text-foreground">{company.tagline}</p>
            )}
            {isAdmin && (
              <p className="text-ink-600 mt-1 text-sm">{t("admin")}</p>
            )}

            <p className="text-ink-700 mt-3 text-sm">
              {tFollow("followersCount", { count: followerCount ?? 0 })}
            </p>

            {(company.industry || company.company_size || company.website) && (
              <div className="text-ink-600 mt-2 flex flex-col gap-1 text-sm">
                {company.industry && (
                  <p>
                    <span className="text-ink-800">{t("industryLabel")} : </span>
                    {company.industry}
                  </p>
                )}
                {company.company_size && (
                  <p>
                    <span className="text-ink-800">{t("sizeLabel")} : </span>
                    {company.company_size}
                  </p>
                )}
                {company.website && (
                  <p>
                    <span className="text-ink-800">{t("websiteLabel")} : </span>
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {company.website}
                    </a>
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {company.about && (
          <Card className="mt-4">
            <CardContent className="p-[27.6px]">
              <h2 className="font-heading text-2xl font-semibold">{t("about")}</h2>
              <p className="mt-2 whitespace-pre-wrap text-foreground">{company.about}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
