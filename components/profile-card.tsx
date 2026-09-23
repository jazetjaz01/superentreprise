import { Card, CardContent } from "@/components/ui/card";
import { UserAvatar } from "@/components/user-avatar";

type ProfileCardProps = {
  name: string;
  avatarUrl: string | null;
  headline: string | null;
  location?: string | null;
};

export const ProfileCard = ({
  name,
  avatarUrl,
  headline,
  location,
}: ProfileCardProps) => (
  <Card className="overflow-hidden pt-0">
    <div className="h-14 bg-muted" />
    <CardContent className="-mt-9 flex flex-col items-start gap-1 text-left">
      <div className="rounded-full ring-4 ring-card">
        <UserAvatar name={name} avatarUrl={avatarUrl} size={72} />
      </div>
      <p className="mt-2 font-semibold break-words">{name}</p>
      {headline && (
        <p className="text-sm text-foreground break-words">{headline}</p>
      )}
      {location && (
        <p className="text-sm text-foreground break-words">{location}</p>
      )}
    </CardContent>
  </Card>
);
