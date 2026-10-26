import type { Metadata } from "next";
import { FeatureGrid } from "@/components/feature-grid";
import { ImageTextSection } from "@/components/image-text-section";
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

      <ImageTextSection
        eyebrow="Les pièges à éviter"
        title="Une estimation sans accompagnement coûte cher"
        image="/carriere/carriere3.jpg"
        cta={{ href: "/contact", label: "Demander une évaluation" }}
      >
        <p>
          Règle de secteur, chiffre avancé par l’entourage : ces raccourcis
          ignorent ce qui fait la singularité de votre entreprise. Trop élevé, le
          prix fait fuir les repreneurs ; trop bas, il vous fait perdre de la
          valeur.
        </p>
        <p>
          Une évaluation complète tient compte de vos actifs, de votre marché et
          de vos perspectives, pour une fourchette de prix réaliste et
          défendable.
        </p>
      </ImageTextSection>
    </main>
  );
}
