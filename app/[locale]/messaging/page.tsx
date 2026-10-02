import { getLocale, getTranslations } from "next-intl/server";

import { ConversationList, type ConversationSummary } from "@/components/messaging/conversation-list";
import { MessageThread, type ThreadMessage } from "@/components/messaging/message-thread";
import { NewConversationDialog } from "@/components/messaging/new-conversation-dialog";
import { Card } from "@/components/ui/card";
import { Link, redirect } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";

type MessagingPageProps = {
  searchParams: Promise<{ c?: string; admin?: string }>;
};

export default async function MessagingPage({ searchParams }: MessagingPageProps) {
  const { c: conversationId, admin } = await searchParams;
  const t = await getTranslations("Messaging");
  const locale = await getLocale();
  const supabase = await createClient();

  const { data: claimsData } = await supabase.auth.getClaims();
  const claims = claimsData?.claims;
  if (!claims) {
    return redirect({ href: "/auth/login", locale });
  }
  const viewerId = claims.sub;

  const { data: me } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", viewerId)
    .maybeSingle();
  const isAdmin = me?.role === "admin";
  const isOfficialView = isAdmin && admin === "official";
  const baseHref = isOfficialView ? "/messaging?admin=official" : "/messaging";

  let conversations: ConversationSummary[] = [];

  if (isOfficialView) {
    const { data: rows } = await supabase
      .from("conversations")
      .select("id, updated_at, profiles!conversations_user_id_fkey(full_name, avatar_url)")
      .eq("is_official", true)
      .order("updated_at", { ascending: false })
      .overrideTypes<
        { id: string; updated_at: string; profiles: { full_name: string | null; avatar_url: string | null } | null }[],
        { merge: false }
      >();

    conversations = (rows ?? []).map((row) => ({
      id: row.id,
      displayName: row.profiles?.full_name ?? t("anonymous"),
      avatarUrl: row.profiles?.avatar_url ?? null,
      isOfficial: true,
      lastMessage: null,
      updatedAt: row.updated_at,
    }));
  } else {
    const { data: rows } = await supabase
      .from("conversation_participants")
      .select("conversation_id, conversations(id, is_official, updated_at)")
      .eq("profile_id", viewerId)
      .overrideTypes<
        { conversation_id: string; conversations: { id: string; is_official: boolean; updated_at: string } | null }[],
        { merge: false }
      >();

    const myConversations = (rows ?? [])
      .map((row) => row.conversations)
      .filter((c): c is { id: string; is_official: boolean; updated_at: string } => !!c);

    const regularIds = myConversations.filter((c) => !c.is_official).map((c) => c.id);
    const { data: otherParticipantRows } =
      regularIds.length > 0
        ? await supabase
            .from("conversation_participants")
            .select("conversation_id, profiles(full_name, avatar_url)")
            .in("conversation_id", regularIds)
            .neq("profile_id", viewerId)
            .overrideTypes<
              { conversation_id: string; profiles: { full_name: string | null; avatar_url: string | null } | null }[],
              { merge: false }
            >()
        : { data: [] };

    const otherParticipantByConversation = new Map(
      (otherParticipantRows ?? []).map((row) => [row.conversation_id, row.profiles]),
    );

    conversations = myConversations
      .sort((a, b) => (a.updated_at < b.updated_at ? 1 : -1))
      .map((c) => {
        if (c.is_official) {
          return {
            id: c.id,
            displayName: t("officialSenderName"),
            avatarUrl: null,
            isOfficial: true,
            lastMessage: null,
            updatedAt: c.updated_at,
          };
        }
        const other = otherParticipantByConversation.get(c.id);
        return {
          id: c.id,
          displayName: other?.full_name ?? t("anonymous"),
          avatarUrl: other?.avatar_url ?? null,
          isOfficial: false,
          lastMessage: null,
          updatedAt: c.updated_at,
        };
      });
  }

  const conversationIds = conversations.map((c) => c.id);
  const { data: previewRows } =
    conversationIds.length > 0
      ? await supabase
          .from("messages")
          .select("conversation_id, content, created_at")
          .in("conversation_id", conversationIds)
          .order("created_at", { ascending: false })
      : { data: [] };

  const lastMessageByConversation = new Map<string, string>();
  for (const row of previewRows ?? []) {
    if (!lastMessageByConversation.has(row.conversation_id)) {
      lastMessageByConversation.set(row.conversation_id, row.content);
    }
  }
  conversations = conversations.map((c) => ({
    ...c,
    lastMessage: lastMessageByConversation.get(c.id) ?? null,
  }));

  let thread: {
    messages: ThreadMessage[];
    headerName: string;
    headerAvatarUrl: string | null;
    isOfficial: boolean;
  } | null = null;

  const activeConversation = conversationId
    ? conversations.find((c) => c.id === conversationId)
    : undefined;

  if (conversationId && activeConversation) {
    const { data: messageRows } = await supabase
      .from("messages")
      .select("id, sender_id, is_official, content, created_at")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });

    thread = {
      messages: messageRows ?? [],
      headerName: activeConversation.displayName,
      headerAvatarUrl: activeConversation.avatarUrl,
      isOfficial: activeConversation.isOfficial,
    };
  }

  return (
    <div className="mx-auto flex w-full max-w-(--breakpoint-xl) flex-1 flex-col gap-4 px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-semibold">
          {isOfficialView ? t("officialInboxTitle") : t("title")}
        </h1>
        <NewConversationDialog mode={isOfficialView ? "official" : "personal"} selfProfileId={viewerId} />
      </div>

      {isAdmin && (
        <div className="flex gap-2">
          <Link
            href="/messaging"
            className={`rounded-full px-4 py-1.5 text-base font-semibold ${
              !isOfficialView ? "bg-primary text-white" : "border border-border text-foreground"
            }`}
          >
            {t("personalTab")}
          </Link>
          <Link
            href="/messaging?admin=official"
            className={`rounded-full px-4 py-1.5 text-base font-semibold ${
              isOfficialView ? "bg-primary text-white" : "border border-border text-foreground"
            }`}
          >
            {t("officialTab")}
          </Link>
        </div>
      )}

      <Card className="grid min-h-128 overflow-hidden p-0 md:grid-cols-[320px_minmax(0,1fr)]">
        <div className={`overflow-y-auto border-border md:border-r ${thread ? "hidden md:block" : "block"}`}>
          <ConversationList
            conversations={conversations}
            activeConversationId={conversationId ?? null}
            baseHref={baseHref}
            emptyLabel={isOfficialView ? t("emptyOfficialConversations") : t("emptyConversations")}
          />
        </div>
        <div className={thread ? "block" : "hidden md:block"}>
          {thread ? (
            <MessageThread
              conversationId={conversationId as string}
              messages={thread.messages}
              headerName={thread.headerName}
              headerAvatarUrl={thread.headerAvatarUrl}
              isOfficial={thread.isOfficial}
              viewerId={viewerId}
              viewerSendsAsOfficial={isOfficialView}
              backHref={baseHref}
            />
          ) : (
            <p className="flex h-full items-center justify-center p-8 text-center text-base text-muted-foreground">
              {t("emptyThread")}
            </p>
          )}
        </div>
      </Card>
    </div>
  );
}
