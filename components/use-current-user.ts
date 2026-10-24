"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export type NavUser = { name: string } | null;

// Utilisateur connecté côté navigateur : undefined pendant le chargement,
// null si personne n'est connecté. Revérifié à chaque changement de page
// (la connexion se fait côté serveur, le navigateur n'en est pas notifié).
export function useCurrentUser(): NavUser | undefined {
  const pathname = usePathname();
  const [user, setUser] = useState<NavUser | undefined>(undefined);

  useEffect(() => {
    const supabase = createClient();
    let cancelled = false;

    const load = async () => {
      const { data } = await supabase.auth.getClaims();
      const claims = data?.claims;
      if (!claims) {
        if (!cancelled) setUser(null);
        return;
      }
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", claims.sub)
        .maybeSingle();
      if (!cancelled) setUser({ name: profile?.full_name || claims.email || "Mon compte" });
    };

    load();
    const { data: subscription } = supabase.auth.onAuthStateChange(() => {
      load();
    });

    return () => {
      cancelled = true;
      subscription.subscription.unsubscribe();
    };
  }, [pathname]);

  return user;
}
