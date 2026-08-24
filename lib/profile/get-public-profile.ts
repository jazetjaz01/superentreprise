import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";

export async function getPublicProfile(
  supabase: SupabaseClient<Database>,
  id: string,
) {
  const { data } = await supabase.rpc("get_public_profiles", { ids: [id] });
  return data?.[0] ?? null;
}
