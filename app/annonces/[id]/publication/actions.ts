"use server";

import { getMissingFields } from "@/lib/annonces/get-missing-fields";
import { createClient } from "@/lib/supabase/server";

type PublishState = { error: string; published?: boolean } | null;

export async function publishAnnonce(
  _prevState: PublishState,
  formData: FormData,
): Promise<PublishState> {
  const id = String(formData.get("annonceId") ?? "");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Vous devez être connecté." };
  }

  const { data: annonce } = await supabase
    .from("annonces")
    .select("*")
    .eq("id", id)
    .single();

  if (!annonce || annonce.author_id !== user.id) {
    return { error: "Annonce introuvable." };
  }

  const { data: images } = await supabase
    .from("annonce_images")
    .select("*")
    .eq("annonce_id", id);

  if (getMissingFields(annonce, images ?? []).length > 0) {
    return { error: "Merci de compléter les informations manquantes." };
  }

  const { error } = await supabase
    .from("annonces")
    .update({ status: "publiee" })
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  return { error: "", published: true };
}
