export type PlanId = "standard" | "decouverte" | "professionnel" | "expert";

export const PRO_PLANS: Record<
  Exclude<PlanId, "standard">,
  { label: string; priceEnvVar: string; maxAnnonces: number }
> = {
  decouverte: {
    label: "Découverte",
    priceEnvVar: "STRIPE_PRICE_ID_PRO_DECOUVERTE",
    maxAnnonces: 5,
  },
  professionnel: {
    label: "Professionnel",
    priceEnvVar: "STRIPE_PRICE_ID_PRO_PROFESSIONNEL",
    maxAnnonces: 10,
  },
  expert: {
    label: "Expert",
    priceEnvVar: "STRIPE_PRICE_ID_PRO_EXPERT",
    maxAnnonces: 25,
  },
};

export function resolvePlan(planParam: string | null | undefined) {
  if (planParam && planParam in PRO_PLANS) {
    const plan = PRO_PLANS[planParam as keyof typeof PRO_PLANS];
    return {
      plan: planParam as PlanId,
      maxAnnonces: plan.maxAnnonces,
      priceId: process.env[plan.priceEnvVar]!,
    };
  }

  return {
    plan: "standard" as PlanId,
    maxAnnonces: 1,
    priceId: process.env.STRIPE_PRICE_ID!,
  };
}
