"use client";

import { Plus, Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { UserAvatar } from "@/components/user-avatar";
import { useRouter } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/client";

type ProfileRow = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
};

type NewConversationDialogProps = {
  mode: "personal" | "official";
  selfProfileId: string;
};

export const NewConversationDialog = ({ mode, selfProfileId }: NewConversationDialogProps) => {
  const t = useTranslations("Messaging");
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [profiles, setProfiles] = useState<ProfileRow[] | null>(null);
  const [isStarting, setIsStarting] = useState(false);

  useEffect(() => {
    if (!open) return;

    const supabase = createClient();
    const loadProfiles = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("id, full_name, avatar_url")
        .neq("id", selfProfileId)
        .order("full_name", { ascending: true })
        .limit(100);
      setProfiles(data ?? []);
    };

    loadProfiles();
  }, [open, selfProfileId]);

  const filteredProfiles = profiles?.filter((profile) =>
    (profile.full_name ?? "").toLowerCase().includes(query.trim().toLowerCase()),
  );

  const handleSelect = async (profileId: string) => {
    setIsStarting(true);
    const supabase = createClient();
    const { data, error } =
      mode === "personal"
        ? await supabase.rpc("start_conversation", { p_other_profile_id: profileId })
        : await supabase.rpc("start_official_conversation", { p_user_id: profileId });
    setIsStarting(false);
    if (error || !data) return;

    setOpen(false);
    const href = mode === "official" ? `/messaging?admin=official&c=${data}` : `/messaging?c=${data}`;
    router.push(href);
    router.refresh();
  };

  return (
    <>
      <Button type="button" variant="outline" className="rounded-full" onClick={() => setOpen(true)}>
        <Plus className="size-4" strokeWidth={1.5} />
        {mode === "personal" ? t("newMessage") : t("newOfficialMessage")}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{mode === "personal" ? t("newMessage") : t("newOfficialMessage")}</DialogTitle>
          </DialogHeader>

          <label className="flex items-center gap-2 rounded-md border border-border px-3 py-2">
            <Search className="size-4 shrink-0 text-muted-foreground" strokeWidth={1.5} />
            <input
              autoFocus
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("searchPlaceholder")}
              className="w-full bg-transparent text-base outline-none placeholder:text-muted-foreground"
            />
          </label>

          <div className="flex max-h-80 flex-col gap-1 overflow-y-auto">
            {filteredProfiles === undefined ? null : filteredProfiles.length === 0 ? (
              <p className="py-4 text-center text-base text-muted-foreground">{t("noResults")}</p>
            ) : (
              filteredProfiles.map((profile) => (
                <button
                  key={profile.id}
                  type="button"
                  disabled={isStarting}
                  onClick={() => handleSelect(profile.id)}
                  className="hover:bg-foreground/[.07] flex items-center gap-3 rounded-md px-2 py-2 text-left disabled:opacity-50"
                >
                  <UserAvatar name={profile.full_name ?? t("anonymous")} avatarUrl={profile.avatar_url} size={36} />
                  <span className="text-base font-medium text-foreground">
                    {profile.full_name ?? t("anonymous")}
                  </span>
                </button>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
