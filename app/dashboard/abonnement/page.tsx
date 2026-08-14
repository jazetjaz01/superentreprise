import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import Link from "next/link";
import { resumeSubscription } from "./actions";
import { CancelSubscriptionButton } from "./cancel-subscription-button";
import { SubscriptionStatusPoller } from "./subscription-status-poller";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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

  const renewalLabel = subscription?.cancel_at_period_end
    ? "Fin de l'abonnement"
    : isActive
      ? "Renouvellement"
      : "Fin de période";

  return (
    <div className="flex max-w-3xl flex-col gap-6">
      <h1 className="font-semibold text-xl">Mon abonnement</h1>

      {params.success && !isActive && (
        <>
          <SubscriptionStatusPoller userId={user!.id} isActive={isActive} />
          <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/50 p-4 text-sm">
            <Loader2 className="size-5 shrink-0 animate-spin" />
            <span>Paiement confirmé, activation de votre abonnement en cours...</span>
          </div>
        </>
      )}
      {params.success && isActive && (
        <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/50 p-4 text-sm">
          <CheckCircle2 className="size-5 shrink-0" />
          <span>Votre abonnement est actif.</span>
        </div>
      )}
      {params.canceled && (
        <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/50 p-4 text-sm">
          <XCircle className="size-5 shrink-0" />
          <span>Paiement annulé.</span>
        </div>
      )}

      <div className="min-w-0 overflow-hidden rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Formule</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>{renewalLabel}</TableHead>
              <TableHead>Annonce diffusée</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Diffusion d&apos;une annonce — 30 € TTC / mois</TableCell>
              <TableCell>
                {status ? (
                  <Badge variant={status.variant}>{status.label}</Badge>
                ) : (
                  "—"
                )}
              </TableCell>
              <TableCell>
                {subscription?.current_period_end
                  ? dateFormatter.format(new Date(subscription.current_period_end))
                  : "—"}
              </TableCell>
              <TableCell>{annonce ? annonce.title : "—"}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      {subscription?.stripe_customer_id && (
        <div className="flex gap-2">
          <form action="/api/stripe/portal" method="POST" className="flex-1">
            <Button type="submit" variant="outline" className="w-full rounded-full">
              Voir mes factures
            </Button>
          </form>
          <form action="/api/stripe/portal" method="POST" className="flex-1">
            <input type="hidden" name="flow" value="payment_method_update" />
            <Button type="submit" variant="outline" className="w-full rounded-full">
              Mettre à jour moyens de paiement
            </Button>
          </form>
        </div>
      )}

      {isActive && subscription?.cancel_at_period_end && (
        <div className="flex flex-col gap-2 rounded-lg border border-border bg-muted/50 p-4 text-sm">
          <p>
            Votre abonnement prendra fin le{" "}
            {dateFormatter.format(new Date(subscription.current_period_end!))}.
            Votre annonce sera alors dépubliée.
          </p>
          <form action={resumeSubscription}>
            <Button
              type="submit"
              variant="outline"
              className="w-full rounded-full"
            >
              Annuler la résiliation
            </Button>
          </form>
        </div>
      )}

      {isActive && !subscription?.cancel_at_period_end && (
        <div className="flex flex-col gap-2">
          {!annonce && (
            <Button
              render={<Link href="/deposer-une-annonce" />}
              nativeButton={false}
              className="w-full rounded-full"
            >
              Créer mon annonce
            </Button>
          )}
          <CancelSubscriptionButton />
        </div>
      )}

      {!isActive && (
        <form action="/api/stripe/checkout" method="POST">
          <Button type="submit" className="w-full rounded-full">
            S&apos;abonner — 30 € TTC / mois
          </Button>
        </form>
      )}
    </div>
  );
}
