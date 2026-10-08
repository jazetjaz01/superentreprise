import { notFound } from "next/navigation";
import { getFormatter, getTranslations } from "next-intl/server";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { UserAvatar } from "@/components/user-avatar";
import { Link } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";

type JobPageProps = {
  params: Promise<{ id: string }>;
};

type JobRow = {
  id: string;
  title: string;
  workplace_type: "onsite" | "hybrid" | "remote";
  location: string | null;
  employment_type: "full_time" | "part_time" | "contract" | "internship";
  description: string;
  contact_email: string;
  created_at: string;
  companies: { name: string; slug: string; logo_url: string | null } | null;
};

export default async function JobPage({ params }: JobPageProps) {
  const { id } = await params;
  const t = await getTranslations("Jobs");
  const format = await getFormatter();
  const supabase = await createClient();

  const { data: job } = await supabase
    .from("jobs")
    .select(
      "id, title, workplace_type, location, employment_type, description, contact_email, created_at, companies(name, slug, logo_url)",
    )
    .eq("id", id)
    .maybeSingle()
    .overrideTypes<JobRow, { merge: false }>();

  if (!job) notFound();

  const mailto = `mailto:${job.contact_email}?subject=${encodeURIComponent(
    t("applyEmailSubject", { title: job.title }),
  )}`;

  return (
    <div className="mx-auto flex w-full max-w-(--breakpoint-md) flex-1 flex-col gap-4 px-4 py-6 sm:px-6">
      <Link href="/jobs" className="text-primary text-base hover:underline">
        {t("backToList")}
      </Link>

      <Card>
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-start gap-3">
            <UserAvatar
              name={job.companies?.name ?? "?"}
              avatarUrl={job.companies?.logo_url}
              size={56}
            />
            <div className="min-w-0">
              <h1 className="font-heading text-2xl font-medium wrap-break-word">{job.title}</h1>
              {job.companies?.slug ? (
                <Link
                  href={`/company/${job.companies.slug}`}
                  className="text-base font-medium hover:underline"
                >
                  {job.companies.name}
                </Link>
              ) : (
                <p className="text-base font-medium">{job.companies?.name}</p>
              )}
              <p className="text-ink-600 text-base">
                {[
                  job.location,
                  t(`workplaceType.${job.workplace_type}`),
                  t(`employmentType.${job.employment_type}`),
                ]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
              <p className="text-ink-600 mt-1 text-base">
                {t("postedOn", { time: format.relativeTime(new Date(job.created_at)) })}
              </p>
            </div>
          </div>

          <Button nativeButton={false} render={<a href={mailto} />} className="w-full sm:w-fit">
            {t("apply")}
          </Button>

          <p className="whitespace-pre-line text-base text-foreground">{job.description}</p>
        </CardContent>
      </Card>
    </div>
  );
}
