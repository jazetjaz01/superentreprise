"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function parseNumber(value: FormDataEntryValue | null) {
  if (!value) return null;
  const parsed = Number(String(value).replace(",", "."));
  return Number.isFinite(parsed) ? parsed : null;
}

export async function updateFinances(
  _prevState: { error: string } | null,
  formData: FormData,
) {
  const id = String(formData.get("annonceId") ?? "");
  const price = parseNumber(formData.get("price"));

  if (price === null) {
    return { error: "Le prix de vente est obligatoire." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("annonces")
    .update({
      price,
      revenue: parseNumber(formData.get("revenue")),
      ebitda: parseNumber(formData.get("ebitda")),
      rent: parseNumber(formData.get("rent")),
      employees_count: parseNumber(formData.get("employees_count")),
      description_long: String(formData.get("description_long") ?? "") || null,
    })
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  redirect(`/annonces/${id}/localisation`);
}
