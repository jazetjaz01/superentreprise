"use client";

import { Search } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { CompanyFollowButton } from "@/components/company-follow-button";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { createClient } from "@/lib/supabase/client";

type CompanyRow = {
  id: string;
  slug: string;
  name: string;
  tagline: string | null;
  industry: string | null;
  logo_url: string | null;
  followerCount: number;
};

type FindCompaniesDialogProps = {
  viewerId: string;
  excludeCompanyIds: string[];
};

export const FindCompaniesDialog = ({ viewerId, excludeCompanyIds }: FindCompaniesDialogProps) => {
  const t = useTranslations("Company.discoverPages");
  const tFollow = useTranslations("Company.follow");
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<"recommended" | "following">("recommended");
  const [query, setQuery] = useState("");
  const [recommended, setRecommended] = useState<CompanyRow[] | null>(null);
  const [following, setFollowing] = useState<CompanyRow[] | null>(null);

  useEffect(() => {
    if (!open) return;

    const supabase = createClient();

    const loadRecommended = async () => {
      const { data: followRows } = await supabase
        .from("company_follows")
        .select("company_id")
        .eq("follower_id", viewerId);
      const followedIds = (followRows ?? []).map((row) => row.company_id);
      const excludeIds = [...new Set([...excludeCompanyIds, ...followedIds])];

      let companiesQuery = supabase
        .from("companies")
        .select("id, slug, name, tagline, industry, logo_url, company_follows(count)")
        .order("created_at", { ascending: false })
        .limit(50);
      if (excludeIds.length > 0) {
        companiesQuery = companiesQuery.not("id", "in", `(${excludeIds.join(",")})`);
      }

      const { data } = await companiesQuery.overrideTypes<
        (Omit<CompanyRow, "followerCount"> & { company_follows: { count: number }[] })[],
        { merge: false }
      >();
      setRecommended(
        (data ?? []).map(({ company_follows, ...company }) => ({
          ...company,
          followerCount: company_follows?.[0]?.count ?? 0,
        })),
      );
    };

    const loadFollowing = async () => {
      const { data } = await supabase
        .from("company_follows")
        .select(
          "companies!inner(id, slug, name, tagline, industry, logo_url, company_follows(count))",
        )
        .eq("follower_id", viewerId)
        .overrideTypes<
          {
            companies: Omit<CompanyRow, "followerCount"> & {
              company_follows: { count: number }[];
            };
          }[],
          { merge: false }
        >();
      setFollowing(
        (data ?? []).map(({ companies: company }) => ({
          ...company,
          followerCount: company.company_follows?.[0]?.count ?? 0,
        })),
      );
    };

    loadRecommended();
    loadFollowing();
  }, [open, viewerId, excludeCompanyIds]);

  const handleFollowChange = (companyId: string, isFollowing: boolean) => {
    if (isFollowing) {
      setRecommended((current) => current?.filter((company) => company.id !== companyId) ?? null);
    } else {
      setFollowing((current) => current?.filter((company) => company.id !== companyId) ?? null);
    }
  };

  const list = tab === "recommended" ? recommended : following;
  const filteredList = list?.filter((company) =>
    company.name.toLowerCase().includes(query.trim().toLowerCase()),
  );

  return (
    <>
      <Button type="button" variant="default" className="rounded-full" onClick={() => setOpen(true)}>
        {t("cta")}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t("dialogTitle")}</DialogTitle>
          </DialogHeader>

          <label className="border-border focus-within:border-ring flex items-center gap-2 rounded-md border px-3 py-2">
            <Search className="text-muted-foreground size-4 shrink-0" strokeWidth={1.5} />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t("searchPlaceholder")}
              className="placeholder:text-muted-foreground w-full bg-transparent text-base outline-none"
            />
          </label>

          <div className="border-border flex gap-4 border-b text-base font-semibold">
            <button
              type="button"
              onClick={() => setTab("following")}
              className={`border-b-2 px-1 pb-2 ${
                tab === "following"
                  ? "border-primary text-primary"
                  : "text-ink-600 border-transparent"
              }`}
            >
              {t("followingTab", { count: following?.length ?? 0 })}
            </button>
            <button
              type="button"
              onClick={() => setTab("recommended")}
              className={`border-b-2 px-1 pb-2 ${
                tab === "recommended"
                  ? "border-primary text-primary"
                  : "text-ink-600 border-transparent"
              }`}
            >
              {t("recommendedTab")}
            </button>
          </div>

          <div className="flex max-h-96 flex-col gap-4 overflow-y-auto">
            {filteredList === undefined ? null : filteredList.length === 0 ? (
              <p className="text-ink-600 py-6 text-center text-base">
                {tab === "following" ? t("noFollowedPages") : t("noResults")}
              </p>
            ) : (
              filteredList.map((company) => (
                <div key={company.id} className="flex items-center gap-3">
                  <span className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-md border border-border bg-secondary">
                    {company.logo_url ? (
                      <Image
                        src={company.logo_url}
                        alt=""
                        width={48}
                        height={48}
                        unoptimized
                        className="size-full object-cover"
                      />
                    ) : (
                      <span className="font-heading text-ink-600 text-lg">
                        {company.name.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="wrap-break-word text-base font-semibold">{company.name}</p>
                    {(company.tagline || company.industry) && (
                      <p className="text-ink-600 truncate text-base">
                        {company.tagline ?? company.industry}
                      </p>
                    )}
                    <p className="text-ink-600 text-base">
                      {tFollow("followersCount", { count: company.followerCount })}
                    </p>
                  </div>
                  <CompanyFollowButton
                    viewerId={viewerId}
                    companyId={company.id}
                    initialIsFollowing={tab === "following"}
                    onFollowChange={(isFollowing) => handleFollowChange(company.id, isFollowing)}
                  />
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
