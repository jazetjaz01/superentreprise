import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { Card, CardContent } from "@/components/ui/card";
import { EditProfileDialog } from "@/components/edit-profile-dialog";
import { EducationSection } from "@/components/education-section";
import { ExperienceSection } from "@/components/experience-section";
import { FollowButton } from "@/components/follow-button";
import { FollowersManager, type FollowerProfile } from "@/components/followers-manager";
import { ProfileBanner } from "@/components/profile-banner";
import { ProfileUrlCard } from "@/components/profile-url-card";
import { SkillsSection } from "@/components/skills-section";
import { UserAvatar } from "@/components/user-avatar";
import { createClient } from "@/lib/supabase/server";

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
  const name = profile.full_name ?? tProfile("anonymous");
  const location = [profile.city, profile.region, profile.country]
    .filter(Boolean)
    .join(", ");

  const [{ data: skills }, { count: followerCount }, { count: followingCount }, followingRow, followersResult] =
    await Promise.all([
      supabase
        .from("skills")
        .select("id, name")
        .eq("profile_id", profile.id)
        .order("created_at", { ascending: true }),
      supabase
        .from("follows")
        .select("*", { count: "exact", head: true })
        .eq("followee_id", profile.id),
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
      isOwnProfile
        ? supabase
            .from("follows")
            .select("follower_id, profiles!follows_follower_id_fkey(id, slug, full_name, avatar_url, headline)")
            .eq("followee_id", profile.id)
            .overrideTypes<
              { follower_id: string; profiles: FollowerProfile | null }[],
              { merge: false }
            >()
        : Promise.resolve({ data: null }),
    ]);

  const isFollowing = !!followingRow?.data;
  const followers: FollowerProfile[] = (followersResult?.data ?? [])
    .map((row) => row.profiles)
    .filter((followerProfile): followerProfile is FollowerProfile => !!followerProfile);

  return (
    <div className="w-full flex-1 bg-muted">
      <div className="mx-auto grid w-full max-w-(--breakpoint-xl) gap-4 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_300px] lg:px-8">
        <div className="min-w-0">
          <Card className="overflow-hidden pt-0">
            <ProfileBanner
              userId={profile.id}
              bannerUrl={profile.banner_url}
              isOwnProfile={isOwnProfile}
            />
            <CardContent className="relative">
              <div className="-mt-12 flex items-end justify-between gap-3 sm:-mt-16">
                <div className="rounded-full ring-4 ring-card">
                  <UserAvatar name={name} avatarUrl={profile.avatar_url} size={96} />
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
                    />
                  )
                )}
              </div>
              <h1 className="mt-3 text-2xl font-semibold">{name}</h1>
              {profile.headline && (
                <p className="mt-1 text-foreground">{profile.headline}</p>
              )}
              {location && (
                <p className="mt-1 text-sm text-foreground">{location}</p>
              )}

              <div className="mt-3 flex items-center gap-4">
                {isOwnProfile ? (
                  <FollowersManager
                    profileId={profile.id}
                    followers={followers}
                    anonymousLabel={tProfile("anonymous")}
                  />
                ) : (
                  <span className="text-sm font-semibold text-foreground">
                    {t("follow.followersCount", { count: followerCount ?? 0 })}
                  </span>
                )}
                <span className="text-sm text-muted-foreground">
                  {t("follow.followingCount", { count: followingCount ?? 0 })}
                </span>
              </div>
            </CardContent>
          </Card>

          {profile.about && (
            <Card className="mt-4">
              <CardContent>
                <h2 className="text-lg font-semibold">{t("about")}</h2>
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
        </div>
      </div>
    </div>
  );
}
