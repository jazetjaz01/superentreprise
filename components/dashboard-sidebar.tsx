"use client";

import { CreditCard, FileText, Home, Tag, User, Wallet, XCircle } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cancelSubscription } from "@/app/dashboard/abonnement/actions";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";

const links = [
  { href: "/dashboard", label: "Tableau de bord", icon: Home },
  { href: "/dashboard/annonces", label: "Mes annonces", icon: FileText },
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

              <SidebarMenuItem>
                <SidebarMenuButton
                  render={<Link href="/dashboard/abonnement" />}
                  isActive={pathname === "/dashboard/abonnement"}
                >
                  <Wallet />
                  <span>Mon abonnement</span>
                </SidebarMenuButton>
                <SidebarMenuSub>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton
                      render={<Link href="/dashboard/abonnement/offre" />}
                      isActive={pathname === "/dashboard/abonnement/offre"}
                    >
                      <Tag />
                      <span>Offre abonnement</span>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                  <SidebarMenuSubItem>
                    <form action="/api/stripe/portal" method="POST">
                      <SidebarMenuSubButton render={<button type="submit" />}>
                        <FileText />
                        <span>Factures</span>
                      </SidebarMenuSubButton>
                    </form>
                  </SidebarMenuSubItem>
                  <SidebarMenuSubItem>
                    <form action="/api/stripe/portal" method="POST">
                      <input
                        type="hidden"
                        name="flow"
                        value="payment_method_update"
                      />
                      <SidebarMenuSubButton render={<button type="submit" />}>
                        <CreditCard />
                        <span>Moyen de paiement</span>
                      </SidebarMenuSubButton>
                    </form>
                  </SidebarMenuSubItem>
                  <SidebarMenuSubItem>
                    <form
                      action={cancelSubscription}
                      onSubmit={(event) => {
                        if (
                          !confirm(
                            "Résilier votre abonnement ? Votre annonce restera diffusée jusqu'à la fin de la période en cours, puis sera dépubliée.",
                          )
                        ) {
                          event.preventDefault();
                        }
                      }}
                    >
                      <SidebarMenuSubButton render={<button type="submit" />}>
                        <XCircle />
                        <span>Résilier abonnement</span>
                      </SidebarMenuSubButton>
                    </form>
                  </SidebarMenuSubItem>
                </SidebarMenuSub>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  render={<Link href="/dashboard/profil" />}
                  isActive={pathname === "/dashboard/profil"}
                >
                  <User />
                  <span>Mon profil</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
