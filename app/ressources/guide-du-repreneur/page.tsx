import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Guide du repreneur | Superentreprise",
  description:
    "Les étapes clés pour trouver et reprendre une entreprise, un commerce ou un fonds de commerce.",
};

export default function GuideDuRepreneurPage() {
  return (
    <article className="mx-auto w-full max-w-(--breakpoint-lg) px-6 py-12">
      <h1 className="font-semibold text-3xl tracking-tight">
        Guide du repreneur
      </h1>
      <p className="mt-2 text-muted-foreground text-lg">
        Les étapes clés pour trouver et reprendre une entreprise, un commerce
        ou un fonds de commerce.
      </p>

      <div className="mt-10 flex flex-col gap-10 text-base text-foreground/90 leading-relaxed">
        <section className="flex flex-col gap-3">
          <h2 className="font-semibold text-xl tracking-tight">
            1 – Définir votre projet de reprise
          </h2>
          <p>
            Avant de chercher, précisez votre secteur d&apos;activité, votre
            zone géographique, votre budget et le niveau d&apos;implication
            souhaité. Un projet bien défini vous permettra de cibler
            efficacement les annonces pertinentes et de gagner du temps.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="font-semibold text-xl tracking-tight">
            2 – Parcourir les annonces
          </h2>
          <p>
            Utilisez les filtres par région et par activité pour identifier
            les entreprises correspondant à vos critères, et enregistrez vos
            favoris pour comparer facilement plusieurs opportunités avant de
            contacter les vendeurs.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="font-semibold text-xl tracking-tight">
            3 – Analyser les informations financières
          </h2>
          <p>
            Chiffre d&apos;affaires, EBITDA, loyer, effectifs : ces indicateurs
            vous donnent une première idée de la rentabilité et du prix
            demandé. N&apos;hésitez pas à demander des documents
            complémentaires (bilans, contrats) une fois un premier contact
            établi.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="font-semibold text-xl tracking-tight">
            4 – Contacter le vendeur
          </h2>
          <p>
            La messagerie interne vous permet d&apos;échanger directement et
            en toute confidentialité avec le cédant. Préparez vos questions
            (motif de la vente, historique, clientèle, concurrence) pour
            évaluer rapidement si l&apos;opportunité correspond à votre
            projet.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="font-semibold text-xl tracking-tight">
            5 – Financer votre reprise
          </h2>
          <p>
            Apport personnel, prêt bancaire, crédit vendeur ou aides
            publiques : plusieurs solutions existent pour financer une
            reprise. Consultez notre{" "}
            <Link
              href="/ressources/financement"
              className="font-medium text-primary underline"
            >
              guide du financement
            </Link>{" "}
            pour en savoir plus.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="font-semibold text-xl tracking-tight">
            6 – Sécuriser la transaction
          </h2>
          <p>
            Avant de signer, faites réaliser un audit (comptable, juridique,
            social) et faites-vous accompagner par un avocat ou un notaire
            pour la rédaction du compromis puis de l&apos;acte de cession.
          </p>
        </section>

        <section className="flex flex-col gap-3 rounded-lg border border-border bg-muted/50 p-5">
          <p>
            Prêt à démarrer votre recherche ?{" "}
            <Link
              href="/annonces"
              className="font-medium text-primary underline"
            >
              Parcourez les annonces
            </Link>{" "}
            disponibles dès maintenant.
          </p>
        </section>
      </div>
    </article>
  );
}
