import { redirect } from "next/navigation";
import PricingPro from "@/components/pricing-pro";
import { createClient } from "@/lib/supabase/server";

export default async function OffreProPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("status")
    .eq("user_id", user!.id)
    .maybeSingle();

  const isActive =
    subscription?.status === "active" || subscription?.status === "trialing";

  if (isActive) {
    redirect("/dashboard/abonnement");
  }

  return <PricingPro />;
}
