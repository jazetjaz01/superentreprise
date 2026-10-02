import { BadgeCheck } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { UserAvatar } from "@/components/user-avatar";
import { Link } from "@/i18n/navigation";

export type ConversationSummary = {
  id: string;
  displayName: string;
  avatarUrl: string | null;
  isOfficial: boolean;
  lastMessage: string | null;
  updatedAt: string;
};

type ConversationListProps = {
  conversations: ConversationSummary[];
  activeConversationId: string | null;
  baseHref: string;
  emptyLabel: string;
};

export const ConversationList = async ({
  conversations,
  activeConversationId,
  baseHref,
  emptyLabel,
}: ConversationListProps) => {
  const t = await getTranslations("Messaging");

  if (conversations.length === 0) {
    return <p className="px-4 py-8 text-center text-base text-muted-foreground">{emptyLabel}</p>;
  }

  return (
    <div className="flex flex-col">
      {conversations.map((conversation) => (
        <Link
          key={conversation.id}
          href={`${baseHref}${baseHref.includes("?") ? "&" : "?"}c=${conversation.id}`}
          className={`hover:bg-foreground/[.07] flex items-center gap-3 border-b border-border px-4 py-3 ${
            conversation.id === activeConversationId ? "bg-foreground/[.05]" : ""
          }`}
        >
          <UserAvatar name={conversation.displayName} avatarUrl={conversation.avatarUrl} size={44} />
          <div className="min-w-0 flex-1">
            <p className="flex items-center gap-1 truncate text-base font-medium text-foreground">
              {conversation.displayName}
              {conversation.isOfficial && (
                <BadgeCheck className="size-3.5 shrink-0 text-primary" aria-label={t("officialBadge")} />
              )}
            </p>
            <p className="truncate text-base text-muted-foreground">
              {conversation.lastMessage ?? t("noMessages")}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
};
