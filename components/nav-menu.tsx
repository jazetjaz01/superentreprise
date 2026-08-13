"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";

export const NavMenu = (props: ComponentProps<typeof NavigationMenu>) => (
  <NavigationMenu {...props}>
    <NavigationMenuList className="gap-1 space-x-0 text-sm">
      <NavigationMenuItem>
        <Button variant="ghost" render={<Link href="/" />} nativeButton={false}>Accueil</Button>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <Button variant="ghost" render={<Link href="/actualite" />} nativeButton={false}>Actualité</Button>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <Button variant="ghost" render={<Link href="/contact" />} nativeButton={false}>Contact</Button>
      </NavigationMenuItem>
    </NavigationMenuList>
  </NavigationMenu>
);
