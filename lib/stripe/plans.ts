export type PlanKey = "career_pro" | "business_pro" | "recruiter_pro" | "entreprise_pro";

export type PlanOwnerType = "profile" | "company";

type PlanDefinition = {
  key: PlanKey;
  ownerType: PlanOwnerType;
  priceEnvVar: string;
};

export const PLANS: Record<PlanKey, PlanDefinition> = {
  career_pro: {
    key: "career_pro",
    ownerType: "profile",
    priceEnvVar: "STRIPE_PRICE_CAREER_PRO",
  },
  business_pro: {
    key: "business_pro",
    ownerType: "profile",
    priceEnvVar: "STRIPE_PRICE_BUSINESS_PRO",
  },
  recruiter_pro: {
    key: "recruiter_pro",
    ownerType: "profile",
    priceEnvVar: "STRIPE_PRICE_RECRUITER_PRO",
  },
  entreprise_pro: {
    key: "entreprise_pro",
    ownerType: "company",
    priceEnvVar: "STRIPE_PRICE_ENTREPRISE_PRO",
  },
};

export const isPlanKey = (value: string): value is PlanKey =>
  Object.prototype.hasOwnProperty.call(PLANS, value);

export const getPriceId = (plan: PlanKey): string => {
  const priceId = process.env[PLANS[plan].priceEnvVar];
  if (!priceId) {
    throw new Error(`Missing environment variable ${PLANS[plan].priceEnvVar}`);
  }
  return priceId;
};
