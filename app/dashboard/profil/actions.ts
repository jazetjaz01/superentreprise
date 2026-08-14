"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function updateProfile(
  _prevState: { error: string; success?: boolean } | null,
  formData: FormData,
) {
  const firstName = String(formData.get("first_name") ?? "").trim();
  const lastName = String(formData.get("last_name") ?? "").trim();
  const companyName = String(formData.get("company_name") ?? "").trim();
  const siren = String(formData.get("siren") ?? "").trim();
  const vatNumber = String(formData.get("vat_number") ?? "").trim();
  const companyAddress = String(formData.get("company_address") ?? "").trim();
  const companyPostalCode = String(
    formData.get("company_postal_code") ?? "",
  ).trim();
  const companyCity = String(formData.get("company_city") ?? "").trim();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Vous devez être connecté." };
  }

  if (
    !companyName ||
    !siren ||
    !vatNumber ||
    !companyAddress ||
    !companyPostalCode ||
    !companyCity
  ) {
    return {
      error:
        "Merci de compléter toutes les informations de facturation (obligatoires pour émettre les factures).",
    };
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      first_name: firstName || null,
      last_name: lastName || null,
      company_name: companyName,
      siren,
      vat_number: vatNumber,
      company_address: companyAddress,
      company_postal_code: companyPostalCode,
      company_city: companyCity,
    })
    .eq("id", user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard/profil");

  return { error: "", success: true };
}
