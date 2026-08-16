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
      new URL("/login?next=/dashboard", request.url),
      303,
    );
  }

  const { data: annonce } = await supabase
    .from("annonces")
    .select("id")
    .eq("author_id", user.id)
    .maybeSingle();

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("stripe_customer_id")
    .eq("user_id", user.id)
    .maybeSingle();

  const { data: profile } = await supabase
    .from("profiles")
    .select(
      "email, phone, company_name, siret, vat_number, company_address, company_postal_code, company_city",
    )
    .eq("id", user.id)
    .single();

  if (!profile?.phone) {
    return NextResponse.redirect(
      new URL("/dashboard/profil?billing=required", request.url),
      303,
    );
  }

  if (
    !profile.company_name ||
    !profile.siret ||
    !profile.vat_number ||
    !profile.company_address ||
    !profile.company_postal_code ||
    !profile.company_city
  ) {
    return NextResponse.redirect(
      new URL("/dashboard/profil/societe?billing=required", request.url),
      303,
    );
  }

  const stripe = getStripe();
  const customerParams = {
    name: profile.company_name,
    email: profile.email,
    address: {
      line1: profile.company_address,
      postal_code: profile.company_postal_code,
      city: profile.company_city,
      country: "FR",
    },
    metadata: { siret: profile.siret },
  };

  const customerId = subscription?.stripe_customer_id
    ? (await stripe.customers.update(
        subscription.stripe_customer_id,
        customerParams,
      )).id
    : (await stripe.customers.create(customerParams)).id;

  try {
    await stripe.customers.createTaxId(customerId, {
      type: "eu_vat",
      value: profile.vat_number,
    });
  } catch {
    // Le numéro de TVA existe déjà ou n'est pas valide pour l'API Stripe :
    // ce n'est pas bloquant, la facture reste émise au nom de la société.
  }

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: process.env.STRIPE_PRICE_ID!, quantity: 1 }],
    customer: customerId,
    client_reference_id: user.id,
    metadata: { user_id: user.id, annonce_id: annonce?.id ?? "" },
    subscription_data: {
      metadata: { user_id: user.id, annonce_id: annonce?.id ?? "" },
      default_tax_rates: [process.env.STRIPE_TAX_RATE_ID!],
    },
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
