import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(
      new URL("/login?next=/dashboard/abonnement", request.url),
      303,
    );
  }

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("stripe_customer_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!subscription?.stripe_customer_id) {
    return NextResponse.redirect(
      new URL("/dashboard/abonnement", request.url),
      303,
    );
  }

  const session = await getStripe().billingPortal.sessions.create({
    customer: subscription.stripe_customer_id,
    return_url: new URL("/dashboard/abonnement", request.url).toString(),
  });

  return NextResponse.redirect(session.url, 303);
}
