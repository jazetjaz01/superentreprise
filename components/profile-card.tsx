import { Card, CardContent } from "@/components/ui/card";
import { UserAvatar } from "@/components/user-avatar";

type ProfileCardProps = {
  name: string;
  avatarUrl: string | null;
  headline: string | null;
};

export const ProfileCard = ({ name, avatarUrl, headline }: ProfileCardProps) => (
  <Card className="overflow-hidden pt-0">
    <div className="h-14 bg-muted" />
    <CardContent className="-mt-9 flex flex-col items-center gap-1 text-center">
      <div className="rounded-full ring-4 ring-card">
        <UserAvatar name={name} avatarUrl={avatarUrl} size={72} />
      </div>
      <p className="mt-2 font-semibold break-words">{name}</p>
      {headline && (
        <p className="text-sm text-muted-foreground break-words">{headline}</p>
      )}
    </CardContent>
  </Card>
);
