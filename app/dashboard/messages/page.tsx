import Link from "next/link";
import { getDisplayName } from "@/lib/profile/display-name";
import { createClient } from "@/lib/supabase/server";

const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
});

export default async function MessagesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: conversations } = await supabase
    .from("conversations")
    .select("id, annonce_id, buyer_id, seller_id, created_at")
    .or(`buyer_id.eq.${user!.id},seller_id.eq.${user!.id}`)
    .order("created_at", { ascending: false });

  const rows = await Promise.all(
    (conversations ?? []).map(async (conversation) => {
      const otherUserId =
        conversation.buyer_id === user!.id
          ? conversation.seller_id
          : conversation.buyer_id;

      const [{ data: annonce }, { data: otherUser }, { data: lastMessage }] =
        await Promise.all([
          supabase
            .from("annonces")
            .select("title")
            .eq("id", conversation.annonce_id)
            .maybeSingle(),
          supabase
            .from("public_profiles")
            .select("*")
            .eq("id", otherUserId)
            .maybeSingle(),
          supabase
            .from("messages")
            .select("content, created_at")
            .eq("conversation_id", conversation.id)
            .order("created_at", { ascending: false })
            .limit(1)
            .maybeSingle(),
        ]);

      return {
        id: conversation.id,
        annonceTitle: annonce?.title ?? "Annonce supprimée",
        otherUserName: getDisplayName(otherUser),
        lastMessage: lastMessage?.content ?? null,
        lastMessageDate: lastMessage?.created_at ?? conversation.created_at,
      };
    }),
  );

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-semibold text-xl">Messages</h1>

      {rows.length === 0 ? (
        <p className="text-muted-foreground text-sm">
          Vous n&apos;avez pas encore de conversation.
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {rows.map((row) => (
            <li key={row.id}>
              <Link
                href={`/dashboard/messages/${row.id}`}
                className="flex items-center justify-between gap-4 rounded-lg border border-border p-4 transition-colors hover:bg-muted"
              >
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{row.otherUserName}</span>
                    <span className="text-muted-foreground text-sm">
                      — {row.annonceTitle}
                    </span>
                  </div>
                  {row.lastMessage && (
                    <p className="line-clamp-1 text-muted-foreground text-sm">
                      {row.lastMessage}
                    </p>
                  )}
                </div>
                <span className="shrink-0 text-muted-foreground text-xs">
                  {dateFormatter.format(new Date(row.lastMessageDate))}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
