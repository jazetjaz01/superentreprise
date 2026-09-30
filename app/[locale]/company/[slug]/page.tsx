import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { CompanyAdminDashboardCards } from "@/components/company-admin-dashboard-cards";
import { CompanyAdminSidebar } from "@/components/company-admin-sidebar";
import { CompanyBanner } from "@/components/company-banner";
import { CompanyFollowButton } from "@/components/company-follow-button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";

type CompanyPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ view?: string }>;
};

export default async function CompanyPage({ params, searchParams }: CompanyPageProps) {
  const { slug } = await params;
  const { view } = await searchParams;
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
  const isRealAdmin = !!adminRow?.data;
  const isAdminView = isRealAdmin && view === "admin";

  return (
    <>
      {isRealAdmin && (
        <div className="bg-primary flex items-center justify-between gap-4 px-4 py-3 text-white sm:px-6 lg:px-8">
          <p className="text-sm font-semibold">
            {isAdminView ? t("viewingAsAdmin") : t("viewingAsMember")}
          </p>
          <Link
            href={`/company/${slug}${isAdminView ? "" : "?view=admin"}`}
            className="shrink-0 rounded-full border border-white px-4 py-1.5 text-sm font-semibold hover:bg-white/10"
          >
            {isAdminView ? t("switchToMember") : t("switchToAdmin")}
          </Link>
        </div>
      )}
      <div className="w-full flex-1 bg-secondary">
        <div
          className={`mx-auto grid w-full max-w-(--breakpoint-xl) gap-4 px-4 py-8 sm:px-6 lg:px-8 ${
            isAdminView
              ? "lg:grid-cols-[240px_minmax(0,1fr)]"
              : "lg:grid-cols-[minmax(0,1fr)_300px]"
          }`}
        >
        {isAdminView && (
          <aside className="hidden self-start lg:block">
            <CompanyAdminSidebar
              companyId={company.id}
              slug={slug}
              name={company.name}
              tagline={company.tagline}
              industry={company.industry}
              companySize={company.company_size}
              website={company.website}
              about={company.about}
              logoUrl={company.logo_url}
              bannerUrl={company.banner_url}
              followerCount={followerCount ?? 0}
            />
          </aside>
        )}
        <div className="min-w-0">
          {!isAdminView && (
            <>
              <Card className="overflow-hidden pt-0">
                <CompanyBanner
                  companyId={company.id}
                  bannerUrl={company.banner_url}
                  isAdmin={isAdminView}
                />
                <CardContent className="relative p-[27.6px]">
                  <div className="-mt-24 flex items-end gap-3">
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
                  </div>

                  <h1 className="font-heading mt-3 text-[26px] leading-tight font-semibold">
                    {company.name}
                  </h1>
                  {company.tagline && (
                    <p className="mt-1 text-[15px] text-foreground">{company.tagline}</p>
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
            </>
          )}

          {isAdminView && viewerId && (
            <CompanyAdminDashboardCards
              adminUserId={viewerId}
              companyId={company.id}
              companyName={company.name}
              companyLogoUrl={company.logo_url}
            />
          )}
        </div>

        {!isAdminView && (
          <div className="flex flex-col gap-4">
            <Card>
              <CardContent>
                <h2 className="font-heading text-lg font-semibold">{t("followCardTitle")}</h2>
                <p className="text-ink-700 mt-2 text-sm">
                  {tFollow("followersCount", { count: followerCount ?? 0 })}
                </p>
                {viewerId && (
                  <CompanyFollowButton
                    viewerId={viewerId}
                    companyId={company.id}
                    initialIsFollowing={isFollowing}
                  />
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
    </>
  );
}
