import Link from "next/link";
import { cn } from "@/lib/utils";
import { navLinkClassName } from "@/components/nav-link-style";

// Liens « Connexion » et « S'enregistrer » (navbar et menu mobile)
export const AuthLinks = ({ className }: { className?: string }) => (
  <div className={cn("flex items-center gap-1", className)}>
    <Link href="/connexion" className={navLinkClassName}>
      Connexion
    </Link>
    <Link href="/inscription" className={navLinkClassName}>
      S’enregistrer
    </Link>
  </div>
);
