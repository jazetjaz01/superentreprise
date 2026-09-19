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

export const NavMenu = (props: ComponentProps<typeof NavigationMenu>) => (
  <NavigationMenu {...props}>
    <NavigationMenuList className="data-[orientation=vertical]:-ms-2 data-[orientation=vertical]:flex-col data-[orientation=vertical]:items-start data-[orientation=vertical]:justify-start">
      <NavigationMenuItem>
        <NavigationMenuLink className={navigationMenuTriggerStyle()} render={<Link href="#" />}>Accueil</NavigationMenuLink>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <NavigationMenuLink className={navigationMenuTriggerStyle()} render={<Link href="#" />}>Réseau</NavigationMenuLink>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <NavigationMenuLink className={navigationMenuTriggerStyle()} render={<Link href="#" />}>Emploi</NavigationMenuLink>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <NavigationMenuLink className={navigationMenuTriggerStyle()} render={<Link href="#" />}>Messagerie</NavigationMenuLink>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <NavigationMenuLink className={navigationMenuTriggerStyle()} render={<Link href="#" />}>Notifications</NavigationMenuLink>
      </NavigationMenuItem>

    </NavigationMenuList>
  </NavigationMenu>
);
