"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function updateInformations(
  _prevState: { error: string } | null,
  formData: FormData,
) {
  const id = String(formData.get("annonceId") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const transactionType = String(formData.get("transaction_type") ?? "");
  const sector = String(formData.get("sector") ?? "");
  const activity = String(formData.get("activity") ?? "");
  const descriptionShort = String(formData.get("description_short") ?? "");

  if (!title || !transactionType || !sector || !activity) {
    return { error: "Merci de remplir tous les champs obligatoires." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("annonces")
    .update({
      title,
      transaction_type: transactionType,
      sector,
      activity,
      description_short: descriptionShort || null,
    })
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  redirect(`/annonces/${id}/finances`);
}
