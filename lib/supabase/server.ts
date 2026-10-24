import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Client Supabase pour les Server Components, Server Actions et Route Handlers
export const createClient = async () => {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Appelé depuis un Server Component : sans effet, sans conséquence
            // tant que le site n'a pas de sessions utilisateur à rafraîchir.
          }
        },
      },
    }
  );
};
