import { ArrowLeft, BadgeCheck } from "lucide-react";
import { getFormatter, getTranslations } from "next-intl/server";

import { MessageComposer } from "@/components/messaging/message-composer";
import { UserAvatar } from "@/components/user-avatar";
import { Link } from "@/i18n/navigation";

export type ThreadMessage = {
  id: string;
  sender_id: string | null;
  is_official: boolean;
  content: string;
  created_at: string;
};

type MessageThreadProps = {
  conversationId: string;
  messages: ThreadMessage[];
  headerName: string;
  headerAvatarUrl: string | null;
  isOfficial: boolean;
  viewerId: string;
  viewerSendsAsOfficial: boolean;
  backHref: string;
};

export const MessageThread = async ({
  conversationId,
  messages,
  headerName,
  headerAvatarUrl,
  isOfficial,
  viewerId,
  viewerSendsAsOfficial,
  backHref,
}: MessageThreadProps) => {
  const t = await getTranslations("Messaging");
  const format = await getFormatter();

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 border-b border-border px-4 py-3">
        <Link href={backHref} className="text-ink-700 md:hidden">
          <ArrowLeft className="size-5" strokeWidth={1.5} />
        </Link>
        <UserAvatar name={headerName} avatarUrl={headerAvatarUrl} size={40} />
        <p className="flex items-center gap-1 text-base font-semibold text-foreground">
          {headerName}
          {isOfficial && (
            <BadgeCheck className="size-3.5 shrink-0 text-primary" aria-label={t("officialBadge")} />
          )}
        </p>
      </div>

      <div className="flex flex-1 flex-col gap-2 overflow-y-auto p-4">
        {messages.length === 0 && (
          <p className="py-8 text-center text-base text-muted-foreground">{t("noMessages")}</p>
        )}
        {messages.map((message) => {
          const isOwnMessage = isOfficial
            ? message.is_official === viewerSendsAsOfficial
            : message.sender_id === viewerId;

          return (
            <div
              key={message.id}
              className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs wrap-break-word rounded-2xl px-3.5 py-2 text-base sm:max-w-sm ${
                  isOwnMessage
                    ? "bg-primary text-white"
                    : "bg-secondary text-foreground"
                }`}
              >
                {message.content}
                <p
                  className={`mt-1 text-[10px] ${
                    isOwnMessage ? "text-white/70" : "text-muted-foreground"
                  }`}
                >
                  {format.dateTime(new Date(message.created_at), {
                    dateStyle: "short",
                    timeStyle: "short",
                  })}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <MessageComposer conversationId={conversationId} />
    </div>
  );
};
