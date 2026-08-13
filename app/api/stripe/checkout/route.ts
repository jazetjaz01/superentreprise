import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(
      new URL("/login?next=/dashboard", request.url),
      303,
    );
  }

  const { data: annonce } = await supabase
    .from("annonces")
    .select("id")
    .eq("author_id", user.id)
    .maybeSingle();

  if (!annonce) {
    return NextResponse.redirect(
      new URL("/deposer-une-annonce", request.url),
      303,
    );
  }

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("stripe_customer_id")
    .eq("user_id", user.id)
    .maybeSingle();

  const { data: profile } = await supabase
    .from("profiles")
    .select("email")
    .eq("id", user.id)
    .single();

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: process.env.STRIPE_PRICE_ID!, quantity: 1 }],
    customer: subscription?.stripe_customer_id ?? undefined,
    customer_email: subscription?.stripe_customer_id
      ? undefined
      : (profile?.email ?? user.email),
    client_reference_id: user.id,
    metadata: { user_id: user.id, annonce_id: annonce.id },
    subscription_data: { metadata: { user_id: user.id, annonce_id: annonce.id } },
    success_url: new URL(
      "/dashboard/abonnement?success=1",
      request.url,
    ).toString(),
    cancel_url: new URL(
      "/dashboard/abonnement?canceled=1",
      request.url,
    ).toString(),
  });

  if (!session.url) {
    return NextResponse.redirect(
      new URL("/dashboard/abonnement?error=1", request.url),
      303,
    );
  }

  return NextResponse.redirect(session.url, 303);
}
