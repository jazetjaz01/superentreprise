import Link from "next/link";
import { AnnonceRowActions } from "./annonce-row-actions";
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
import { getActivityDisplayLabel } from "@/lib/annonces/activities";
import { statusLabels, transactionTypes } from "@/lib/annonces/options";
import { createClient } from "@/lib/supabase/server";

const priceFormatter = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

export default async function DashboardAnnoncesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: annonces } = await supabase
    .from("annonces")
    .select("*")
    .eq("author_id", user!.id)
    .order("updated_at", { ascending: false });

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("status, max_annonces")
    .eq("user_id", user!.id)
    .maybeSingle();

  const isSubscriptionActive =
    subscription?.status === "active" || subscription?.status === "trialing";
  const effectiveMax = isSubscriptionActive ? (subscription?.max_annonces ?? 1) : 1;
  const activeAnnoncesCount = (annonces ?? []).filter(
    (annonce) => annonce.status !== "archivee",
  ).length;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="font-semibold text-xl">Mes annonces</h1>
        {activeAnnoncesCount < effectiveMax && (
          <Button
            render={<Link href="/deposer-une-annonce" />}
            nativeButton={false}
            className="rounded-full"
          >
            Déposer une annonce
          </Button>
        )}
      </div>

      {annonces && annonces.length > 0 && (
        <p className="text-muted-foreground text-sm">
          {effectiveMax === 1
            ? "Votre abonnement ne permet la diffusion que d'une seule annonce à la fois."
            : `Votre abonnement permet la diffusion de ${effectiveMax} annonces simultanées.`}
        </p>
      )}

      {!annonces || annonces.length === 0 ? (
        <p className="text-muted-foreground text-sm">
          Vous n&apos;avez pas encore d&apos;annonce.
        </p>
      ) : (
        <div className="min-w-0 overflow-hidden rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>N° annonce</TableHead>
                <TableHead>Titre</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Activité</TableHead>
                <TableHead>Type de transaction</TableHead>
                <TableHead>Ville</TableHead>
                <TableHead>Prix</TableHead>
                <TableHead>Créée le</TableHead>
                <TableHead>Modifiée le</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {annonces.map((annonce) => {
                const status = statusLabels[annonce.status ?? "brouillon"];
                const activityLabel = getActivityDisplayLabel(annonce.activity);
                const transactionTypeLabel = transactionTypes.find(
                  (item) => item.value === annonce.transaction_type,
                )?.label;

                return (
                  <TableRow key={annonce.id}>
                    <TableCell className="font-mono text-muted-foreground text-xs">
                      {annonce.id.slice(0, 8).toUpperCase()}
                    </TableCell>
                    <TableCell className="font-medium">
                      {annonce.title}
                    </TableCell>
                    <TableCell>
                      {status && (
                        <Badge variant={status.variant}>{status.label}</Badge>
                      )}
                    </TableCell>
                    <TableCell>{activityLabel ?? "—"}</TableCell>
                    <TableCell>{transactionTypeLabel ?? "—"}</TableCell>
                    <TableCell>{annonce.city ?? "—"}</TableCell>
                    <TableCell>
                      {annonce.price != null
                        ? priceFormatter.format(annonce.price)
                        : "—"}
                    </TableCell>
                    <TableCell>
                      {dateFormatter.format(new Date(annonce.created_at))}
                    </TableCell>
                    <TableCell>
                      {dateFormatter.format(new Date(annonce.updated_at))}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          render={<Link href={`/annonce/${annonce.id}`} />}
                          nativeButton={false}
                          variant="ghost"
                          size="sm"
                          className="rounded-full"
                        >
                          Voir
                        </Button>
                        <Button
                          render={<Link href={`/annonces/${annonce.id}/activite`} />}
                          nativeButton={false}
                          variant="outline"
                          size="sm"
                          className="rounded-full"
                        >
                          Modifier
                        </Button>
                        <AnnonceRowActions
                          annonceId={annonce.id}
                          status={annonce.status ?? "brouillon"}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
