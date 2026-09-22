"use client";

import { useTranslations } from "next-intl";
import type { ComponentProps } from "react";
import { cn } from "cn";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Link } from "@/i18n/navigation";

export const NavMenu = ({
  orientation,
  ...props
}: ComponentProps<typeof NavigationMenu>) => {
  const t = useTranslations("Navbar");
  const isVertical = orientation === "vertical";

  return (
    <NavigationMenu orientation={orientation} {...props}>
      <NavigationMenuList
        className={cn(isVertical && "-ms-2 flex-col items-start justify-start")}
      >
        <NavigationMenuItem>
          <NavigationMenuLink className={navigationMenuTriggerStyle()} render={<Link href="/" />}>{t("home")}</NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink className={navigationMenuTriggerStyle()} render={<Link href="#" />}>{t("network")}</NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink className={navigationMenuTriggerStyle()} render={<Link href="#" />}>{t("jobs")}</NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink className={navigationMenuTriggerStyle()} render={<Link href="#" />}>{t("messaging")}</NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink className={navigationMenuTriggerStyle()} render={<Link href="#" />}>{t("notifications")}</NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};
