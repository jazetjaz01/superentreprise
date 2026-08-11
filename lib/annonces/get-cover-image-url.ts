import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Tables } from "@/lib/supabase/database.types";

export function getCoverImageUrl(
  supabase: SupabaseClient<Database>,
  images: Tables<"annonce_images">[],
) {
  const cover = images.find((image) => image.is_cover) ?? images[0];
  if (!cover) return null;

  return supabase.storage.from("annonces-images").getPublicUrl(cover.storage_path)
    .data.publicUrl;
}
