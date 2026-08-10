"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function updateLocalisation(
  _prevState: { error: string } | null,
  formData: FormData,
) {
  const id = String(formData.get("annonceId") ?? "");
  const postalCode = String(formData.get("postal_code") ?? "").trim();
  const city = String(formData.get("city") ?? "").trim();
  const hideExactLocation = formData.has("hide_exact_location");

  if (!postalCode || !city) {
    return { error: "Le code postal et la ville sont obligatoires." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("annonces")
    .update({
      postal_code: postalCode,
      city,
      hide_exact_location: hideExactLocation,
    })
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  redirect(`/annonces/${id}/photos`);
}
