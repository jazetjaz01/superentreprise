import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { createServiceClient } from "@/lib/supabase/service";

function getCurrentPeriodEnd(subscription: Stripe.Subscription) {
  const timestamp =
    subscription.items.data[0]?.current_period_end ??
    (subscription as unknown as { current_period_end?: number })
      .current_period_end;

  return timestamp ? new Date(timestamp * 1000).toISOString() : null;
}

async function syncSubscription(
  subscription: Stripe.Subscription,
  fallbackAnnonceId?: string,
) {
  const supabase = createServiceClient();
  const userId = subscription.metadata.user_id;
  const annonceId = subscription.metadata.annonce_id || fallbackAnnonceId || undefined;

  if (!userId) {
    return;
  }

  const customerId =
    typeof subscription.customer === "string"
      ? subscription.customer
      : subscription.customer.id;

  await supabase.from("subscriptions").upsert(
    {
      user_id: userId,
      annonce_id: annonceId ?? null,
      stripe_customer_id: customerId,
      stripe_subscription_id: subscription.id,
      status: subscription.status,
      current_period_end: getCurrentPeriodEnd(subscription),
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" },
  );

  if (!annonceId) {
    return;
  }

  const isActive =
    subscription.status === "active" || subscription.status === "trialing";

  await supabase
    .from("annonces")
    .update({ status: isActive ? "publiee" : "brouillon" })
    .eq("id", annonceId);
}

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Signature manquante." }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = getStripe().webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (error) {
    return NextResponse.json(
      { error: `Signature invalide: ${(error as Error).message}` },
      { status: 400 },
    );
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      if (session.subscription) {
        const subscriptionId =
          typeof session.subscription === "string"
            ? session.subscription
            : session.subscription.id;
        const subscription = await getStripe().subscriptions.retrieve(subscriptionId);
        await syncSubscription(subscription, session.metadata?.annonce_id);
      }
      break;
    }
    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      await syncSubscription(event.data.object);
      break;
    }
    default:
      break;
  }

  return NextResponse.json({ received: true });
}
