import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Menu } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Logo } from "@/components/logo";

const links = [
  { title: "Accueil", href: "/" },
  { title: "Actualité", href: "/actualite" },
  { title: "Contact", href: "/contact" },
];

export const NavigationSheet = () => {
  return (
    <Sheet>
      <VisuallyHidden>
        <SheetTitle>Navigation Menu</SheetTitle>
      </VisuallyHidden>

      <SheetTrigger render={<Button size="icon" variant="outline" />}><Menu /></SheetTrigger>
      <SheetContent className="px-6 py-3">
        <Logo />

        <div className="mt-12 flex flex-col gap-4 text-base">
          {links.map((link) => (
            <Link key={link.href} className="inline-block" href={link.href}>
              {link.title}
            </Link>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};
