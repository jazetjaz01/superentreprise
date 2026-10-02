import { TrendingDown, TrendingUp } from "lucide-react";
import { getFormatter, getTranslations } from "next-intl/server";

import { Card, CardContent } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";

type CompanyStatsCardsProps = {
  companyId: string;
};

const DAYS_IN_RANGE = 30;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

// Built from UTC calendar-date components so the resulting ISO date string
// matches Postgres `date` values (which carry no timezone) regardless of the
// server process's local timezone offset.
const utcMidnight = (date: Date) =>
  new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));

const toDateKey = (date: Date) => date.toISOString().slice(0, 10);

type MetricProps = {
  label: string;
  value: number;
  previous: number;
  newLabel: string;
};

const computeDelta = (current: number, previous: number) => {
  if (previous === 0) return current > 0 ? null : 0;
  return Math.round(((current - previous) / previous) * 100);
};

export const CompanyStatsCards = async ({ companyId }: CompanyStatsCardsProps) => {
  const t = await getTranslations("Company.stats");
  const format = await getFormatter();
  const supabase = await createClient();

  const today = utcMidnight(new Date());
  const rangeStart = new Date(today.getTime() - (DAYS_IN_RANGE - 1) * MS_PER_DAY);
  const previousRangeStart = new Date(rangeStart.getTime() - DAYS_IN_RANGE * MS_PER_DAY);
  const rangeEndExclusive = new Date(today.getTime() + MS_PER_DAY);

  const { data: postIdsRows } = await supabase
    .from("posts")
    .select("id")
    .eq("company_id", companyId);
  const postIds = (postIdsRows ?? []).map((row) => row.id);

  const [
    { data: visitRows },
    { count: previousVisitCount },
    { count: followerCount },
    { count: previousFollowerCount },
    { count: postCount },
    { count: previousPostCount },
    { count: likeCount },
    { count: previousLikeCount },
  ] = await Promise.all([
    supabase
      .from("company_views")
      .select("viewed_on")
      .eq("company_id", companyId)
      .gte("viewed_on", rangeStart.toISOString().slice(0, 10)),
    supabase
      .from("company_views")
      .select("*", { count: "exact", head: true })
      .eq("company_id", companyId)
      .gte("viewed_on", previousRangeStart.toISOString().slice(0, 10))
      .lt("viewed_on", rangeStart.toISOString().slice(0, 10)),
    supabase
      .from("company_follows")
      .select("*", { count: "exact", head: true })
      .eq("company_id", companyId)
      .gte("created_at", rangeStart.toISOString())
      .lt("created_at", rangeEndExclusive.toISOString()),
    supabase
      .from("company_follows")
      .select("*", { count: "exact", head: true })
      .eq("company_id", companyId)
      .gte("created_at", previousRangeStart.toISOString())
      .lt("created_at", rangeStart.toISOString()),
    supabase
      .from("posts")
      .select("*", { count: "exact", head: true })
      .eq("company_id", companyId)
      .gte("created_at", rangeStart.toISOString())
      .lt("created_at", rangeEndExclusive.toISOString()),
    supabase
      .from("posts")
      .select("*", { count: "exact", head: true })
      .eq("company_id", companyId)
      .gte("created_at", previousRangeStart.toISOString())
      .lt("created_at", rangeStart.toISOString()),
    postIds.length > 0
      ? supabase
          .from("post_likes")
          .select("*", { count: "exact", head: true })
          .in("post_id", postIds)
          .gte("created_at", rangeStart.toISOString())
          .lt("created_at", rangeEndExclusive.toISOString())
      : Promise.resolve({ count: 0 }),
    postIds.length > 0
      ? supabase
          .from("post_likes")
          .select("*", { count: "exact", head: true })
          .in("post_id", postIds)
          .gte("created_at", previousRangeStart.toISOString())
          .lt("created_at", rangeStart.toISOString())
      : Promise.resolve({ count: 0 }),
  ]);

  const visitsByDay = new Map<string, number>();
  for (const row of visitRows ?? []) {
    visitsByDay.set(row.viewed_on, (visitsByDay.get(row.viewed_on) ?? 0) + 1);
  }
  const series = Array.from({ length: DAYS_IN_RANGE }, (_, index) => {
    const date = new Date(rangeStart.getTime() + index * MS_PER_DAY);
    const key = toDateKey(date);
    return { date, count: visitsByDay.get(key) ?? 0 };
  });
  const visitCount = series.reduce((sum, point) => sum + point.count, 0);

  const metrics: MetricProps[] = [
    {
      label: t("visits"),
      value: visitCount,
      previous: previousVisitCount ?? 0,
      newLabel: t("new"),
    },
    {
      label: t("newFollowers"),
      value: followerCount ?? 0,
      previous: previousFollowerCount ?? 0,
      newLabel: t("new"),
    },
    {
      label: t("postsPublished"),
      value: postCount ?? 0,
      previous: previousPostCount ?? 0,
      newLabel: t("new"),
    },
    {
      label: t("likes"),
      value: likeCount ?? 0,
      previous: previousLikeCount ?? 0,
      newLabel: t("new"),
    },
  ];

  const maxCount = Math.max(1, ...series.map((point) => point.count));
  const chartWidth = 760;
  const chartHeight = 180;
  const stepX = chartWidth / (series.length - 1);
  const points = series.map((point, index) => {
    const x = index * stepX;
    const y = chartHeight - (point.count / maxCount) * chartHeight;
    return `${x},${y}`;
  });
  const tickIndexes = [0, 5, 10, 15, 20, 25, series.length - 1].filter(
    (index) => index < series.length,
  );

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardContent className="p-[27.6px]">
          <h2 className="font-heading text-2xl font-semibold">{t("essentialsTitle")}</h2>
          <p className="text-ink-600 mt-1 text-base">
            {t("dateRange", {
              start: format.dateTime(rangeStart, { dateStyle: "short", timeZone: "UTC" }),
              end: format.dateTime(today, { dateStyle: "short", timeZone: "UTC" }),
            })}
          </p>

          <div className="mt-6 grid grid-cols-2 gap-6 sm:grid-cols-4">
            {metrics.map((metric) => {
              const delta = computeDelta(metric.value, metric.previous);
              return (
                <div key={metric.label}>
                  <p className="font-heading text-3xl font-semibold">{metric.value}</p>
                  <p className="text-ink-600 text-base">{metric.label}</p>
                  {delta !== null ? (
                    delta !== 0 && (
                      <p
                        className={`mt-1 flex items-center gap-1 text-base font-semibold ${
                          delta > 0 ? "text-primary" : "text-destructive"
                        }`}
                      >
                        {delta > 0 ? (
                          <TrendingUp className="size-3.5" strokeWidth={1.5} />
                        ) : (
                          <TrendingDown className="size-3.5" strokeWidth={1.5} />
                        )}
                        {Math.abs(delta)}%
                      </p>
                    )
                  ) : (
                    <p className="text-primary mt-1 text-base font-semibold">{metric.newLabel}</p>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-[27.6px]">
          <h2 className="font-heading text-2xl font-semibold">{t("indicatorsTitle")}</h2>
          <span className="bg-primary mt-3 inline-block rounded-full px-4 py-1.5 text-base font-semibold text-white">
            {t("visits")}
          </span>

          <div className="mt-6 overflow-x-auto">
            <svg
              viewBox={`-32 -10 ${chartWidth + 40} ${chartHeight + 36}`}
              className="h-48 w-full min-w-[500px]"
              role="img"
              aria-label={t("visits")}
            >
              {[0, 0.25, 0.5, 0.75, 1].map((fraction) => {
                const y = chartHeight - fraction * chartHeight;
                return (
                  <g key={fraction}>
                    <line
                      x1={0}
                      y1={y}
                      x2={chartWidth}
                      y2={y}
                      stroke="var(--border)"
                      strokeWidth={1}
                    />
                    <text
                      x={-10}
                      y={y}
                      textAnchor="end"
                      dominantBaseline="middle"
                      className="fill-ink-600"
                      fontSize={11}
                    >
                      {Math.round(maxCount * fraction)}
                    </text>
                  </g>
                );
              })}

              <polyline
                points={points.join(" ")}
                fill="none"
                stroke="var(--primary)"
                strokeWidth={2}
                strokeLinejoin="round"
                strokeLinecap="round"
              />

              {tickIndexes.map((index) => {
                const x = index * stepX;
                return (
                  <text
                    key={index}
                    x={x}
                    y={chartHeight + 20}
                    textAnchor="middle"
                    className="fill-ink-600"
                    fontSize={11}
                  >
                    {format.dateTime(series[index].date, {
                      day: "numeric",
                      month: "short",
                      timeZone: "UTC",
                    })}
                  </text>
                );
              })}
            </svg>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
