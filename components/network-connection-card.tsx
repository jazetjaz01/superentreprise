"use client";

import { MessageProfileButton } from "@/components/message-profile-button";
import { NetworkOptionsMenu } from "@/components/network-options-menu";
import { UserAvatar } from "@/components/user-avatar";
import { Link } from "@/i18n/navigation";

export type NetworkConnectionSummary = {
  followerId: string;
  name: string;
  avatarUrl: string | null;
  headline: string | null;
  slug: string | null;
  connectedSinceLabel: string;
};

type NetworkConnectionCardProps = {
  connection: NetworkConnectionSummary;
  viewerId: string;
  onRemoved: () => void;
};

export const NetworkConnectionCard = ({
  connection,
  viewerId,
  onRemoved,
}: NetworkConnectionCardProps) => {
  return (
    <div className="flex items-start gap-3 border-b border-border p-4 last:border-b-0">
      {connection.slug ? (
        <Link href={`/profile/${connection.slug}`} className="flex min-w-0 flex-1 gap-3">
          <UserAvatar name={connection.name} avatarUrl={connection.avatarUrl} size={56} />
          <div className="min-w-0">
            <p className="font-heading wrap-break-word text-base font-semibold hover:underline">
              {connection.name}
            </p>
            {connection.headline && (
              <p className="text-ink-600 truncate text-base">{connection.headline}</p>
            )}
            <p className="text-ink-600 text-base">{connection.connectedSinceLabel}</p>
          </div>
        </Link>
      ) : (
        <div className="flex min-w-0 flex-1 gap-3">
          <UserAvatar name={connection.name} avatarUrl={connection.avatarUrl} size={56} />
          <div className="min-w-0">
            <p className="font-heading wrap-break-word text-base font-semibold">
              {connection.name}
            </p>
            {connection.headline && (
              <p className="text-ink-600 truncate text-base">{connection.headline}</p>
            )}
            <p className="text-ink-600 text-base">{connection.connectedSinceLabel}</p>
          </div>
        </div>
      )}

      <div className="flex shrink-0 items-center gap-1">
        <MessageProfileButton profileId={connection.followerId} />
        <NetworkOptionsMenu
          followerId={connection.followerId}
          viewerId={viewerId}
          onRemoved={onRemoved}
        />
      </div>
    </div>
  );
};
