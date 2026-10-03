import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Service-role client for trusted server-to-server contexts only (Stripe
 * webhook handling). Bypasses RLS entirely — never expose to request
 * handlers that act on behalf of a signed-in user.
 */
export const createServiceClient = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) {
    throw new Error("Missing Supabase service role environment variables");
  }
  return createSupabaseClient(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
};
