import { Building2, Rocket, Store, type LucideIcon, CircleCheck } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface ProPricingPlan {
  name: string;
  description: string;
  price: number;
  billing: string;
  isRecommended: boolean;
  icon: LucideIcon;
  features: string[];
}

const proPricingPlans: ProPricingPlan[] = [
  {
    name: "5 annonces",
    description: "Pour démarrer votre activité de mise en relation.",
    price: 49,
    billing: "HT / mois",
    isRecommended: false,
    icon: Store,
    features: [
      "5 annonces actives",
      "Jusqu'à 5 photos par annonce",
      "Messagerie interne avec les acheteurs",
      "Badge « Professionnel »",
      "Support par email",
    ],
  },
  {
    name: "10 annonces",
    description: "Pour les agences avec un portefeuille en croissance.",
    price: 99,
    billing: "HT / mois",
    isRecommended: true,
    icon: Rocket,
    features: [
      "10 annonces actives",
      "Jusqu'à 5 photos par annonce",
      "Messagerie interne avec les acheteurs",
      "Badge « Professionnel »",
      "Support prioritaire",
    ],
  },
  {
    name: "25 annonces",
    description: "Pour les cabinets et agences à fort volume.",
    price: 199,
    billing: "HT / mois",
    isRecommended: false,
    icon: Building2,
    features: [
      "25 annonces actives",
      "Jusqu'à 5 photos par annonce",
      "Messagerie interne avec les acheteurs",
      "Badge « Professionnel »",
      "Accompagnement dédié",
    ],
  },
];

const PricingPro = () => {
  return (
    <section className="mx-auto max-w-5xl px-6 py-20">
      <b className="block text-center font-medium text-muted-foreground text-sm uppercase tracking-wide">
        Agences et professionnels
      </b>
      <h2 className="mt-3 text-center font-medium text-4xl tracking-[-0.04em] sm:text-[2.75rem]">
        Des forfaits pensés pour votre volume d&apos;annonces
      </h2>
      <p className="mt-3 text-center text-muted-foreground text-xl -tracking-[0.01em] md:text-2xl">
        Diffusez plusieurs mandats en simultané, sans engagement de durée
      </p>

      <div className="mt-12 grid grid-cols-1 gap-y-8 shadow-xs/2 sm:grid-cols-2 md:mt-16 md:grid-cols-3">
        {proPricingPlans.map((plan) => (
          <ProPlanCard key={plan.name} plan={plan} />
        ))}
      </div>

      <p className="mt-10 text-center text-muted-foreground text-sm">
        Besoin d&apos;un volume supérieur à 25 annonces ?{" "}
        <Link className="font-medium text-primary underline" href="/contact">
          Contactez-nous
        </Link>
        .
      </p>
    </section>
  );
};

const ProPlanCard = ({ plan }: { plan: ProPricingPlan }) => {
  return (
    <div
      className={cn("border bg-card", {
        "relative border border-primary bg-card ring ring-primary ring-inset":
          plan.isRecommended,
      })}
    >
      {plan.isRecommended && (
        <Badge className="absolute top-0 right-0 rounded-none">
          Le plus populaire
        </Badge>
      )}
      <div
        className={cn("p-6", {
          "bg-linear-to-bl from-primary/15": plan.isRecommended,
        })}
      >
        <plan.icon className="mb-5 text-primary" />
        <div className="flex items-center gap-1">
          <h3 className="font-medium text-2xl tracking-tight">{plan.name}</h3>
        </div>
        <p className="my-2 text-muted-foreground">{plan.description}</p>
      </div>
      <Separator />
      <div className="px-6 pt-5 pb-10">
        <p className="mt-4 font-satoshi font-semibold text-4xl">
          {plan.price} €
        </p>
        <p className="mt-1 text-muted-foreground text-sm tracking-normal">
          {plan.billing}
        </p>
        <Button
          className="my-6 w-full"
          size="lg"
          render={<Link href="/contact" />}
          nativeButton={false}
        >
          Nous contacter
        </Button>
        <ul className="mt-4 space-y-2">
          {plan.features.map((feature) => (
            <li className="flex items-center gap-2" key={feature}>
              <CircleCheck className="size-4 shrink-0 text-primary" />
              {feature}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PricingPro;
