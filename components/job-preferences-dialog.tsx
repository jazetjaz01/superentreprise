"use client";

import { Check, Plus, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/client";

export type JobPreferences = {
  jobTitles: string[];
  locationTypes: string[];
  locations: string[];
  jobTypes: string[];
};

const EMPTY_PREFERENCES: JobPreferences = {
  jobTitles: [],
  locationTypes: [],
  locations: [],
  jobTypes: [],
};

const LOCATION_TYPE_KEYS = ["onSite", "hybrid", "remote"] as const;
const JOB_TYPE_KEYS = ["fullTime", "partTime", "contract", "internship"] as const;

type TagListProps = {
  values: string[];
  onChange: (next: string[]) => void;
  addLabel: string;
  placeholder: string;
};

const TagList = ({ values, onChange, addLabel, placeholder }: TagListProps) => {
  const [isAdding, setIsAdding] = useState(false);
  const [draft, setDraft] = useState("");

  const commit = () => {
    const trimmed = draft.trim();
    if (trimmed) onChange([...values, trimmed]);
    setDraft("");
    setIsAdding(false);
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {values.map((value, index) => (
        <span
          key={`${value}-${index}`}
          className="flex items-center gap-1.5 rounded-full bg-green-800 px-3.5 py-1.5 text-base font-medium text-white"
        >
          {value}
          <button
            type="button"
            onClick={() => onChange(values.filter((_, i) => i !== index))}
            aria-label={value}
          >
            <X className="size-4" strokeWidth={2} />
          </button>
        </span>
      ))}

      {isAdding ? (
        <span className="flex items-center gap-1.5">
          <Input
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={placeholder}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                commit();
              }
              if (e.key === "Escape") {
                setDraft("");
                setIsAdding(false);
              }
            }}
            className="h-9 w-48"
          />
          <Button type="button" size="icon-sm" onClick={commit}>
            <Check className="size-4" />
          </Button>
        </span>
      ) : (
        <button
          type="button"
          onClick={() => setIsAdding(true)}
          className="text-primary flex items-center gap-1.5 rounded-full border border-border px-3.5 py-1.5 text-base font-medium hover:bg-foreground/[.05]"
        >
          <Plus className="size-4" strokeWidth={2} />
          {addLabel}
        </button>
      )}
    </div>
  );
};

type ToggleChipsProps<K extends string> = {
  options: readonly K[];
  labels: (key: K) => string;
  selected: string[];
  onChange: (next: string[]) => void;
};

const ToggleChips = <K extends string>({ options, labels, selected, onChange }: ToggleChipsProps<K>) => (
  <div className="flex flex-wrap items-center gap-2">
    {options.map((key) => {
      const isSelected = selected.includes(key);
      return (
        <button
          key={key}
          type="button"
          onClick={() =>
            onChange(
              isSelected ? selected.filter((value) => value !== key) : [...selected, key],
            )
          }
          className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-base font-medium ${
            isSelected
              ? "bg-green-800 text-white"
              : "border border-border text-foreground hover:bg-foreground/[.05]"
          }`}
        >
          {labels(key)}
          {isSelected ? <Check className="size-4" strokeWidth={2} /> : <Plus className="size-4" strokeWidth={2} />}
        </button>
      );
    })}
  </div>
);

type JobPreferencesDialogProps = {
  profileId: string;
  initialPreferences: JobPreferences | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const JobPreferencesDialog = ({
  profileId,
  initialPreferences,
  open,
  onOpenChange,
}: JobPreferencesDialogProps) => {
  const t = useTranslations("ProfilePage.jobPreferences");
  const router = useRouter();
  const [preferences, setPreferences] = useState<JobPreferences>(
    initialPreferences ?? EMPTY_PREFERENCES,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleOpenChange = (next: boolean) => {
    onOpenChange(next);
    if (!next) {
      setPreferences(initialPreferences ?? EMPTY_PREFERENCES);
      setError(null);
    }
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    setError(null);

    const supabase = createClient();
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ job_search_preferences: preferences })
      .eq("id", profileId);

    setIsSubmitting(false);
    if (updateError) {
      setError(t("error"));
      return;
    }

    onOpenChange(false);
    router.refresh();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
        </DialogHeader>

        <p className="text-base text-ink-600">{t("subtitle")}</p>
        <p className="text-base text-ink-600">{t("requiredHint")}</p>

        <div className="flex flex-col gap-2">
          <p className="text-base text-ink-600">{t("jobTitlesLabel")}</p>
          <TagList
            values={preferences.jobTitles}
            onChange={(jobTitles) => setPreferences((prev) => ({ ...prev, jobTitles }))}
            addLabel={t("addJobTitle")}
            placeholder={t("jobTitlePlaceholder")}
          />
        </div>

        <Separator />

        <div className="flex flex-col gap-2">
          <p className="text-base text-ink-600">{t("locationTypesLabel")}</p>
          <ToggleChips
            options={LOCATION_TYPE_KEYS}
            labels={(key) => t(`locationTypes.${key}`)}
            selected={preferences.locationTypes}
            onChange={(locationTypes) => setPreferences((prev) => ({ ...prev, locationTypes }))}
          />
        </div>

        <Separator />

        <div className="flex flex-col gap-2">
          <p className="text-base text-ink-600">{t("locationsLabel")}</p>
          <TagList
            values={preferences.locations}
            onChange={(locations) => setPreferences((prev) => ({ ...prev, locations }))}
            addLabel={t("addLocation")}
            placeholder={t("locationPlaceholder")}
          />
        </div>

        <Separator />

        <div className="flex flex-col gap-2">
          <p className="text-base text-ink-600">{t("jobTypesLabel")}</p>
          <ToggleChips
            options={JOB_TYPE_KEYS}
            labels={(key) => t(`jobTypes.${key}`)}
            selected={preferences.jobTypes}
            onChange={(jobTypes) => setPreferences((prev) => ({ ...prev, jobTypes }))}
          />
        </div>

        {error && <p className="text-base text-red-500">{error}</p>}

        <Separator />

        <div className="flex justify-end">
          <Button type="button" onClick={handleSave} disabled={isSubmitting}>
            {isSubmitting ? t("saving") : t("save")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
