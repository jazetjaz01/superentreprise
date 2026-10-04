"use client";

import { Popover } from "@base-ui/react/popover";
import { Briefcase, HandHeart, Store, UserSearch } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { JobPreferencesDialog, type JobPreferences } from "@/components/job-preferences-dialog";
import { Button } from "@/components/ui/button";

type ProfileGoalsMenuProps = {
  profileId: string;
  jobPreferences: JobPreferences | null;
};

export const ProfileGoalsMenu = ({ profileId, jobPreferences }: ProfileGoalsMenuProps) => {
  const t = useTranslations("ProfilePage.goals");
  const [open, setOpen] = useState(false);
  const [jobPreferencesOpen, setJobPreferencesOpen] = useState(false);

  const items = [
    {
      key: "jobSearch",
      icon: UserSearch,
      title: t("jobSearchTitle"),
      description: t("jobSearchDescription"),
      onSelect: () => setJobPreferencesOpen(true),
    },
    {
      key: "recruiting",
      icon: Briefcase,
      title: t("recruitingTitle"),
      description: t("recruitingDescription"),
      onSelect: () => {},
    },
    {
      key: "services",
      icon: Store,
      title: t("servicesTitle"),
      description: t("servicesDescription"),
      onSelect: () => {},
    },
    {
      key: "volunteering",
      icon: HandHeart,
      title: t("volunteeringTitle"),
      description: t("volunteeringDescription"),
      onSelect: () => {},
    },
  ];

  return (
    <>
      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Trigger
          render={
            <Button
              type="button"
              className="rounded-full border-green-700 bg-green-700 text-white hover:bg-green-800"
            />
          }
        >
          {t("trigger")}
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Positioner sideOffset={8} align="start">
            <Popover.Popup className="w-80 rounded-[7px] border border-border bg-popover p-2 text-foreground shadow-(--shadow-lg) outline-none data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95">
              <div className="flex flex-col divide-y divide-border">
                {items.map(({ key, icon: Icon, title, description, onSelect }) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      onSelect();
                    }}
                    className="hover:bg-foreground/[.05] flex items-start gap-3 px-2 py-3 text-left"
                  >
                    <Icon className="text-foreground mt-0.5 size-5 shrink-0" strokeWidth={1.5} />
                    <span>
                      <span className="block text-base font-medium">{title}</span>
                      <span className="text-ink-600 block text-base">{description}</span>
                    </span>
                  </button>
                ))}
              </div>
            </Popover.Popup>
          </Popover.Positioner>
        </Popover.Portal>
      </Popover.Root>

      <JobPreferencesDialog
        profileId={profileId}
        initialPreferences={jobPreferences}
        open={jobPreferencesOpen}
        onOpenChange={setJobPreferencesOpen}
      />
    </>
  );
};
