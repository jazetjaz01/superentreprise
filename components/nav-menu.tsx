"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { navLinkClassName } from "@/components/nav-link-style";

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
          <NavigationMenuLink className={navLinkClassName} render={<Link href={href} />}>{label}</NavigationMenuLink>
        </NavigationMenuItem>
      ))}
    </NavigationMenuList>
  </NavigationMenu>
);
