import type { Metadata } from "next";
import { FeatureGrid } from "@/components/feature-grid";
import { ImageTextSection } from "@/components/image-text-section";
import { MethodTimeline } from "@/components/method-timeline";
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

      <MethodTimeline
        eyebrow="Notre méthode"
        title="Trois phases pour mener votre cession à bien"
        subtitle="Durée indicative : 12 à 24 mois pour une cession complète"
        phases={[
          {
            title: "Diagnostic & Stratégie",
            duration: "2 à 3 semaines",
            lead: "Comprendre votre entreprise et vos objectifs.",
            description:
              "Nous étudions vos comptes, votre marché et les atouts qui font la valeur de votre société. Nous échangeons aussi sur vos attentes personnelles et votre calendrier, afin de construire avec vous une stratégie de cession sur mesure.",
          },
          {
            title: "Préparation & Optimisation",
            duration: "6 à 12 mois",
            lead: "Renforcer la valeur avant la mise en vente.",
            description:
              "Nous repérons et corrigeons les points faibles : structure juridique, dépendance au dirigeant, documentation. Nous mettons en avant vos actifs immatériels (savoir-faire, portefeuille clients, notoriété) et constituons un dossier de présentation convaincant.",
          },
          {
            title: "Exécution & Closing",
            duration: "6 à 12 mois",
            lead: "Conduire la transaction jusqu’à la signature.",
            description:
              "Nous sollicitons des repreneurs qualifiés, organisons les rencontres, menons les négociations et coordonnons avocats, experts-comptables et banques. Vous restez concentré sur votre entreprise pendant que nous pilotons la cession.",
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
