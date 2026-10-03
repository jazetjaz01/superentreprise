import { NextResponse, type NextRequest } from "next/server";

import { getPriceId, isPlanKey, PLANS } from "@/lib/stripe/plans";
import { getStripe } from "@/lib/stripe/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const planValue = formData.get("plan");
  const companyIdValue = formData.get("companyId");
  const origin = new URL(request.url).origin;

  if (typeof planValue !== "string" || !isPlanKey(planValue)) {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }
  const plan = PLANS[planValue];

  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  const claims = claimsData?.claims;
  if (!claims) {
    return NextResponse.redirect(`${origin}/auth/login`, 303);
  }

  const service = createServiceClient();
  let ownerTable: "profiles" | "companies";
  let ownerId: string;

  if (plan.ownerType === "profile") {
    ownerTable = "profiles";
    ownerId = claims.sub;
  } else {
    const companyId = typeof companyIdValue === "string" ? companyIdValue : null;
    if (!companyId) {
      return NextResponse.json({ error: "Missing companyId" }, { status: 400 });
    }
    const { data: adminRow } = await supabase
      .from("company_admins")
      .select("admin_id")
      .eq("company_id", companyId)
      .eq("admin_id", claims.sub)
      .maybeSingle();
    if (!adminRow) {
      return NextResponse.json({ error: "Not authorized for this company" }, { status: 403 });
    }
    ownerTable = "companies";
    ownerId = companyId;
  }

  const { data: ownerRow } = await service
    .from(ownerTable)
    .select("stripe_customer_id")
    .eq("id", ownerId)
    .maybeSingle<{ stripe_customer_id: string | null }>();

  const stripe = getStripe();
  let customerId = ownerRow?.stripe_customer_id ?? null;

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: claims.email,
      metadata: { ownerTable, ownerId },
    });
    customerId = customer.id;
    await service.from(ownerTable).update({ stripe_customer_id: customerId }).eq("id", ownerId);
  }

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    line_items: [{ price: getPriceId(plan.key), quantity: 1 }],
    success_url: `${origin}/pricing?checkout=success`,
    cancel_url: `${origin}/pricing?checkout=cancelled`,
    client_reference_id: ownerId,
    subscription_data: {
      metadata: { plan: plan.key, ownerTable, ownerId },
    },
    metadata: { plan: plan.key, ownerTable, ownerId },
  });

  if (!session.url) {
    return NextResponse.json({ error: "Could not create checkout session" }, { status: 500 });
  }

  return NextResponse.redirect(session.url, 303);
}
