"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { navLinkClassName } from "@/components/nav-link-style";

type NavLink = { href: string; label: string };
type NavEntry = NavLink | { label: string; children: NavLink[] };

const links: NavEntry[] = [
  { href: "/", label: "Accueil" },
  {
    label: "Expertise",
    // Pages dédiées à venir : section « Notre expertise » de l'accueil en attendant
    children: [
      { href: "/#expertise", label: "Valoriser" },
      { href: "/#expertise", label: "Préparer" },
      { href: "/#expertise", label: "Transmettre" },
    ],
  },
  { href: "/#nous-connaitre", label: "Nous connaître" },
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
        {links.map((entry) =>
          "children" in entry ? (
            vertical ? (
              // Menu mobile : titre + sous-liens en retrait (pas de panneau déroulant)
              <NavigationMenuItem key={entry.label}>
                <span className="block px-2.5 py-1.5 text-xs font-medium uppercase tracking-wide">
                  {entry.label}
                </span>
                <ul className="ms-4 border-s border-current/20">
                  {entry.children.map(({ href, label }) => (
                    <li key={label}>
                      <NavigationMenuLink className={navLinkClassName} render={<Link href={href} />}>
                        {label}
                      </NavigationMenuLink>
                    </li>
                  ))}
                </ul>
              </NavigationMenuItem>
            ) : (
              // Ordinateur : « Expertise ⌄ » ouvre un panneau déroulant
              <NavigationMenuItem key={entry.label}>
                <NavigationMenuTrigger
                  className={cn(
                    navLinkClassName,
                    "data-popup-open:bg-transparent data-popup-open:hover:bg-transparent data-open:bg-transparent data-open:hover:bg-transparent"
                  )}
                >
                  {entry.label}
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-56 gap-0.5 p-1">
                    {entry.children.map(({ href, label }) => (
                      <li key={label}>
                        <NavigationMenuLink
                          className="block rounded-md px-4 py-2.5 text-sm font-medium uppercase tracking-wide text-brand hover:bg-brand/5 focus:bg-brand/5"
                          render={<Link href={href} />}
                        >
                          {label}
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            )
          ) : (
            <NavigationMenuItem key={entry.label}>
              <NavigationMenuLink className={navLinkClassName} render={<Link href={entry.href} />}>
                {entry.label}
              </NavigationMenuLink>
            </NavigationMenuItem>
          )
        )}
      </NavigationMenuList>
    </NavigationMenu>
  );
};
