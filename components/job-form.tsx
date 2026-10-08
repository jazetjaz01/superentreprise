"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/client";

const WORKPLACE_TYPES = ["onsite", "hybrid", "remote"] as const;
const EMPLOYMENT_TYPES = ["full_time", "part_time", "contract", "internship"] as const;

const selectClassName =
  "h-9 w-full min-w-0 rounded-md border border-border bg-transparent px-2.5 py-1 text-base transition-colors outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50";

type JobFormProps = {
  companies: { id: string; name: string }[];
  authorId: string;
};

export const JobForm = ({ companies, authorId }: JobFormProps) => {
  const t = useTranslations("Jobs.create");
  const tWorkplace = useTranslations("Jobs.workplaceType");
  const tEmployment = useTranslations("Jobs.employmentType");
  const router = useRouter();

  const [companyId, setCompanyId] = useState(companies[0]?.id ?? "");
  const [title, setTitle] = useState("");
  const [workplaceType, setWorkplaceType] =
    useState<(typeof WORKPLACE_TYPES)[number]>("onsite");
  const [location, setLocation] = useState("");
  const [employmentType, setEmploymentType] =
    useState<(typeof EMPLOYMENT_TYPES)[number]>("full_time");
  const [description, setDescription] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const supabase = createClient();
    const { data, error: insertError } = await supabase
      .from("jobs")
      .insert({
        company_id: companyId,
        author_id: authorId,
        title: title.trim(),
        workplace_type: workplaceType,
        location: location.trim() || null,
        employment_type: employmentType,
        description: description.trim(),
        contact_email: contactEmail.trim(),
      })
      .select("id")
      .single();

    if (insertError || !data) {
      setError(t("error"));
      setIsSubmitting(false);
      return;
    }

    router.push(`/jobs/${data.id}`);
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <Card>
        <CardContent className="flex flex-col gap-4">
          <p className="text-ink-600 text-base">{t("requiredHint")}</p>

          <div className="grid gap-2">
            <Label htmlFor="job-title">{t("jobTitleLabel")}</Label>
            <Input
              id="job-title"
              required
              maxLength={200}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="job-company">{t("companyLabel")}</Label>
            <select
              id="job-company"
              required
              value={companyId}
              onChange={(e) => setCompanyId(e.target.value)}
              className={selectClassName}
            >
              {companies.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="job-workplace-type">{t("workplaceTypeLabel")}</Label>
              <select
                id="job-workplace-type"
                value={workplaceType}
                onChange={(e) =>
                  setWorkplaceType(e.target.value as (typeof WORKPLACE_TYPES)[number])
                }
                className={selectClassName}
              >
                {WORKPLACE_TYPES.map((value) => (
                  <option key={value} value={value}>
                    {tWorkplace(value)}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="job-employment-type">{t("employmentTypeLabel")}</Label>
              <select
                id="job-employment-type"
                value={employmentType}
                onChange={(e) =>
                  setEmploymentType(e.target.value as (typeof EMPLOYMENT_TYPES)[number])
                }
                className={selectClassName}
              >
                {EMPLOYMENT_TYPES.map((value) => (
                  <option key={value} value={value}>
                    {tEmployment(value)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="job-location">{t("locationLabel")}</Label>
            <Input
              id="job-location"
              maxLength={200}
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="job-description">{t("descriptionLabel")}</Label>
            <Textarea
              id="job-description"
              required
              rows={8}
              maxLength={10000}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="job-contact-email">{t("contactEmailLabel")}</Label>
            <Input
              id="job-contact-email"
              type="email"
              required
              maxLength={320}
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
            />
          </div>

          {error && <p className="text-base text-red-500">{error}</p>}

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting || !title.trim() || !description.trim() || !contactEmail.trim()}
          >
            {isSubmitting ? t("submitting") : t("submit")}
          </Button>
        </CardContent>
      </Card>
    </form>
  );
};
