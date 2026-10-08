import { getLocale, getTranslations } from "next-intl/server";

import { JobForm } from "@/components/job-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link, redirect } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";

type AdminCompanyRow = {
  companies: { id: string; name: string } | null;
};

export default async function NewJobPage() {
  const t = await getTranslations("Jobs.create");
  const locale = await getLocale();
  const supabase = await createClient();

  const { data: claimsData } = await supabase.auth.getClaims();
  const claims = claimsData?.claims;
  if (!claims) {
    return redirect({ href: "/auth/login", locale });
  }

  const [{ data: adminRows }, { data: subscription }] = await Promise.all([
    supabase
      .from("company_admins")
      .select("companies(id, name)")
      .eq("admin_id", claims.sub)
      .overrideTypes<AdminCompanyRow[], { merge: false }>(),
    supabase
      .from("subscriptions")
      .select("status")
      .eq("profile_id", claims.sub)
      .eq("plan", "recruiter_pro")
      .in("status", ["active", "trialing"])
      .maybeSingle(),
  ]);

  const companies = (adminRows ?? [])
    .map((row) => row.companies)
    .filter((company): company is NonNullable<typeof company> => !!company);

  if (!subscription) {
    return (
      <div className="mx-auto flex w-full max-w-(--breakpoint-sm) flex-1 flex-col px-4 py-10 sm:px-6">
        <Card>
          <CardContent className="flex flex-col items-center gap-3 text-center">
            <h1 className="font-heading text-xl font-medium">
              {t("needRecruiterProTitle")}
            </h1>
            <p className="text-ink-600 text-base">{t("needRecruiterProDescription")}</p>
            <Button nativeButton={false} render={<Link href="/pricing" />}>
              {t("needRecruiterProCta")}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (companies.length === 0) {
    return (
      <div className="mx-auto flex w-full max-w-(--breakpoint-sm) flex-1 flex-col px-4 py-10 sm:px-6">
        <Card>
          <CardContent className="flex flex-col items-center gap-3 text-center">
            <h1 className="font-heading text-xl font-medium">{t("needCompanyTitle")}</h1>
            <p className="text-ink-600 text-base">{t("needCompanyDescription")}</p>
            <Button nativeButton={false} render={<Link href="/company/new" />}>
              {t("needCompanyCta")}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-(--breakpoint-sm) flex-1 flex-col px-4 py-8 sm:px-6">
      <h1 className="font-heading text-2xl font-medium">{t("pageTitle")}</h1>
      <JobForm companies={companies} authorId={claims.sub} />
    </div>
  );
}
