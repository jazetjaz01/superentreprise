import { Rss } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { FindCompaniesDialog } from "@/components/find-companies-dialog";
import { Card, CardContent } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";

type CompanyFeedTabProps = {
  viewerId: string;
};

export const CompanyFeedTab = async ({ viewerId }: CompanyFeedTabProps) => {
  const t = await getTranslations("Company.discoverPages");
  const supabase = await createClient();

  const { data: adminRows } = await supabase
    .from("company_admins")
    .select("company_id")
    .eq("admin_id", viewerId);
  const managedCompanyIds = (adminRows ?? []).map((row) => row.company_id);

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardContent className="p-[27.6px]">
          <h2 className="font-heading text-2xl font-medium">{t("feedTitle")}</h2>
          <p className="text-ink-600 mt-1 text-base">{t("feedSubtitle")}</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex flex-col items-center p-[27.6px] text-center">
          <div className="flex size-24 items-center justify-center rounded-full bg-secondary">
            <Rss className="text-ink-500 size-9" strokeWidth={1.5} />
          </div>
          <p className="font-heading mt-4 text-lg font-medium">{t("emptyTitle")}</p>
          <p className="text-ink-600 mt-1 max-w-md text-base">{t("emptyDescription")}</p>
          <div className="mt-4">
            <FindCompaniesDialog viewerId={viewerId} excludeCompanyIds={managedCompanyIds} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
