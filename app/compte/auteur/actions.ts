"use server";

import { updateTag } from "next/cache";
import { requireWriter } from "@/lib/auth";
import { ARTICLES_TAG } from "@/lib/articles";
import { isOwnStorageUrl, removeOwnImage } from "@/lib/storage";
import { createClient } from "@/lib/supabase/server";

export type FormState =
  | { error?: string; message?: string; avatarUrl?: string | null; savedAt?: number }
  | undefined;

export async function saveAuthor(_state: FormState, formData: FormData): Promise<FormState> {
  const user = await requireWriter();

  const displayName = String(formData.get("display_name") ?? "").trim();
  const bio = String(formData.get("bio") ?? "").trim();
  const avatarUrl = String(formData.get("avatar_url") ?? "");

  if (displayName.length < 2 || displayName.length > 100) {
    return { error: "Le nom affiché doit contenir entre 2 et 100 caractères." };
  }
  if (avatarUrl && !isOwnStorageUrl(avatarUrl, "avatars", user.id)) {
    return { error: "Image invalide." };
  }

  const supabase = await createClient();
  const values = {
    display_name: displayName,
    bio: bio || null,
    avatar_url: avatarUrl || null,
  };

  // Pas d'upsert : la colonne id n'est pas modifiable (droits de la table)
  const { data: existing } = await supabase
    .from("authors")
    .select("id, avatar_url")
    .eq("id", user.id)
    .maybeSingle();
  const { error } = existing
    ? await supabase.from("authors").update(values).eq("id", user.id)
    : await supabase.from("authors").insert({ id: user.id, ...values });

  if (error) return { error: "L’enregistrement a échoué. Réessayez." };

  // Ancienne photo remplacée ou retirée : on la supprime du bucket
  if (existing?.avatar_url && existing.avatar_url !== values.avatar_url) {
    await removeOwnImage(supabase, existing.avatar_url, "avatars", user.id);
  }

  // Le nom et l'avatar apparaissent sur les articles publiés
  updateTag(ARTICLES_TAG);
  return {
    message: "Votre fiche auteur est enregistrée.",
    avatarUrl: values.avatar_url,
    savedAt: Date.now(),
  };
}
