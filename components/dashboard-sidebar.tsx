"use client";

import { Building2, CreditCard, FileText, Heart, HelpCircle, Home, MessageCircle, Tag, User, Wallet, XCircle } from "lucide-react";
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

export function DashboardSidebar({
  showSellerMenu,
  isProfessional,
}: {
  showSellerMenu: boolean;
  isProfessional: boolean;
}) {
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
              <SidebarMenuItem>
                <SidebarMenuButton
                  render={<Link href="/dashboard" />}
                  isActive={pathname === "/dashboard"}
                >
                  <Home />
                  <span>Tableau de bord</span>
                </SidebarMenuButton>
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

              <SidebarMenuItem>
                <SidebarMenuButton
                  render={<Link href="/dashboard/messages" />}
                  isActive={pathname.startsWith("/dashboard/messages")}
                >
                  <MessageCircle />
                  <span>Messages</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  render={<Link href="/dashboard/favoris" />}
                  isActive={pathname === "/dashboard/favoris"}
                >
                  <Heart />
                  <span>Favoris</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {showSellerMenu && (
                <SidebarMenuItem>
                  <SidebarMenuButton
                    render={<Link href="/dashboard/profil/societe" />}
                    isActive={pathname === "/dashboard/profil/societe"}
                  >
                    <Building2 />
                    <span>Profil société</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}

              {showSellerMenu && (
                <>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      render={<Link href="/dashboard/annonces" />}
                      isActive={pathname === "/dashboard/annonces"}
                    >
                      <FileText />
                      <span>Mes annonces</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton
                      render={<Link href="/dashboard/abonnement" />}
                      isActive={pathname === "/dashboard/abonnement"}
                    >
                      <Wallet />
                      <span>Mon abonnement</span>
                    </SidebarMenuButton>
                    <SidebarMenuSub>
                      {!isProfessional && (
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton
                            render={<Link href="/dashboard/abonnement/offre" />}
                            isActive={pathname === "/dashboard/abonnement/offre"}
                          >
                            <Tag />
                            <span>Offre abonnement</span>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      )}
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton
                          render={<Link href="/dashboard/abonnement/offre-pro" />}
                          isActive={pathname === "/dashboard/abonnement/offre-pro"}
                        >
                          <Tag />
                          <span>Offre pro</span>
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
                </>
              )}

              <SidebarMenuItem>
                <SidebarMenuButton
                  render={<Link href="/dashboard/faq" />}
                  isActive={pathname === "/dashboard/faq"}
                >
                  <HelpCircle />
                  <span>FAQ</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
