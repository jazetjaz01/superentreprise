"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { navLinkClassName } from "@/components/nav-link-style";
import { useCurrentUser } from "@/components/use-current-user";

// Menu mobile et footer : « Connexion / S'enregistrer » pour les visiteurs,
// nom (ou email) + « Se déconnecter » pour les utilisateurs connectés
export const AuthLinks = ({
  className,
  variant = "nav",
}: {
  className?: string;
  variant?: "nav" | "footer";
}) => {
  const user = useCurrentUser();
  const linkClassName = variant === "footer" ? "text-left hover:underline" : navLinkClassName;

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
            className={cn(
              linkClassName,
              "max-w-48",
              variant === "nav" && "normal-case tracking-normal"
            )}
          >
            <span className="truncate">{user.name}</span>
          </Link>
          {/* Route serveur existante : déconnecte puis redirige vers /connexion */}
          <form action="/auth/signout" method="post">
            <button type="submit" className={linkClassName}>
              Se déconnecter
            </button>
          </form>
        </>
      ) : (
        <>
          <Link href="/connexion" className={linkClassName}>
            Connexion
          </Link>
          <Link href="/inscription" className={linkClassName}>
            S’enregistrer
          </Link>
        </>
      )}
    </div>
  );
};
