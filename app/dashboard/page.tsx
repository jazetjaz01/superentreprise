import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PRO_PLANS, type PlanId } from "@/lib/subscriptions/pro-plans";
import { createClient } from "@/lib/supabase/server";

const planLabels: Record<PlanId, string> = {
  standard: "30 € TTC / mois",
  decouverte: `${PRO_PLANS.decouverte.label} — 49 € HT / mois`,
  professionnel: `${PRO_PLANS.professionnel.label} — 99 € HT / mois`,
  expert: `${PRO_PLANS.expert.label} — 199 € HT / mois`,
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select(
      "first_name, last_name, phone, role, company_name, siret, vat_number, company_address, company_postal_code, company_city",
    )
    .eq("id", user!.id)
    .single();

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("status, annonce_id, plan, max_annonces")
    .eq("user_id", user!.id)
    .maybeSingle();

  const isActive =
    subscription?.status === "active" || subscription?.status === "trialing";
  const plan = (subscription?.plan as PlanId | undefined) ?? "standard";

  let annonceTitle: string | null = null;
  let publishedCount: number | null = null;
  if (isActive && plan === "standard" && subscription?.annonce_id) {
    const { data: annonce } = await supabase
      .from("annonces")
      .select("title")
      .eq("id", subscription.annonce_id)
      .maybeSingle();
    annonceTitle = annonce?.title ?? null;
  } else if (isActive && plan !== "standard") {
    const { count } = await supabase
      .from("annonces")
      .select("*", { count: "exact", head: true })
      .eq("author_id", user!.id)
      .eq("status", "publiee");
    publishedCount = count ?? 0;
  }

  const name = profile?.first_name || "et bienvenue";

  const isBuyer = profile?.role === "acheteur";
  const isSeller = !isBuyer;
  const isProfileIncomplete =
    isBuyer && (!profile?.first_name || !profile?.last_name || !profile?.phone);

  const isSellerProfileIncomplete =
    isSeller && (!profile?.first_name || !profile?.last_name || !profile?.phone);
  const isCompanyProfileIncomplete =
    isSeller &&
    (!profile?.company_name ||
      !profile?.siret ||
      !profile?.vat_number ||
      !profile?.company_address ||
      !profile?.company_postal_code ||
      !profile?.company_city);

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-2">
      <h1 className="font-semibold text-xl">Bonjour {name}</h1>
      <p className="text-muted-foreground text-sm">
        {profile?.role === "acheteur"
          ? "Retrouvez ici votre profil. Parcourez les annonces pour trouver l'entreprise qui vous correspond."
          : "Retrouvez ici la gestion de vos annonces, de votre abonnement et de votre profil. Pour pouvoir diffuser une annonce, il convient de souscrire à un abonnement mensuel à notre plateforme. Cet abonnement peut être résilié sans préavis et sans justification via notre plateforme."}
      </p>

      {isProfileIncomplete && (
        <div className="mt-4 flex items-center justify-between gap-4 rounded-lg border border-border bg-muted/50 p-4 text-sm">
          <span>
            Complétez votre profil (nom, prénom, téléphone) pour que les
            vendeurs puissent vous recontacter facilement.
          </span>
          <Button
            render={<Link href="/dashboard/profil" />}
            nativeButton={false}
            size="sm"
            variant="outline"
            className="shrink-0 rounded-full"
          >
            Compléter
          </Button>
        </div>
      )}

      {isSellerProfileIncomplete && (
        <div className="mt-4 flex items-center justify-between gap-4 rounded-lg border border-border bg-muted/50 p-4 text-sm">
          <span>
            Complétez votre profil (nom, prénom, téléphone) avant de
            diffuser une annonce.
          </span>
          <Button
            render={<Link href="/dashboard/profil" />}
            nativeButton={false}
            size="sm"
            variant="outline"
            className="shrink-0 rounded-full"
          >
            Compléter
          </Button>
        </div>
      )}

      {isCompanyProfileIncomplete && (
        <div className="mt-4 flex items-center justify-between gap-4 rounded-lg border border-border bg-muted/50 p-4 text-sm">
          <span>
            Complétez votre profil société pour pouvoir émettre les
            factures d&apos;abonnement.
          </span>
          <Button
            render={<Link href="/dashboard/profil/societe" />}
            nativeButton={false}
            size="sm"
            variant="outline"
            className="shrink-0 rounded-full"
          >
            Compléter
          </Button>
        </div>
      )}

      {isSeller && !isActive && (
        <div className="mt-4 flex flex-col gap-3 rounded-lg border border-border bg-muted/50 p-4 text-sm">
          <div className="flex items-center justify-between gap-4">
            <span>Souscrivez un abonnement pour diffuser votre annonce.</span>
            <form action="/api/stripe/checkout" method="POST" className="shrink-0">
              <Button type="submit" size="sm" className="rounded-full">
                S&apos;abonner — {planLabels.standard}
              </Button>
            </form>
          </div>
          <p className="text-muted-foreground text-xs">
            Vous êtes une agence ou un professionnel ?{" "}
            <Link
              href="/forfaitspro"
              className="font-medium text-foreground underline"
            >
              Découvrez nos forfaits pour plusieurs annonces
            </Link>
            .
          </p>
        </div>
      )}

      {isActive && (
        <div className="mt-4 flex items-center gap-2 rounded-lg border border-border bg-muted/50 p-4 text-sm">
          <CheckCircle2 className="size-5 shrink-0" />
          <span>
            Votre abonnement ({planLabels[plan]}) est actif
            {annonceTitle && (
              <>
                {" "}
                — annonce diffusée :{" "}
                <span className="font-medium text-foreground">
                  {annonceTitle}
                </span>
              </>
            )}
            {publishedCount != null && (
              <>
                {" "}
                —{" "}
                <Link
                  href="/dashboard/annonces"
                  className="font-medium text-foreground underline"
                >
                  {publishedCount} / {subscription?.max_annonces ?? 0} annonces
                  publiées
                </Link>
              </>
            )}
            .
          </span>
        </div>
      )}
    </div>
  );
}
