import { getLocale, getTranslations } from "next-intl/server";

import { Card, CardContent } from "@/components/ui/card";
import { redirect } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";
import { PLANS, type PlanKey } from "@/lib/stripe/plans";

type PricingPageProps = {
  searchParams: Promise<{ company?: string; checkout?: string }>;
};

type SubscriptionRow = {
  plan: PlanKey;
  status: string;
  cancel_at_period_end: boolean;
  company_id: string | null;
};

const PERSONAL_PLANS: PlanKey[] = ["career_pro", "business_pro", "recruiter_pro"];

export default async function PricingPage({ searchParams }: PricingPageProps) {
  const { company: companyId, checkout } = await searchParams;
  const t = await getTranslations("Pricing");
  const locale = await getLocale();
  const supabase = await createClient();

  const { data: claimsData } = await supabase.auth.getClaims();
  const claims = claimsData?.claims;
  if (!claims) {
    return redirect({ href: "/auth/login", locale });
  }

  const [{ data: subscriptionRows }, { data: company }, { data: adminRow }] = await Promise.all([
    supabase
      .from("subscriptions")
      .select("plan, status, cancel_at_period_end, company_id")
      .overrideTypes<SubscriptionRow[], { merge: false }>(),
    companyId
      ? supabase.from("companies").select("id, slug, name").eq("id", companyId).maybeSingle()
      : Promise.resolve({ data: null }),
    companyId
      ? supabase
          .from("company_admins")
          .select("admin_id")
          .eq("company_id", companyId)
          .eq("admin_id", claims.sub)
          .maybeSingle()
      : Promise.resolve({ data: null }),
  ]);

  const subscriptions = subscriptionRows ?? [];
  const personalSubscriptionByPlan = new Map(
    subscriptions.filter((row) => !row.company_id).map((row) => [row.plan, row]),
  );
  const pagePlanSubscription =
    companyId && adminRow ? subscriptions.find((row) => row.company_id === companyId) : undefined;

  return (
    <div className="mx-auto flex w-full max-w-(--breakpoint-xl) flex-1 flex-col gap-6 px-4 py-10 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="font-heading text-2xl font-medium">{t("title")}</h1>
        <p className="text-foreground mt-2 text-base">{t("subtitle")}</p>
        {checkout === "success" && (
          <p className="text-primary mt-4 text-base font-medium">{t("checkoutSuccess")}</p>
        )}
        {checkout === "cancelled" && (
          <p className="mt-4 text-base font-medium text-destructive">{t("checkoutCancelled")}</p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {PERSONAL_PLANS.map((plan) => {
          const subscription = personalSubscriptionByPlan.get(plan);
          const isActive = subscription?.status === "active" || subscription?.status === "trialing";

          return (
            <Card key={plan}>
              <CardContent className="flex flex-col gap-3">
                <h2 className="font-heading text-lg font-medium">{t(`plans.${plan}.name`)}</h2>
                <p className="text-foreground text-base">{t(`plans.${plan}.description`)}</p>
                {isActive ? (
                  <form action="/api/stripe/portal" method="POST">
                    <button
                      type="submit"
                      className="border-border text-foreground hover:bg-foreground/[.07] mt-2 w-full rounded-md border px-4 py-2 text-base font-medium"
                    >
                      {t("manageSubscription")}
                    </button>
                  </form>
                ) : (
                  <form action="/api/stripe/checkout" method="POST">
                    <input type="hidden" name="plan" value={plan} />
                    <button
                      type="submit"
                      className="bg-primary mt-2 w-full rounded-md px-4 py-2 text-base font-medium text-white"
                    >
                      {t("subscribe")}
                    </button>
                  </form>
                )}
              </CardContent>
            </Card>
          );
        })}

        <Card>
          <CardContent className="flex flex-col gap-3">
            <h2 className="font-heading text-lg font-medium">{t("plans.entreprise_pro.name")}</h2>
            <p className="text-foreground text-base">{t("plans.entreprise_pro.description")}</p>
            {!companyId || !company || !adminRow ? (
              <p className="text-ink-600 mt-2 text-base">{t("pagePagerequiresCompany")}</p>
            ) : (
              <>
                <p className="text-foreground text-base font-medium">{company.name}</p>
                {pagePlanSubscription?.status === "active" ||
                pagePlanSubscription?.status === "trialing" ? (
                  <form action="/api/stripe/portal" method="POST">
                    <input type="hidden" name="companyId" value={companyId} />
                    <button
                      type="submit"
                      className="border-border text-foreground hover:bg-foreground/[.07] mt-2 w-full rounded-md border px-4 py-2 text-base font-medium"
                    >
                      {t("manageSubscription")}
                    </button>
                  </form>
                ) : (
                  <form action="/api/stripe/checkout" method="POST">
                    <input type="hidden" name="plan" value={PLANS.entreprise_pro.key} />
                    <input type="hidden" name="companyId" value={companyId} />
                    <button
                      type="submit"
                      className="bg-primary mt-2 w-full rounded-md px-4 py-2 text-base font-medium text-white"
                    >
                      {t("subscribe")}
                    </button>
                  </form>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
