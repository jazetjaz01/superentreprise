import Link from "next/link";
import { AnnonceRowActions } from "./annonce-row-actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getActivityDisplayLabel } from "@/lib/annonces/activities";
import { statusLabels } from "@/lib/annonces/options";
import { createClient } from "@/lib/supabase/server";

const priceFormatter = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
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

  return (
    <div className="flex flex-col gap-6 ">
      <div className="flex items-center justify-between">
        <h1 className="font-semibold text-xl">Mes annonces</h1>
        <Button
          render={<Link href="/deposer-une-annonce" />}
          nativeButton={false}
          className="rounded-full"
        >
          Déposer une annonce
        </Button>
      </div>

      {!annonces || annonces.length === 0 ? (
        <p className="text-muted-foreground text-sm">
          Vous n&apos;avez pas encore d&apos;annonce.
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {annonces.map((annonce) => {
            const status = statusLabels[annonce.status ?? "brouillon"];
            const activityLabel = getActivityDisplayLabel(annonce.activity);

            return (
              <li
                key={annonce.id}
                className="flex items-center justify-between gap-4 rounded-lg border border-border p-4"
              >
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{annonce.title}</span>
                    {status && (
                      <Badge variant={status.variant}>{status.label}</Badge>
                    )}
                  </div>
                  <span className="text-muted-foreground text-sm">
                    {[
                      activityLabel,
                      annonce.price != null
                        ? priceFormatter.format(annonce.price)
                        : null,
                      annonce.city,
                    ]
                      .filter(Boolean)
                      .join(" · ") || "Informations incomplètes"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
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
                  <Button
                    render={<Link href="/dashboard/abonnement" />}
                    nativeButton={false}
                    variant="ghost"
                    size="sm"
                    className="rounded-full"
                  >
                    Abonnement
                  </Button>
                  <AnnonceRowActions
                    annonceId={annonce.id}
                    status={annonce.status ?? "brouillon"}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
