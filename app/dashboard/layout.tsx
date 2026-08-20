import { redirect } from "next/navigation";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/dashboard");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, is_professional")
    .eq("id", user.id)
    .maybeSingle();

  let role = profile?.role ?? null;

  if (!role) {
    const pendingRole = user.user_metadata?.role;
    if (pendingRole === "vendeur" || pendingRole === "acheteur") {
      await supabase.from("profiles").update({ role: pendingRole }).eq("id", user.id);
      role = pendingRole;
    } else {
      redirect("/onboarding/role?next=/dashboard");
    }
  }

  const { count: annonceCount } = await supabase
    .from("annonces")
    .select("*", { count: "exact", head: true })
    .eq("author_id", user.id);

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  const showSellerMenu = role === "vendeur" || (annonceCount ?? 0) > 0 || !!subscription;

  return (
    <SidebarProvider className="items-start">
      <DashboardSidebar
        showSellerMenu={showSellerMenu}
        isProfessional={profile?.is_professional ?? false}
      />
      <SidebarInset className="min-w-0">
        <div className="flex items-center gap-2 border-border border-b px-6 py-4 md:hidden">
          <SidebarTrigger />
          <span className="font-medium text-sm">Mon espace</span>
        </div>
        <div className="min-w-0 px-6 py-8 md:py-12">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
