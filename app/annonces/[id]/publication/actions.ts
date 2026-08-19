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

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("status, max_annonces")
    .eq("user_id", user.id)
    .maybeSingle();

  const isSubscriptionActive =
    subscription?.status === "active" || subscription?.status === "trialing";

  if (!isSubscriptionActive) {
    return { error: "Un abonnement actif est nécessaire pour publier." };
  }

  const maxAnnonces = subscription?.max_annonces ?? 1;
  const { count } = await supabase
    .from("annonces")
    .select("*", { count: "exact", head: true })
    .eq("author_id", user.id)
    .eq("status", "publiee");

  if ((count ?? 0) >= maxAnnonces) {
    return {
      error:
        "Vous avez atteint le nombre maximum d'annonces diffusées pour votre abonnement.",
    };
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
