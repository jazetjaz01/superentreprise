import { CheckCircle2, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";

const statusLabels: Record<string, { label: string; variant: "default" | "secondary" | "outline" }> = {
  active: { label: "Actif", variant: "default" },
  trialing: { label: "Essai", variant: "default" },
  past_due: { label: "Paiement en retard", variant: "outline" },
  unpaid: { label: "Impayé", variant: "outline" },
  canceled: { label: "Résilié", variant: "secondary" },
  incomplete: { label: "Incomplet", variant: "secondary" },
  incomplete_expired: { label: "Expiré", variant: "secondary" },
};

const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export default async function AbonnementPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; canceled?: string; error?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", user!.id)
    .maybeSingle();

  const { data: annonce } = await supabase
    .from("annonces")
    .select("id, title")
    .eq("author_id", user!.id)
    .maybeSingle();

  const isActive =
    subscription?.status === "active" || subscription?.status === "trialing";
  const status = subscription ? statusLabels[subscription.status] : null;

  return (
    <div className="flex max-w-lg flex-col gap-6">
      <h1 className="font-semibold text-xl">Mon abonnement</h1>

      {params.success && (
        <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/50 p-4 text-sm">
          <CheckCircle2 className="size-5 shrink-0" />
          <span>Paiement confirmé, votre abonnement est en cours d&apos;activation.</span>
        </div>
      )}
      {params.canceled && (
        <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/50 p-4 text-sm">
          <XCircle className="size-5 shrink-0" />
          <span>Paiement annulé.</span>
        </div>
      )}

      <div className="flex flex-col gap-4 rounded-lg border border-border p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Diffusion d&apos;une annonce</p>
            <p className="text-muted-foreground text-sm">30 € TTC / mois</p>
          </div>
          {status && <Badge variant={status.variant}>{status.label}</Badge>}
        </div>

        {subscription?.current_period_end && (
          <p className="text-muted-foreground text-sm">
            {isActive ? "Renouvellement" : "Fin de période"} le{" "}
            {dateFormatter.format(new Date(subscription.current_period_end))}
          </p>
        )}

        {annonce && (
          <p className="text-muted-foreground text-sm">
            Annonce diffusée : <span className="font-medium text-foreground">{annonce.title}</span>
          </p>
        )}

        {isActive ? (
          <p className="text-muted-foreground text-sm">
            Votre annonce est diffusée. Vous pouvez la modifier librement tant que votre abonnement est actif.
          </p>
        ) : !annonce ? (
          <p className="text-muted-foreground text-sm">
            Créez d&apos;abord votre annonce pour pouvoir vous abonner.
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
