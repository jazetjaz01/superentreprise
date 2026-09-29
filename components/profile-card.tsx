import Image from "next/image";
import { getTranslations } from "next-intl/server";

import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { UserAvatar } from "@/components/user-avatar";
import { Link } from "@/i18n/navigation";

export type ManagedCompany = { slug: string; name: string; logo_url: string | null };

type ProfileCardProps = {
  name: string;
  avatarUrl: string | null;
  headline: string | null;
  location?: string | null;
  bannerUrl?: string | null;
  followerCount?: number;
  followingCount?: number;
  profileViewCount?: number;
  managedCompanies?: ManagedCompany[];
};

export const ProfileCard = async ({
  name,
  avatarUrl,
  headline,
  location,
  bannerUrl,
  followerCount,
  followingCount,
  profileViewCount,
  managedCompanies,
}: ProfileCardProps) => {
  const t = await getTranslations("ProfilePage.follow");
  const tViews = await getTranslations("ProfilePage.views");

  return (
    <Card className="overflow-hidden pt-0">
      <div className="relative h-13 border-b border-border bg-secondary">
        {bannerUrl && (
          <Image src={bannerUrl} alt="" fill unoptimized className="object-cover" />
        )}
      </div>
      <CardContent className="relative -mt-8 flex flex-col items-start gap-1 text-left">
        <div className="relative z-10 rounded-full border border-primary bg-background p-0.5">
          <UserAvatar name={name} avatarUrl={avatarUrl} size={64} />
        </div>
        <p className="font-heading mt-2 text-[21px] leading-snug font-semibold break-words">
          {name}
        </p>
        {headline && (
          <p className="text-ink-800 text-[13px] break-words">{headline}</p>
        )}
        {location && (
          <p className="text-ink-600 text-xs break-words">{location}</p>
        )}

        {managedCompanies && managedCompanies.length > 0 && (
          <div className="mt-2 flex w-full flex-col gap-2">
            {managedCompanies.map((company) => (
              <Link
                key={company.slug}
                href={`/company/${company.slug}`}
                className="flex items-center gap-2 hover:underline"
              >
                <span className="flex size-6 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-secondary">
                  {company.logo_url ? (
                    <Image
                      src={company.logo_url}
                      alt=""
                      width={24}
                      height={24}
                      unoptimized
                      className="size-full object-cover"
                    />
                  ) : (
                    <span className="font-heading text-ink-600 text-[10px]">
                      {company.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </span>
                <span className="wrap-break-word text-[13px] font-semibold text-foreground">
                  {company.name}
                </span>
              </Link>
            ))}
          </div>
        )}

        {(followerCount !== undefined ||
          followingCount !== undefined ||
          profileViewCount !== undefined) && (
          <>
            <Separator className="my-2" />
            <div className="flex w-full flex-col gap-1 text-[13px]">
              {followerCount !== undefined && (
                <p className="text-ink-700 flex justify-between">
                  <span>{t("followersCount", { count: followerCount })}</span>
                </p>
              )}
              {followingCount !== undefined && (
                <p className="text-ink-700 flex justify-between">
                  <span>{t("followingCount", { count: followingCount })}</span>
                </p>
              )}
              {profileViewCount !== undefined && (
                <p className="text-ink-700 flex justify-between">
                  <span>{tViews("count", { count: profileViewCount })}</span>
                </p>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
