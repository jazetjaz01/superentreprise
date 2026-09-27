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
};

export const ProfileCard = async ({
  name,
  avatarUrl,
  headline,
  location,
  bannerUrl,
  followerCount,
  followingCount,
}: ProfileCardProps) => {
  const t = await getTranslations("ProfilePage.follow");

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

        {(followerCount !== undefined || followingCount !== undefined) && (
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
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
