import { Box, CircleCheck, Gem, type LucideIcon, Users } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface PricingPlan {
  name: string;
  description: string;
  price: number;
  billing: string;
  isRecommended: boolean;
  icon: LucideIcon;
  features: string[];
}

const pricingPlans: PricingPlan[] = [
  {
    name: "Essentiel",
    description: "Idéal pour publier votre première annonce.",
    price: 0,
    billing: "Gratuit",
    isRecommended: false,
    icon: Box,
    features: [
      "1 annonce active",
      "Jusqu'à 5 photos",
      "Visibilité 30 jours",
      "Support par email",
      "Accès à l'espace vendeur",
    ],
  },
  {
    name: "Professionnel",
    description: "Pour une visibilité maximale et une vente plus rapide.",
    price: 49,
    billing: "par annonce",
    isRecommended: true,
    icon: Gem,
    features: [
      "Annonces illimitées",
      "Photos illimitées",
      "Mise en avant dans les résultats",
      "Statistiques de consultation",
      "Support prioritaire",
    ],
  },
  {
    name: "Agence",
    description: "Pensé pour les mandataires et agences de cession.",
    price: 199,
    billing: "par mois",
    isRecommended: false,
    icon: Users,
    features: [
      "Tout Professionnel inclus",
      "Badge « Professionnel vérifié »",
      "Jusqu'à 5 utilisateurs",
      "Accompagnement dédié",
      "Mise en avant permanente",
    ],
  },
];

const Pricing = () => {
  return (
    <section className="mx-auto max-w-5xl px-6 py-20">
      <h2 className="text-center font-medium text-4xl tracking-[-0.04em] sm:text-[2.75rem]">
        Des forfaits adaptés à votre projet
      </h2>
      <p className="mt-3 text-center text-muted-foreground text-xl -tracking-[0.01em] md:text-2xl">
        Choisissez la formule qui correspond à votre besoin, sans engagement
        caché
      </p>

      <div className="mt-12 grid grid-cols-1 gap-y-8 shadow-xs/2 sm:grid-cols-2 md:mt-16 md:grid-cols-3">
        {pricingPlans.map((plan) => (
          <PlanCard key={plan.name} plan={plan} />
        ))}
      </div>
    </section>
  );
};

const PlanCard = ({ plan }: { plan: PricingPlan }) => {
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
          {plan.price > 0 ? `${plan.price} €` : "Gratuit"}
        </p>
        <p className="mt-1 text-muted-foreground text-sm tracking-normal">
          {plan.billing}
        </p>
        <Button
          className="my-6 w-full"
          size="lg"
          render={<Link href="/deposer-une-annonce" />}
          nativeButton={false}
        >
          Choisir ce forfait
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

export default Pricing;
