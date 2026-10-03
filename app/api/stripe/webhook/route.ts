import { NextResponse, type NextRequest } from "next/server";
import type Stripe from "stripe";

import { isPlanKey } from "@/lib/stripe/plans";
import { getStripe } from "@/lib/stripe/server";
import { createServiceClient } from "@/lib/supabase/service";

const upsertFromSubscription = async (subscription: Stripe.Subscription) => {
  const plan = subscription.metadata.plan;
  const ownerTable = subscription.metadata.ownerTable;
  const ownerId = subscription.metadata.ownerId;

  if (!plan || !isPlanKey(plan) || (ownerTable !== "profiles" && ownerTable !== "companies") || !ownerId) {
    return;
  }

  const customerId =
    typeof subscription.customer === "string" ? subscription.customer : subscription.customer.id;
  const periodEndSeconds = subscription.items.data[0]?.current_period_end;

  const service = createServiceClient();
  await service.from("subscriptions").upsert(
    {
      [ownerTable === "profiles" ? "profile_id" : "company_id"]: ownerId,
      plan,
      stripe_customer_id: customerId,
      stripe_subscription_id: subscription.id,
      status: subscription.status,
      current_period_end: periodEndSeconds
        ? new Date(periodEndSeconds * 1000).toISOString()
        : null,
      cancel_at_period_end: subscription.cancel_at_period_end,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "stripe_subscription_id" },
  );
};

export async function POST(request: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const payload = await request.text();
  const stripe = getStripe();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      if (typeof session.subscription === "string") {
        const subscription = await stripe.subscriptions.retrieve(session.subscription);
        await upsertFromSubscription(subscription);
      }
      break;
    }
    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      await upsertFromSubscription(event.data.object);
      break;
    }
    default:
      break;
  }

  return NextResponse.json({ received: true });
}
