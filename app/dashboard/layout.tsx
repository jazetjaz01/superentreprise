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

  return (
    <SidebarProvider className="items-start">
      <DashboardSidebar />
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
