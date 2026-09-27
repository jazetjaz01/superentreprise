"use client";

import { Bell, BriefcaseBusiness, House, MessageSquare, Users } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "cn";
import { Link, usePathname } from "@/i18n/navigation";

type NavMenuProps = {
  orientation?: "horizontal" | "vertical";
  className?: string;
};

export const NavMenu = ({ orientation = "horizontal", className }: NavMenuProps) => {
  const t = useTranslations("Navbar");
  const pathname = usePathname();
  const isVertical = orientation === "vertical";

  const items = [
    { href: "/", icon: House, label: t("home") },
    { href: "#", icon: Users, label: t("network") },
    { href: "#", icon: BriefcaseBusiness, label: t("jobs") },
    { href: "#", icon: MessageSquare, label: t("messaging") },
    { href: "#", icon: Bell, label: t("notifications") },
  ] as const;

  return (
    <nav
      className={cn(
        "flex",
        isVertical ? "flex-col items-start gap-1" : "items-stretch gap-1",
        className,
      )}
    >
      {items.map(({ href, icon: Icon, label }) => {
        const isActive = href === pathname;

        return (
          <Link
            key={label}
            href={href}
            className={cn(
              "group flex text-ink-800 transition-colors hover:text-gold-700",
              isVertical
                ? "flex-row items-center gap-3 rounded-md px-2 py-2 text-sm"
                : "relative flex-col items-center justify-center gap-1 px-3 text-xs",
              isActive && !isVertical && "text-gold-700",
              isActive && isVertical && "bg-accent text-gold-700",
            )}
          >
            <Icon
              strokeWidth={1.5}
              className={cn(isVertical ? "size-5" : "size-5")}
            />
            <span>{label}</span>
            {isActive && !isVertical && (
              <span className="absolute inset-x-2 bottom-[-9.2px] h-px bg-primary" />
            )}
          </Link>
        );
      })}
    </nav>
  );
};
