import Image from "next/image";
import { getTranslations } from "next-intl/server";

import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { UserAvatar } from "@/components/user-avatar";

type ProfileCardProps = {
  name: string;
  avatarUrl: string | null;
  headline: string | null;
  location?: string | null;
  bannerUrl?: string | null;
  followerCount?: number;
  followingCount?: number;
  profileViewCount?: number;
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
}: ProfileCardProps) => {
  const t = await getTranslations("ProfilePage.follow");
  const tViews = await getTranslations("ProfilePage.views");

  return (
    <Card className="overflow-hidden pt-0">
      <div className="relative h-20 border-b border-border bg-secondary">
        {bannerUrl && (
          <Image src={bannerUrl} alt="" fill unoptimized className="object-cover" />
        )}
      </div>
      <CardContent className="relative -mt-11 flex flex-col items-start gap-1 text-left">
        <div className="relative z-10 rounded-full  border-primary bg-background p-0.5">
          <UserAvatar name={name} avatarUrl={avatarUrl} size={64} />
        </div>
        <p className="font-heading mt-2 text-[21px] leading-snug font-semibold break-words">
          {name}
        </p>
        {headline && (
          <p className="text-ink-800 text-base break-words">{headline}</p>
        )}
        {location && (
          <p className="text-ink-600 text-base break-words">{location}</p>
        )}

        {(followerCount !== undefined ||
          followingCount !== undefined ||
          profileViewCount !== undefined) && (
          <>
            <Separator className="my-2" />
            <div className="flex w-full flex-col gap-1 text-base">
              {followerCount !== undefined && (
                <p className="text-ink-700 flex w-full items-center justify-between font-semibold">
                  <span>{t("followersLabel")}</span>
                  <span className="text-primary">{followerCount}</span>
                </p>
              )}
              {followingCount !== undefined && (
                <p className="text-ink-700 flex w-full items-center justify-between font-semibold">
                  <span>{t("followingLabel")}</span>
                  <span className="text-primary">{followingCount}</span>
                </p>
              )}
              {profileViewCount !== undefined && (
                <p className="text-ink-700 flex w-full items-center justify-between font-semibold">
                  <span>{tViews("label")}</span>
                  <span className="text-primary">{profileViewCount}</span>
                </p>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
