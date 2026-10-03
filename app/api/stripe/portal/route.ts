import { NextResponse, type NextRequest } from "next/server";

import { getStripe } from "@/lib/stripe/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const companyIdValue = formData.get("companyId");
  const origin = new URL(request.url).origin;

  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  const claims = claimsData?.claims;
  if (!claims) {
    return NextResponse.redirect(`${origin}/auth/login`, 303);
  }

  const service = createServiceClient();
  let ownerTable: "profiles" | "companies" = "profiles";
  let ownerId = claims.sub;

  const companyId = typeof companyIdValue === "string" ? companyIdValue : null;
  if (companyId) {
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

  if (!ownerRow?.stripe_customer_id) {
    return NextResponse.redirect(`${origin}/pricing`, 303);
  }

  const stripe = getStripe();
  const portalSession = await stripe.billingPortal.sessions.create({
    customer: ownerRow.stripe_customer_id,
    return_url: `${origin}/pricing`,
  });

  return NextResponse.redirect(portalSession.url, 303);
}
