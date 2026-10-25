"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { navLinkClassName } from "@/components/nav-link-style";

const links = [
  { href: "/", label: "Accueil" },
  { href: "#", label: "Nous connaître" },
  { href: "/carrieres", label: "Carrières" },
  { href: "/actualite", label: "Actualité" },
  { href: "/contact", label: "Contact" },
];

export const NavMenu = (props: ComponentProps<typeof NavigationMenu>) => {
  // Base UI n'expose pas data-orientation sur la liste : disposition explicite
  const vertical = props.orientation === "vertical";

  return (
    <NavigationMenu
      {...props}
      className={cn(vertical && "max-w-none items-start justify-start", props.className)}
    >
      <NavigationMenuList
        className={cn(vertical && "-ms-2 w-full flex-col items-start justify-start gap-1")}
      >
        {links.map(({ href, label }) => (
          <NavigationMenuItem key={label}>
            <NavigationMenuLink className={navLinkClassName} render={<Link href={href} />}>{label}</NavigationMenuLink>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
};
