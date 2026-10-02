import { getTranslations } from "next-intl/server";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@/i18n/navigation";

export const CreateCompanyCard = async () => {
  const t = await getTranslations("Company.createCard");

  return (
    <Card>
      <CardContent>
        <h2 className="font-heading text-lg font-semibold">{t("title")}</h2>
        <p className="text-ink-600 mt-1 text-base">{t("description")}</p>
        <Button
          nativeButton={false}
          render={<Link href="/company/new" />}
          variant="outline"
          size="sm"
          className="mt-3 w-full"
        >
          {t("cta")}
        </Button>
      </CardContent>
    </Card>
  );
};
