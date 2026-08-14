import { CircleCheck, MessageCircle, Images, Megaphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";

const features = [
  { label: "Diffusion d'une annonce sur Superentreprise.com", icon: Megaphone },
  { label: "Upload jusqu'à 5 photos par annonce", icon: Images },
  { label: "Messagerie interne avec les acheteurs intéressés", icon: MessageCircle },
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
    <div className="flex max-w-xl flex-col gap-6">
      <h1 className="font-semibold text-xl">Offre abonnement</h1>

      <div className="flex flex-col gap-5 rounded-lg border border-border p-6">
        <div>
          <h2 className="font-medium text-lg">Diffusion d&apos;une annonce</h2>
          <p className="text-muted-foreground text-sm">
            Un abonnement, une annonce, sans engagement.
          </p>
        </div>

        <p className="font-semibold text-3xl">
          30 € TTC<span className="font-normal text-base text-muted-foreground"> / mois</span>
        </p>

        <ul className="flex flex-col gap-3">
          {features.map((feature) => (
            <li key={feature.label} className="flex items-center gap-3 text-sm">
              <CircleCheck className="size-5 shrink-0 text-primary" />
              <span>{feature.label}</span>
            </li>
          ))}
        </ul>

        {isActive ? (
          <p className="rounded-lg bg-muted/50 p-3 text-center text-sm">
            Votre abonnement est actif.
          </p>
        ) : (
          <form action="/api/stripe/checkout" method="POST">
            <Button type="submit" className="w-full rounded-full">
              S&apos;abonner — 30 € TTC / mois
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
