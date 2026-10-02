"use client";

import {
  CalendarDays,
  Briefcase,
  Lightbulb,
  Newspaper,
  Plus,
  SquarePen,
  Store,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { CompanyPostComposer } from "@/components/company-post-composer";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Link } from "@/i18n/navigation";

type CompanyCreateMenuProps = {
  adminUserId: string;
  companyId: string;
  companyName: string;
  companyLogoUrl: string | null;
};

export const CompanyCreateMenu = ({
  adminUserId,
  companyId,
  companyName,
  companyLogoUrl,
}: CompanyCreateMenuProps) => {
  const t = useTranslations("Company.createMenu");
  const tSidebar = useTranslations("Company.adminSidebar");
  const [menuOpen, setMenuOpen] = useState(false);
  const [composerOpen, setComposerOpen] = useState(false);

  const placeholderItems = [
    { key: "event", icon: CalendarDays, title: t("eventTitle"), description: t("eventDescription") },
    { key: "job", icon: Briefcase, title: t("jobTitle"), description: t("jobDescription") },
    { key: "services", icon: Store, title: t("servicesTitle"), description: t("servicesDescription") },
    { key: "article", icon: Newspaper, title: t("articleTitle"), description: t("articleDescription") },
    { key: "ad", icon: Lightbulb, title: t("adTitle"), description: t("adDescription") },
  ];

  return (
    <>
      <Button
        type="button"
        variant="outline"
        className="border-primary text-primary hover:bg-primary/10 mt-3 flex w-full items-center justify-center gap-1.5 rounded-md border px-4 py-2 text-base font-semibold"
        onClick={() => setMenuOpen(true)}
      >
        <Plus className="size-4" strokeWidth={1.5} />
        {tSidebar("create")}
      </Button>

      <Dialog open={menuOpen} onOpenChange={setMenuOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t("title")}</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col divide-y divide-border">
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                setComposerOpen(true);
              }}
              className="hover:bg-foreground/[.05] flex items-start gap-4 py-3 text-left"
            >
              <SquarePen className="text-foreground mt-0.5 size-5 shrink-0" strokeWidth={1.5} />
              <span>
                <span className="block text-base font-semibold">{t("postTitle")}</span>
                <span className="text-ink-600 block text-base">{t("postDescription")}</span>
              </span>
            </button>

            {placeholderItems.map(({ key, icon: Icon, title, description }) => (
              <Link
                key={key}
                href="#"
                className="hover:bg-foreground/[.05] flex items-start gap-4 py-3"
              >
                <Icon className="text-foreground mt-0.5 size-5 shrink-0" strokeWidth={1.5} />
                <span>
                  <span className="block text-base font-semibold">{title}</span>
                  <span className="text-ink-600 block text-base">{description}</span>
                </span>
              </Link>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <CompanyPostComposer
        hideTrigger
        open={composerOpen}
        onOpenChange={setComposerOpen}
        adminUserId={adminUserId}
        companyId={companyId}
        companyName={companyName}
        companyLogoUrl={companyLogoUrl}
      />
    </>
  );
};
