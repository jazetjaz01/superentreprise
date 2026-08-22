import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Guide du cédant | Superentreprise",
  description:
    "Les étapes clés pour préparer et réussir la cession de votre entreprise, commerce ou fonds de commerce.",
};

export default function GuideDuCedantPage() {
  return (
    <article className="mx-auto w-full max-w-(--breakpoint-lg) px-6 py-12">
      <h1 className="font-semibold text-3xl tracking-tight">
        Guide du cédant
      </h1>
      <p className="mt-2 text-muted-foreground text-lg">
        Les étapes clés pour préparer et réussir la cession de votre
        entreprise, commerce ou fonds de commerce.
      </p>

      <div className="mt-10 flex flex-col gap-10 text-base text-foreground/90 leading-relaxed">
        <section className="flex flex-col gap-3">
          <h2 className="font-semibold text-xl tracking-tight">
            1 – Préparer votre entreprise à la vente
          </h2>
          <p>
            Avant de diffuser une annonce, prenez le temps de rassembler les
            éléments qu&apos;un repreneur sérieux vous demandera : bilans des
            trois derniers exercices, chiffre d&apos;affaires, EBITDA, bail
            commercial, effectifs. Une entreprise dont les comptes sont clairs
            et à jour se vend plus vite et à un meilleur prix.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="font-semibold text-xl tracking-tight">
            2 – Estimer la valeur de votre entreprise
          </h2>
          <p>
            La valorisation dépend du secteur d&apos;activité, du chiffre
            d&apos;affaires, de la rentabilité, de l&apos;emplacement et du
            potentiel de développement. Un expert-comptable ou un
            évaluateur professionnel peut vous aider à fixer un prix réaliste,
            ni trop élevé (ce qui freine les repreneurs), ni trop bas.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="font-semibold text-xl tracking-tight">
            3 – Rédiger une annonce claire et complète
          </h2>
          <p>
            Une bonne annonce présente l&apos;activité, la localisation, le
            chiffre d&apos;affaires, l&apos;EBITDA, le loyer et le nombre de
            salariés, accompagnés de photos de qualité. Plus votre annonce est
            précise, plus vous attirerez des acheteurs réellement qualifiés et
            limiterez les sollicitations hors sujet.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="font-semibold text-xl tracking-tight">
            4 – Échanger avec les acheteurs en toute confidentialité
          </h2>
          <p>
            La messagerie interne de Superentreprise vous permet
            d&apos;échanger avec les acheteurs intéressés sans communiquer
            votre nom ou vos coordonnées tant que vous ne le souhaitez pas.
            Prenez le temps de qualifier chaque interlocuteur (motivation,
            capacité de financement) avant d&apos;aller plus loin.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="font-semibold text-xl tracking-tight">
            5 – Finaliser la transaction
          </h2>
          <p>
            Une fois un accord trouvé, la vente se formalise généralement par
            un compromis puis un acte de cession, avec l&apos;accompagnement
            d&apos;un avocat ou d&apos;un notaire. Ces professionnels
            sécurisent la transaction pour les deux parties (garanties de
            passif, clauses de non-concurrence, etc.).
          </p>
        </section>

        <section className="flex flex-col gap-3 rounded-lg border border-border bg-muted/50 p-5">
          <p>
            Prêt à diffuser votre annonce ?{" "}
            <Link
              href="/deposer-une-annonce"
              className="font-medium text-primary underline"
            >
              Déposez votre annonce
            </Link>{" "}
            en quelques minutes.
          </p>
        </section>
      </div>
    </article>
  );
}
