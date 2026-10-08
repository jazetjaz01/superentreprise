import { getFormatter, getTranslations } from "next-intl/server";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";

type JobRow = {
  id: string;
  title: string;
  workplace_type: "onsite" | "hybrid" | "remote";
  location: string | null;
  employment_type: "full_time" | "part_time" | "contract" | "internship";
  created_at: string;
  companies: { name: string; slug: string; logo_url: string | null } | null;
};

export default async function JobsPage() {
  const t = await getTranslations("Jobs");
  const format = await getFormatter();
  const supabase = await createClient();

  const { data: jobs } = await supabase
    .from("jobs")
    .select(
      "id, title, workplace_type, location, employment_type, created_at, companies(name, slug, logo_url)",
    )
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .overrideTypes<JobRow[], { merge: false }>();

  const jobRows = jobs ?? [];

  return (
    <div className="mx-auto flex w-full max-w-(--breakpoint-md) flex-1 flex-col gap-4 px-4 py-6 sm:px-6">
      <div className="flex items-center justify-between gap-2">
        <h1 className="font-heading text-2xl font-medium">{t("title")}</h1>
        <Button nativeButton={false} render={<Link href="/jobs/new" />}>
          {t("publishCta")}
        </Button>
      </div>

      {jobRows.length === 0 ? (
        <Card>
          <CardContent>
            <p className="text-center text-base text-foreground">{t("empty")}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          {jobRows.map((job) => (
            <Link key={job.id} href={`/jobs/${job.id}`}>
              <Card className="hover:bg-foreground/[.03]">
                <CardContent className="flex items-start gap-3">
                  <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-md bg-muted font-heading text-lg text-ink-600">
                    {job.companies?.logo_url ? (
                      // eslint-disable-next-line @next/next/no-img-element -- small decorative logo, no need for next/image optimization here
                      <img
                        src={job.companies.logo_url}
                        alt=""
                        className="size-full object-cover"
                      />
                    ) : (
                      (job.companies?.name ?? "?").charAt(0).toUpperCase()
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="font-heading wrap-break-word text-base font-semibold">
                      {job.title}
                    </p>
                    <p className="text-ink-600 text-base">{job.companies?.name}</p>
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
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
