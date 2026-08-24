import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import SetupGuide, { type SetupGuideStep } from "@/components/setup-guide";
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
      "first_name, last_name, phone, role, is_professional, company_name, siret, vat_number, company_address, company_postal_code, company_city",
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

  const isProfileComplete = !!(
    profile?.first_name &&
    profile?.last_name &&
    profile?.phone
  );
  const isCompanyProfileComplete = !!(
    profile?.company_name &&
    profile?.siret &&
    profile?.vat_number &&
    profile?.company_address &&
    profile?.company_postal_code &&
    profile?.company_city
  );

  let steps: SetupGuideStep[] = [];

  if (isSeller) {
    const { count: annonceCount } = await supabase
      .from("annonces")
      .select("*", { count: "exact", head: true })
      .eq("author_id", user!.id);

    steps = [
      {
        title: "Compléter votre profil",
        description: "Renseignez votre nom, prénom et téléphone.",
        status: isProfileComplete ? "completed" : "pending",
        href: "/dashboard/profil",
      },
      {
        title: "Compléter votre profil société",
        description: "Nécessaire pour émettre les factures d'abonnement.",
        status: isCompanyProfileComplete ? "completed" : "pending",
        href: "/dashboard/profil/societe",
      },
      {
        title: "Souscrire à un abonnement",
        description: "Indispensable pour pouvoir diffuser une annonce.",
        status: isActive ? "completed" : "pending",
        href: profile?.is_professional
          ? "/dashboard/abonnement/offre-pro"
          : "/dashboard/abonnement/offre",
      },
      {
        title: "Déposer votre première annonce",
        description: "Décrivez votre entreprise ou votre commerce à céder.",
        status: (annonceCount ?? 0) > 0 ? "completed" : "pending",
        href: "/deposer-une-annonce",
      },
    ];
  } else {
    const [{ count: favorisCount }, { count: conversationsCount }] =
      await Promise.all([
        supabase
          .from("favoris")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user!.id),
        supabase
          .from("conversations")
          .select("*", { count: "exact", head: true })
          .eq("buyer_id", user!.id),
      ]);

    steps = [
      {
        title: "Compléter votre profil",
        description: "Renseignez votre nom, prénom et téléphone.",
        status: isProfileComplete ? "completed" : "pending",
        href: "/dashboard/profil",
      },
      {
        title: "Ajouter une annonce à vos favoris",
        description: "Enregistrez les entreprises qui vous intéressent.",
        status: (favorisCount ?? 0) > 0 ? "completed" : "pending",
        href: "/annonces",
        cta: "Parcourir",
      },
      {
        title: "Contacter un vendeur",
        description: "Échangez directement via la messagerie interne.",
        status: (conversationsCount ?? 0) > 0 ? "completed" : "pending",
        href: "/annonces",
        cta: "Parcourir",
      },
    ];
  }

  const allStepsCompleted = steps.every((step) => step.status === "completed");

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-2">
      <h1 className="font-semibold text-xl">Bonjour {name}</h1>
      <p className="text-muted-foreground text-sm">
        {profile?.role === "acheteur"
          ? "Retrouvez ici votre profil. Parcourez les annonces pour trouver l'entreprise qui vous correspond."
          : "Retrouvez ici la gestion de vos annonces, de votre abonnement et de votre profil. Pour pouvoir diffuser une annonce, il convient de souscrire à un abonnement mensuel à notre plateforme. Cet abonnement peut être résilié sans préavis et sans justification via notre plateforme."}
      </p>

      {!allStepsCompleted && (
        <SetupGuide
          title="Finalisez la configuration de votre compte"
          description="Quelques étapes pour profiter pleinement de Superentreprise."
          steps={steps}
        />
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
