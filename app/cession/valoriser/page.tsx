import type { Metadata } from "next";
import { FeatureGrid } from "@/components/feature-grid";
import { HighlightPanel } from "@/components/highlight-panel";
import { PageBanner } from "@/components/page-banner";

export const metadata: Metadata = {
  title: "Valoriser votre entreprise",
  description:
    "Quelle est la valeur réelle de votre entreprise ? superentreprise vous accompagne dans l’évaluation de votre entreprise, première étape de tout projet de cession.",
};

export default function ValoriserPage() {
  return (
    <main>
      <PageBanner
        image="/carriere/carriere3.jpg"
        breadcrumb={[
          { label: "Accueil", href: "/" },
          { label: "Cession" },
          { label: "Valoriser" },
        ]}
        title="Valoriser votre entreprise"
        subtitle="Quelle est la valeur réelle de votre entreprise ?"
        cta={{ href: "/contact", label: "Demander une évaluation" }}
      >
        <p>
          Toute transmission commence par une évaluation juste. Connaître la
          valeur de votre entreprise vous permet de fixer un cap, de prendre les
          bonnes décisions et d’aborder les négociations avec assurance.
        </p>
      </PageBanner>

      <FeatureGrid
        eyebrow="Pourquoi évaluer votre entreprise ?"
        title="Les bénéfices d’une évaluation professionnelle"
        features={[
          {
            title: "Un prix juste dès le départ",
            description:
              "Surévaluée, votre entreprise fait fuir les repreneurs ; sous-évaluée, elle vous fait perdre de la valeur. Une évaluation rigoureuse vous donne un prix de référence réaliste pour lancer votre projet sereinement.",
          },
          {
            title: "Une crédibilité renforcée",
            description:
              "Face aux repreneurs, à leurs banquiers et à leurs conseils, un rapport d’évaluation documenté témoigne du sérieux de votre démarche et installe un climat de confiance dès les premiers échanges.",
          },
          {
            title: "Des arguments pour négocier",
            description:
              "Chaque élément de la valorisation s’appuie sur des méthodes reconnues. Lorsque le prix est discuté, vous défendez votre position avec des faits, et non avec une simple estimation.",
          },
          {
            title: "Des leviers d’amélioration",
            description:
              "L’évaluation révèle ce qui soutient la valeur de votre entreprise et ce qui la pénalise. Vous savez où agir avant la cession : organisation, structure juridique, actifs immatériels…",
          },
        ]}
      />

      <HighlightPanel title="Les pièges d’une estimation sans accompagnement">
        <p>
          Beaucoup de dirigeants s’appuient sur une règle entendue dans leur
          secteur, comme « une entreprise se vend un an de chiffre d’affaires »,
          ou sur un montant avancé rapidement par leur entourage.
        </p>
        <p>
          Ces raccourcis ignorent pourtant ce qui fait la singularité de votre
          entreprise. Avec un prix trop élevé, les échanges avec les repreneurs
          s’arrêtent vite ; avec un prix trop bas, c’est une partie de la valeur
          de votre travail qui disparaît.
        </p>
        <p>
          Une évaluation sérieuse prend en compte l’ensemble de votre activité :
          vos actifs corporels et immatériels, votre position sur le marché et
          vos perspectives de développement. Vous obtenez une fourchette de prix
          réaliste, que vous pouvez justifier face à n’importe quel
          interlocuteur.
        </p>
      </HighlightPanel>
    </main>
  );
}
