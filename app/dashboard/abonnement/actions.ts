"use server";

import { revalidatePath } from "next/cache";
import { getStripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";

async function getOwnedSubscription(userId: string) {
  const supabase = await createClient();
  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("stripe_subscription_id")
    .eq("user_id", userId)
    .maybeSingle();

  return subscription?.stripe_subscription_id ?? null;
}

export async function cancelSubscription() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const stripeSubscriptionId = await getOwnedSubscription(user.id);
  if (!stripeSubscriptionId) return;

  await getStripe().subscriptions.update(stripeSubscriptionId, {
    cancel_at_period_end: true,
  });

  await createServiceClient()
    .from("subscriptions")
    .update({ cancel_at_period_end: true })
    .eq("user_id", user.id);

  revalidatePath("/dashboard/abonnement");
}

export async function resumeSubscription() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const stripeSubscriptionId = await getOwnedSubscription(user.id);
  if (!stripeSubscriptionId) return;

  await getStripe().subscriptions.update(stripeSubscriptionId, {
    cancel_at_period_end: false,
  });

  await createServiceClient()
    .from("subscriptions")
    .update({ cancel_at_period_end: false })
    .eq("user_id", user.id);

  revalidatePath("/dashboard/abonnement");
}
