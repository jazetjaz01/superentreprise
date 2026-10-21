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

const linkClassName = `${navigationMenuTriggerStyle()} uppercase tracking-wide over-video:hover:bg-white/15 over-video:focus:bg-white/15`;

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
