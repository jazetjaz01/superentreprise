"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function updateCompanyProfile(
  _prevState: { error: string; success?: boolean } | null,
  formData: FormData,
) {
  const companyName = String(formData.get("company_name") ?? "").trim();
  const siret = String(formData.get("siret") ?? "").trim();
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
    !siret ||
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
      company_name: companyName,
      siret,
      vat_number: vatNumber,
      company_address: companyAddress,
      company_postal_code: companyPostalCode,
      company_city: companyCity,
    })
    .eq("id", user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard/profil/societe");

  return { error: "", success: true };
}
