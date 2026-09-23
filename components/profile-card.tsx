import Image from "next/image";

import { Card, CardContent } from "@/components/ui/card";
import { UserAvatar } from "@/components/user-avatar";

type ProfileCardProps = {
  name: string;
  avatarUrl: string | null;
  headline: string | null;
  location?: string | null;
  bannerUrl?: string | null;
};

export const ProfileCard = ({
  name,
  avatarUrl,
  headline,
  location,
  bannerUrl,
}: ProfileCardProps) => (
  <Card className="overflow-hidden pt-0">
    <div className="relative h-14 bg-muted">
      {bannerUrl && (
        <Image src={bannerUrl} alt="" fill unoptimized className="object-cover" />
      )}
    </div>
    <CardContent className="-mt-9 flex flex-col items-start gap-1 text-left">
      <div className="rounded-full ring-4 ring-card">
        <UserAvatar name={name} avatarUrl={avatarUrl} size={72} />
      </div>
      <p className="mt-2 font-semibold break-words">{name}</p>
      {headline && (
        <p className="text-xs text-foreground break-words">{headline}</p>
      )}
      {location && (
        <p className="text-xs text-muted-foreground break-words">{location}</p>
      )}
    </CardContent>
  </Card>
);
