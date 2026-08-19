import { Images, MessageCircle, Megaphone } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/server";

const features = [
  {
    icon: Megaphone,
    title: "Diffusion de votre annonce",
    description: "Votre annonce visible sur Superentreprise.com, sans engagement.",
  },
  {
    icon: Images,
    title: "Jusqu'à 5 photos",
    description: "Présentez votre commerce ou votre entreprise en images.",
  },
  {
    icon: MessageCircle,
    title: "Messagerie interne",
    description: "Échangez directement avec les acheteurs intéressés.",
  },
];

export default async function OffreAbonnementPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("status")
    .eq("user_id", user!.id)
    .maybeSingle();

  const isActive =
    subscription?.status === "active" || subscription?.status === "trialing";

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 text-center">
      <div>
        <strong className="font-medium text-muted-foreground text-sm uppercase tracking-wide">
          Diffusion d&apos;une annonce
        </strong>
        <h1 className="mt-2 font-medium text-3xl tracking-[-0.02em]">
          Tout ce qu&apos;il faut pour vendre votre entreprise
        </h1>
        <p className="mt-3 font-semibold text-2xl">
          30 € TTC<span className="font-normal text-base text-muted-foreground"> / mois</span>
        </p>
      </div>

      <div className="grid grid-cols-1 border sm:grid-cols-3">
        {features.map((feature, index) => (
          <div
            key={feature.title}
            className={cn(
              "flex flex-col items-center gap-2 border-t p-6 pt-9 first:border-t-0 sm:border-t-0 sm:first:border-s-0",
              index > 0 && "sm:border-s",
            )}
          >
            <feature.icon className="size-10 stroke-[1.5px] text-foreground" />
            <h3 className="mt-4 font-medium text-lg tracking-[-0.005em]">
              {feature.title}
            </h3>
            <p className="text-balance text-muted-foreground text-sm">
              {feature.description}
            </p>
          </div>
        ))}
      </div>

      {isActive ? (
        <p className="rounded-lg bg-muted/50 p-3 text-sm">
          Votre abonnement est actif.
        </p>
      ) : (
        <form action="/api/stripe/checkout" method="POST">
          <Button type="submit" className="w-full rounded-full">
            S&apos;abonner — 30 € TTC / mois
          </Button>
        </form>
      )}

      <p className="text-muted-foreground text-sm">
        Besoin de diffuser plusieurs annonces ?{" "}
        <Link
          className="font-medium text-primary underline"
          href="/forfaitspro"
        >
          Découvrez nos forfaits professionnels
        </Link>
        .
      </p>
    </div>
  );
}
