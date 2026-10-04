"use client";

import { Briefcase, EyeOff, HandHeart, Store, UserSearch } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { JobPreferencesDialog, type JobPreferences } from "@/components/job-preferences-dialog";
import { Card, CardContent } from "@/components/ui/card";

const hasAnyPreference = (preferences: JobPreferences | null) =>
  !!preferences &&
  (preferences.jobTitles.length > 0 ||
    preferences.locationTypes.length > 0 ||
    preferences.locations.length > 0 ||
    preferences.jobTypes.length > 0);

type ProfileGoalsCardProps = {
  profileId: string;
  jobPreferences: JobPreferences | null;
};

export const ProfileGoalsCard = ({ profileId, jobPreferences }: ProfileGoalsCardProps) => {
  const t = useTranslations("ProfilePage.goals");
  const [jobPreferencesOpen, setJobPreferencesOpen] = useState(false);
  const isJobSearchActive = hasAnyPreference(jobPreferences);

  const items = [
    {
      key: "jobSearch",
      icon: UserSearch,
      title: t("jobSearchTitle"),
      isActive: isJobSearchActive,
      onSelect: () => setJobPreferencesOpen(true),
    },
    {
      key: "recruiting",
      icon: Briefcase,
      title: t("recruitingTitle"),
      isActive: false,
      onSelect: () => {},
    },
    {
      key: "services",
      icon: Store,
      title: t("servicesTitle"),
      isActive: false,
      onSelect: () => {},
    },
    {
      key: "volunteering",
      icon: HandHeart,
      title: t("volunteeringTitle"),
      isActive: false,
      onSelect: () => {},
    },
  ];

  return (
    <>
      <Card className="mt-4">
        <CardContent className="p-[27.6px]">
          <h2 className="font-heading flex items-center gap-2 text-2xl font-medium">
            {t("trigger")}
            <EyeOff
              className="text-ink-600 size-4 shrink-0"
              strokeWidth={1.5}
              aria-label={t("privateHint")}
            />
          </h2>
          <p className="text-ink-600 mt-1 text-base">{t("privateHint")}</p>
          <div className="mt-3 flex flex-wrap gap-4">
            {items.map(({ key, icon: Icon, title, isActive, onSelect }) => (
              <button
                key={key}
                type="button"
                onClick={onSelect}
                className={`flex items-center gap-2 text-base font-medium hover:underline ${
                  isActive ? "text-green-700" : "text-foreground"
                }`}
              >
                <Icon className="size-4 shrink-0" strokeWidth={1.5} />
                {title}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <JobPreferencesDialog
        profileId={profileId}
        initialPreferences={jobPreferences}
        open={jobPreferencesOpen}
        onOpenChange={setJobPreferencesOpen}
      />
    </>
  );
};
