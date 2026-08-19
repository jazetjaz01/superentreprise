"use server";

import { redirect } from "next/navigation";
import { getStripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";

export async function createDraftAnnonce() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/deposer-une-annonce");
  }

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("status, plan, max_annonces, stripe_subscription_id, annonce_id")
    .eq("user_id", user.id)
    .maybeSingle();

  const isSubscriptionActive =
    subscription?.status === "active" || subscription?.status === "trialing";
  const effectiveMax = isSubscriptionActive ? (subscription?.max_annonces ?? 1) : 1;

  const { count: existingCount } = await supabase
    .from("annonces")
    .select("*", { count: "exact", head: true })
    .eq("author_id", user.id)
    .neq("status", "archivee");

  if ((existingCount ?? 0) >= effectiveMax) {
    redirect("/dashboard/annonces");
  }

  const { data: annonce, error } = await supabase
    .from("annonces")
    .insert({
      author_id: user.id,
      title: "Nouvelle annonce",
      status: "brouillon",
    })
    .select("id")
    .single();

  if (error || !annonce) {
    throw new Error("Impossible de créer l'annonce.");
  }

  if (subscription && subscription.plan === "standard" && !subscription.annonce_id) {
    const serviceClient = createServiceClient();
    await serviceClient
      .from("subscriptions")
      .update({ annonce_id: annonce.id })
      .eq("user_id", user.id);

    if (subscription.stripe_subscription_id) {
      await getStripe().subscriptions.update(
        subscription.stripe_subscription_id,
        { metadata: { user_id: user.id, annonce_id: annonce.id } },
      );
    }
  }

  redirect(`/annonces/${annonce.id}/activite`);
}
