import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";

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
    .select("status, annonce_id")
    .eq("user_id", user!.id)
    .maybeSingle();

  const isActive =
    subscription?.status === "active" || subscription?.status === "trialing";

  let annonceTitle: string | null = null;
  if (isActive && subscription?.annonce_id) {
    const { data: annonce } = await supabase
      .from("annonces")
      .select("title")
      .eq("id", subscription.annonce_id)
      .maybeSingle();
    annonceTitle = annonce?.title ?? null;
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
    <div className="flex max-w-2xl flex-col gap-2">
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

      {isActive && (
        <div className="mt-4 flex items-center gap-2 rounded-lg border border-border bg-muted/50 p-4 text-sm">
          <CheckCircle2 className="size-5 shrink-0" />
          <span>
            Votre abonnement est actif
            {annonceTitle && (
              <>
                {" "}
                — annonce diffusée :{" "}
                <span className="font-medium text-foreground">
                  {annonceTitle}
                </span>
              </>
            )}
            .
          </span>
        </div>
      )}
    </div>
  );
}
