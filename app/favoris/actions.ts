"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function toggleFavorite(formData: FormData) {
  const annonceId = String(formData.get("annonceId") ?? "");
  const next = String(formData.get("next") ?? "");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?next=${encodeURIComponent(next || "/annonces")}`);
  }

  const { data: existing } = await supabase
    .from("favoris")
    .select("id")
    .eq("user_id", user.id)
    .eq("annonce_id", annonceId)
    .maybeSingle();

  if (existing) {
    await supabase.from("favoris").delete().eq("id", existing.id);
  } else {
    await supabase.from("favoris").insert({
      user_id: user.id,
      annonce_id: annonceId,
    });
  }

  if (next) {
    revalidatePath(next);
  }
  revalidatePath("/dashboard/favoris");
}
