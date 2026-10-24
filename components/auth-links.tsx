"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { navLinkClassName } from "@/components/nav-link-style";
import { useCurrentUser } from "@/components/use-current-user";

// Navbar et menu mobile : « Connexion / S'enregistrer » pour les visiteurs,
// nom (ou email) + « Se déconnecter » pour les utilisateurs connectés
export const AuthLinks = ({ className }: { className?: string }) => {
  const user = useCurrentUser();

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {user === undefined ? (
        // Chargement : espace réservé invisible, évite d'afficher « Connexion » à tort
        <span aria-hidden="true" className="h-9 w-40" />
      ) : user ? (
        <>
          <Link
            href="/compte"
            title="Mon compte"
            className={cn(navLinkClassName, "max-w-48 normal-case tracking-normal")}
          >
            <span className="truncate">{user.name}</span>
          </Link>
          {/* Route serveur existante : déconnecte puis redirige vers /connexion */}
          <form action="/auth/signout" method="post">
            <button type="submit" className={navLinkClassName}>
              Se déconnecter
            </button>
          </form>
        </>
      ) : (
        <>
          <Link href="/connexion" className={navLinkClassName}>
            Connexion
          </Link>
          <Link href="/inscription" className={navLinkClassName}>
            S’enregistrer
          </Link>
        </>
      )}
    </div>
  );
};
