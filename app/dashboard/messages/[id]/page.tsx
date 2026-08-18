import Link from "next/link";
import { notFound } from "next/navigation";
import { MessageForm } from "./message-form";
import { getDisplayName } from "@/lib/profile/display-name";
import { createClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";

const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
});

export default async function ConversationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: conversation } = await supabase
    .from("conversations")
    .select("*")
    .eq("id", id)
    .single();

  if (
    !conversation ||
    (conversation.buyer_id !== user!.id && conversation.seller_id !== user!.id)
  ) {
    notFound();
  }

  const otherUserId =
    conversation.buyer_id === user!.id
      ? conversation.seller_id
      : conversation.buyer_id;

  const [{ data: annonce }, { data: otherUser }, { data: messages }] =
    await Promise.all([
      supabase
        .from("annonces")
        .select("id, title")
        .eq("id", conversation.annonce_id)
        .maybeSingle(),
      supabase
        .from("public_profiles")
        .select("*")
        .eq("id", otherUserId)
        .maybeSingle(),
      supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", id)
        .order("created_at", { ascending: true }),
    ]);

  const unreadIds = (messages ?? [])
    .filter((message) => message.sender_id !== user!.id && !message.read_at)
    .map((message) => message.id);

  if (unreadIds.length > 0) {
    await supabase
      .from("messages")
      .update({ read_at: new Date().toISOString() })
      .in("id", unreadIds);
  }

  const otherUserName = getDisplayName(otherUser);

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4">
      <div>
        <Link
          href="/dashboard/messages"
          className="text-muted-foreground text-sm hover:text-foreground"
        >
          ← Tous les messages
        </Link>
        <h1 className="mt-1 font-semibold text-xl">{otherUserName}</h1>
        {annonce && (
          <Link
            href={`/annonce/${annonce.id}`}
            className="text-muted-foreground text-sm underline underline-offset-2 hover:text-foreground"
          >
            {annonce.title}
          </Link>
        )}
      </div>

      <div className="flex flex-col gap-3 rounded-lg border border-border p-4">
        {(messages ?? []).length === 0 ? (
          <p className="text-muted-foreground text-sm">
            Aucun message pour le moment. Lancez la conversation.
          </p>
        ) : (
          (messages ?? []).map((message) => {
            const isMine = message.sender_id === user!.id;
            return (
              <div
                key={message.id}
                className={cn("flex", isMine ? "justify-end" : "justify-start")}
              >
                <div
                  className={cn(
                    "max-w-[75%] rounded-lg px-3 py-2 text-sm",
                    isMine
                      ? "bg-foreground text-background"
                      : "bg-muted text-foreground",
                  )}
                >
                  <p className="whitespace-pre-line">{message.content}</p>
                  <p
                    className={cn(
                      "mt-1 text-[11px]",
                      isMine
                        ? "text-background/70"
                        : "text-muted-foreground",
                    )}
                  >
                    {dateFormatter.format(new Date(message.created_at))}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      <MessageForm conversationId={id} />
    </div>
  );
}
