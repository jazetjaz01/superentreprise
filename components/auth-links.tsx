import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

// Liens « Connexion » et « S'enregistrer » (navbar et menu mobile)
export const AuthLinks = ({
  className,
  linkClassName,
}: {
  className?: string;
  linkClassName?: string;
}) => (
  <div className={cn("flex items-center gap-3", className)}>
    <Link
      href="/connexion"
      className={cn(buttonVariants({ variant: "outline" }), "text-foreground", linkClassName)}
    >
      Connexion
    </Link>
    <Link
      href="/inscription"
      className={cn(buttonVariants(), "bg-brand text-white hover:bg-brand/90", linkClassName)}
    >
      S’enregistrer
    </Link>
  </div>
);
