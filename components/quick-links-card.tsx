import { Bookmark, CalendarDays, Newspaper, Users } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@/i18n/navigation";

export const QuickLinksCard = async () => {
  const t = await getTranslations("QuickLinksCard");

  const links = [
    { key: "savedItems", label: t("savedItems"), icon: Bookmark },
    { key: "groups", label: t("groups"), icon: Users },
    { key: "newsletters", label: t("newsletters"), icon: Newspaper },
    { key: "events", label: t("events"), icon: CalendarDays },
  ];

  return (
    <Card>
      <CardContent className="flex flex-col gap-3">
        {links.map(({ key, label, icon: Icon }) => (
          <Link key={key} href="#" className="flex items-center gap-3 hover:underline">
            <Icon className="text-foreground size-4.5" strokeWidth={1.5} />
            <span className="text-base font-medium text-foreground">{label}</span>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
};
