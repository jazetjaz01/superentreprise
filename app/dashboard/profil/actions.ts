"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function updateProfile(
  _prevState: { error: string; success?: boolean } | null,
  formData: FormData,
) {
  const firstName = String(formData.get("first_name") ?? "").trim();
  const lastName = String(formData.get("last_name") ?? "").trim();
  const displayName = String(formData.get("display_name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Vous devez être connecté." };
  }

  const { data: existingProfile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const isSeller = existingProfile?.role !== "acheteur";

  if (displayName.length > 40) {
    return { error: "Le surnom ne doit pas dépasser 40 caractères." };
  }

  if (isSeller && !phone) {
    return {
      error: "Merci de renseigner votre téléphone (obligatoire pour diffuser une annonce).",
    };
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      first_name: firstName || null,
      last_name: lastName || null,
      display_name: displayName || null,
      phone: phone || null,
    })
    .eq("id", user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard/profil");

  return { error: "", success: true };
}
