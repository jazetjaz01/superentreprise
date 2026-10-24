"use server";

import { updateTag } from "next/cache";
import { requireWriter } from "@/lib/auth";
import { ARTICLES_TAG } from "@/lib/articles";
import { isOwnStorageUrl } from "@/lib/storage";
import { createClient } from "@/lib/supabase/server";

export type FormState = { error?: string; message?: string } | undefined;

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
    .select("id")
    .eq("id", user.id)
    .maybeSingle();
  const { error } = existing
    ? await supabase.from("authors").update(values).eq("id", user.id)
    : await supabase.from("authors").insert({ id: user.id, ...values });

  if (error) return { error: "L’enregistrement a échoué. Réessayez." };

  // Le nom et l'avatar apparaissent sur les articles publiés
  updateTag(ARTICLES_TAG);
  return { message: "Votre fiche auteur est enregistrée." };
}
