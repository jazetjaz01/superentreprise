import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";

export async function getFavoriteIds(
  supabase: SupabaseClient<Database>,
  userId: string | undefined,
) {
  if (!userId) return new Set<string>();

  const { data } = await supabase
    .from("favoris")
    .select("annonce_id")
    .eq("user_id", userId);

  return new Set((data ?? []).map((row) => row.annonce_id));
}
