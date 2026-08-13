"use client";

import { FileText, Home, User, Wallet } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const links = [
  { href: "/dashboard", label: "Tableau de bord", icon: Home },
  { href: "/dashboard/annonces", label: "Mes annonces", icon: FileText },
  { href: "/dashboard/abonnement", label: "Mon abonnement", icon: Wallet },
  { href: "/dashboard/profil", label: "Mon profil", icon: User },
] as const;

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="offcanvas">
      <SidebarHeader className="px-3 py-4">
        <span className="font-semibold text-sm">Mon espace</span>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {links.map((link) => (
                <SidebarMenuItem key={link.href}>
                  <SidebarMenuButton
                    render={<Link href={link.href} />}
                    isActive={pathname === link.href}
                  >
                    <link.icon />
                    <span>{link.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
