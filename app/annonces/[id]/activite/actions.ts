"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function updateActivity(
  _prevState: { error: string } | null,
  formData: FormData,
) {
  const id = String(formData.get("annonceId") ?? "");
  const activity = String(formData.get("activity") ?? "").trim();
  const sector = String(formData.get("sector") ?? "").trim();

  if (!activity) {
    return { error: "Merci de sélectionner ou saisir une activité." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("annonces")
    .update({
      activity,
      sector: sector || null,
    })
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  redirect(`/annonces/${id}/informations`);
}
