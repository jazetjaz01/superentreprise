import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./database.types";

// Client Supabase pour les Client Components ("use client")
export const createClient = () =>
  createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );
