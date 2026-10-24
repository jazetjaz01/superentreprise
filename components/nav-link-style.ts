import { cn } from "@/lib/utils";
import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";

// Style des liens de la navbar (menu, Connexion, S'enregistrer) :
// pas de fond au survol, un trait se déploie de gauche à droite sous le texte
export const navLinkClassName = cn(
  navigationMenuTriggerStyle(),
  "relative text-xs uppercase tracking-wide hover:bg-transparent focus:bg-transparent",
  "after:absolute after:inset-x-2.5 after:bottom-1 after:h-px after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-300",
  "hover:after:scale-x-100 focus-visible:after:scale-x-100"
);
