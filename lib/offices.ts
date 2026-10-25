import { cacheLife, cacheTag } from "next/cache";
import { createPublicClient } from "@/lib/supabase/public";

export const OFFICES_TAG = "offices";

export type Office = {
  id: number;
  city: string;
  name: string;
  address_line: string;
  postal_code: string;
  phone: string | null;
  email: string | null;
  latitude: number;
  longitude: number;
};

// Agences publiées (RLS), dans l'ordre d'affichage
export async function getOffices(): Promise<Office[]> {
  "use cache";
  cacheTag(OFFICES_TAG);

  const { data, error } = await createPublicClient()
    .from("offices")
    .select("id, city, name, address_line, postal_code, phone, email, latitude, longitude")
    .order("sort_order");

  if (error) {
    // Table pas encore créée (migration non appliquée) : on n'affiche rien,
    // avec un cache très court pour réessayer rapidement
    console.error("[offices] Lecture impossible :", error.message);
    cacheLife("seconds");
    return [];
  }
  cacheLife("days");
  return data;
}
