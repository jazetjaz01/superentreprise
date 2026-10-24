import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { AuthLinks } from "@/components/auth-links";
import { Logo } from "@/components/logo";
import { NavMenu } from "@/components/nav-menu";

export const NavigationSheet = () => {
  return (
    <Sheet>
      <VisuallyHidden>
        <SheetTitle>Navigation Menu</SheetTitle>
      </VisuallyHidden>

      {/* Trois traits horizontaux, couleur héritée de la navbar (blanc sur la vidéo) */}
      <SheetTrigger
        aria-label="Ouvrir le menu"
        className="flex size-10 flex-col items-center justify-center gap-1.5"
      >
        <span className="h-0.5 w-6 bg-current" />
        <span className="h-0.5 w-6 bg-current" />
        <span className="h-0.5 w-6 bg-current" />
      </SheetTrigger>
      <SheetContent className="px-6 py-3 text-brand">
        <Logo />
        <NavMenu className="mt-6 [&>div]:h-full" orientation="vertical" />
        <AuthLinks className="-ms-2 mt-4 flex-col items-start" />
      </SheetContent>
    </Sheet>
  );
};
