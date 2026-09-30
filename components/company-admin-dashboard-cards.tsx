import { MessagesSquare, Newspaper, Plus } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { CompanyPostComposer } from "@/components/company-post-composer";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";

type CompanyAdminDashboardCardsProps = {
  adminUserId: string;
  companyId: string;
  companyName: string;
  companyLogoUrl: string | null;
};

export const CompanyAdminDashboardCards = async ({
  adminUserId,
  companyId,
  companyName,
  companyLogoUrl,
}: CompanyAdminDashboardCardsProps) => {
  const t = await getTranslations("Company.adminDashboard");
  const supabase = await createClient();

  const ninetyDaysAgo = new Date();
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
  const { count: recentPostCount } = await supabase
    .from("posts")
    .select("*", { count: "exact", head: true })
    .eq("company_id", companyId)
    .gte("created_at", ninetyDaysAgo.toISOString());
  const hasRecentPosts = (recentPostCount ?? 0) > 0;

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardContent className="p-[27.6px]">
          <h2 className="font-heading text-2xl font-semibold">{t("managePostsTitle")}</h2>
          <p className="text-ink-600 mt-1 text-sm">
            {t("managePostsDescription")}{" "}
            <Link href="#" className="text-primary hover:underline">
              {t("learnMore")}
            </Link>
          </p>

          {hasRecentPosts ? (
            <div className="mt-6 flex flex-col items-center text-center">
              <div className="flex size-24 items-center justify-center rounded-full bg-secondary">
                <Newspaper className="text-ink-500 size-9" strokeWidth={1.5} />
              </div>
              <p className="font-heading mt-4 text-lg font-semibold">
                {t("recentPostsCount", { count: recentPostCount ?? 0 })}
              </p>
              <div className="mt-4 flex items-center gap-3">
                <Link
                  href="/"
                  className="border-primary text-primary hover:bg-primary/10 flex items-center gap-1.5 rounded-full border px-5 py-2 text-sm font-semibold"
                >
                  {t("viewPosts")}
                </Link>
                <CompanyPostComposer
                  adminUserId={adminUserId}
                  companyId={companyId}
                  companyName={companyName}
                  companyLogoUrl={companyLogoUrl}
                />
              </div>
            </div>
          ) : (
            <div className="mt-6 flex flex-col items-center text-center">
              <div className="flex size-24 items-center justify-center rounded-full bg-secondary">
                <Newspaper className="text-ink-500 size-9" strokeWidth={1.5} />
              </div>
              <p className="font-heading mt-4 text-lg font-semibold">
                {t("managePostsEmptyTitle")}
              </p>
              <p className="text-ink-600 mt-1 text-sm">{t("managePostsEmptySubtitle")}</p>
              <div className="mt-4">
                <CompanyPostComposer
                  adminUserId={adminUserId}
                  companyId={companyId}
                  companyName={companyName}
                  companyLogoUrl={companyLogoUrl}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-[27.6px]">
          <h2 className="font-heading text-2xl font-semibold">{t("discussionsTitle")}</h2>
          <p className="text-ink-600 mt-1 text-sm">{t("discussionsDescription")}</p>

          <div className="mt-6 flex flex-col items-center text-center">
            <div className="flex size-24 items-center justify-center rounded-full bg-secondary">
              <MessagesSquare className="text-ink-500 size-9" strokeWidth={1.5} />
            </div>
            <p className="font-heading mt-4 text-lg font-semibold">
              {t("discussionsEmptyTitle")}
            </p>
            <p className="text-ink-600 mt-1 text-sm">{t("discussionsEmptySubtitle")}</p>
            <Link
              href="#"
              className="border-primary text-primary hover:bg-primary/10 mt-4 flex items-center gap-1.5 rounded-full border px-5 py-2 text-sm font-semibold"
            >
              <Plus className="size-4" strokeWidth={1.5} />
              {t("followPages")}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
