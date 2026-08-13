"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

async function getOwnedAnnonceStatus(
  supabase: Awaited<ReturnType<typeof createClient>>,
  annonceId: string,
  userId: string,
) {
  const { data: annonce } = await supabase
    .from("annonces")
    .select("id, status, author_id")
    .eq("id", annonceId)
    .single();

  if (!annonce || annonce.author_id !== userId) {
    return null;
  }

  return annonce;
}

export async function toggleArchiveAnnonce(formData: FormData) {
  const annonceId = String(formData.get("annonceId") ?? "");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const annonce = await getOwnedAnnonceStatus(supabase, annonceId, user.id);
  if (!annonce) return;

  const nextStatus = annonce.status === "archivee" ? "publiee" : "archivee";

  await supabase.from("annonces").update({ status: nextStatus }).eq("id", annonceId);

  revalidatePath("/dashboard/annonces");
}

export async function deleteAnnonce(formData: FormData) {
  const annonceId = String(formData.get("annonceId") ?? "");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const annonce = await getOwnedAnnonceStatus(supabase, annonceId, user.id);
  if (!annonce) return;

  const { data: images } = await supabase
    .from("annonce_images")
    .select("storage_path")
    .eq("annonce_id", annonceId);

  if (images && images.length > 0) {
    await supabase.storage
      .from("annonces-images")
      .remove(images.map((image) => image.storage_path));
  }

  await supabase.from("annonces").delete().eq("id", annonceId);

  revalidatePath("/dashboard/annonces");
}
