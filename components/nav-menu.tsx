"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

// Pas de fond au survol : un trait se déploie de gauche à droite sous le texte
const linkClassName = [
  navigationMenuTriggerStyle(),
  "relative text-xs uppercase tracking-wide hover:bg-transparent focus:bg-transparent",
  "after:absolute after:inset-x-2.5 after:bottom-1 after:h-px after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-300",
  "hover:after:scale-x-100 focus-visible:after:scale-x-100",
].join(" ");

const links = [
  { href: "/", label: "Accueil" },
  { href: "#", label: "Nous connaître" },
  { href: "#", label: "Carrières" },
  { href: "#", label: "Actualité" },
  { href: "/contact", label: "Contact" },
];

export const NavMenu = (props: ComponentProps<typeof NavigationMenu>) => (
  <NavigationMenu {...props}>
    <NavigationMenuList className="data-[orientation=vertical]:-ms-2 data-[orientation=vertical]:flex-col data-[orientation=vertical]:items-start data-[orientation=vertical]:justify-start">
      {links.map(({ href, label }) => (
        <NavigationMenuItem key={label}>
          <NavigationMenuLink className={linkClassName} render={<Link href={href} />}>{label}</NavigationMenuLink>
        </NavigationMenuItem>
      ))}
    </NavigationMenuList>
  </NavigationMenu>
);
