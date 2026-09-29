import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { Card, CardContent } from "@/components/ui/card";
import { CreateCompanyCard } from "@/components/create-company-card";
import { EditProfileDialog } from "@/components/edit-profile-dialog";
import { EducationSection } from "@/components/education-section";
import { ExperienceSection } from "@/components/experience-section";
import { FollowButton } from "@/components/follow-button";
import { ProfileBanner } from "@/components/profile-banner";
import { ProfileUrlCard } from "@/components/profile-url-card";
import { SkillsSection } from "@/components/skills-section";
import { UserAvatar } from "@/components/user-avatar";
import { Link } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";

type ManagedCompany = { slug: string; name: string; logo_url: string | null };

const toTitleCase = (value: string) =>
  value.toLowerCase().replace(/(^|\s)\S/g, (letter) => letter.toUpperCase());

type ProfilePageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { slug } = await params;
  const t = await getTranslations("ProfilePage");
  const tProfile = await getTranslations("Profile");
  const supabase = await createClient();

  const [{ data: profile }, { data: claimsData }] = await Promise.all([
    supabase
      .from("profiles")
      .select(
        "id, full_name, avatar_url, banner_url, headline, about, city, region, country",
      )
      .eq("slug", slug)
      .maybeSingle(),
    supabase.auth.getClaims(),
  ]);

  if (!profile) notFound();

  const viewerId = claimsData?.claims?.sub;
  const isOwnProfile = viewerId === profile.id;
  const name = profile.full_name ? toTitleCase(profile.full_name) : tProfile("anonymous");
  const location = [profile.city, profile.region, profile.country]
    .filter(Boolean)
    .join(", ");

  const [
    { data: skills },
    { count: followingCount },
    followingRow,
    { data: managedCompaniesRows },
  ] = await Promise.all([
    supabase
      .from("skills")
      .select("id, name")
      .eq("profile_id", profile.id)
      .order("created_at", { ascending: true }),
    supabase
      .from("follows")
      .select("*", { count: "exact", head: true })
      .eq("follower_id", profile.id),
    !isOwnProfile && viewerId
      ? supabase
          .from("follows")
          .select("follower_id")
          .eq("follower_id", viewerId)
          .eq("followee_id", profile.id)
          .maybeSingle()
      : Promise.resolve({ data: null }),
    supabase
      .from("company_admins")
      .select("companies(slug, name, logo_url)")
      .eq("admin_id", profile.id)
      .overrideTypes<{ companies: ManagedCompany | null }[], { merge: false }>(),
  ]);

  if (viewerId && !isOwnProfile) {
    // Unique constraint on (profile_id, viewer_id, viewed_on) dedupes same-day views; ignore the conflict.
    await supabase.from("profile_views").insert({ profile_id: profile.id, viewer_id: viewerId });
  }

  const isFollowing = !!followingRow?.data;
  const managedCompanies: ManagedCompany[] = (managedCompaniesRows ?? [])
    .map((row) => row.companies)
    .filter((company): company is ManagedCompany => !!company);

  return (
    <div className="w-full flex-1 bg-secondary">
      <div className="mx-auto grid w-full max-w-(--breakpoint-xl) gap-4 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_300px] lg:px-8">
        <div className="min-w-0">
          <Card className="overflow-hidden pt-0">
            <ProfileBanner
              userId={profile.id}
              bannerUrl={profile.banner_url}
              isOwnProfile={isOwnProfile}
            />
            <CardContent className="relative">
              <div className="-mt-20 flex items-end justify-between gap-3">
                <div className="rounded-full border border-primary bg-background p-1.5">
                  <UserAvatar name={name} avatarUrl={profile.avatar_url} size={120} />
                </div>
                {isOwnProfile ? (
                  <EditProfileDialog
                    userId={profile.id}
                    fullName={profile.full_name ?? ""}
                    headline={profile.headline}
                    about={profile.about}
                    avatarUrl={profile.avatar_url}
                    city={profile.city}
                    region={profile.region}
                    country={profile.country}
                  />
                ) : (
                  viewerId && (
                    <FollowButton
                      viewerId={viewerId}
                      profileId={profile.id}
                      initialIsFollowing={isFollowing}
                      variant="text"
                    />
                  )
                )}
              </div>
              <div className="mt-3 flex items-start justify-between gap-4">
                <h1 className="font-heading text-[26px] leading-tight font-semibold">{name}</h1>
                {managedCompanies.length > 0 && (
                  <div className="flex flex-col items-end gap-2 pt-2">
                    {managedCompanies.map((company) => (
                      <Link
                        key={company.slug}
                        href={`/company/${company.slug}`}
                        className="flex items-center gap-2 hover:underline"
                      >
                        <span className="font-heading text-sm font-semibold text-foreground">
                          {company.name}
                        </span>
                        <span className="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-secondary">
                          {company.logo_url ? (
                            <Image
                              src={company.logo_url}
                              alt=""
                              width={32}
                              height={32}
                              unoptimized
                              className="size-full object-cover"
                            />
                          ) : (
                            <span className="font-heading text-xs text-ink-600">
                              {company.name.charAt(0).toUpperCase()}
                            </span>
                          )}
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              {profile.headline && (
                <p className="mt-1 text-[15px] text-foreground">{profile.headline}</p>
              )}
              {location && (
                <p className="text-ink-600 mt-1 text-sm">{location}</p>
              )}

              <div className="mt-3 flex flex-col gap-1 text-sm">
                <p className="flex items-center gap-1">
                  <span className="text-primary font-semibold">{t("follow.followingLabel")}</span>
                  <span className="text-primary font-semibold">{followingCount ?? 0}</span>
                </p>
              </div>
            </CardContent>
          </Card>

          {profile.about && (
            <Card className="mt-4">
              <CardContent className="p-[27.6px]">
                <h2 className="font-heading text-2xl font-semibold">{t("about")}</h2>
                <p className="mt-2 whitespace-pre-wrap text-foreground">
                  {profile.about}
                </p>
              </CardContent>
            </Card>
          )}

          <ExperienceSection profileId={profile.id} isOwnProfile={isOwnProfile} />
          <EducationSection profileId={profile.id} isOwnProfile={isOwnProfile} />
          <SkillsSection
            profileId={profile.id}
            isOwnProfile={isOwnProfile}
            skills={skills ?? []}
          />
        </div>

        <div className="flex flex-col gap-4">
          <ProfileUrlCard path={`/profile/${slug}`} />
          {isOwnProfile && <CreateCompanyCard />}
        </div>
      </div>
    </div>
  );
}
