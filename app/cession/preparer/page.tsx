import type { Metadata } from "next";
import { FeatureGrid } from "@/components/feature-grid";
import { ImageTextSection } from "@/components/image-text-section";
import { MethodTimeline } from "@/components/method-timeline";
import { PageBanner } from "@/components/page-banner";

export const metadata: Metadata = {
  title: "Préparer la cession de votre entreprise",
  description:
    "Anticiper la cession de votre entreprise pour en renforcer la valeur et sécuriser la vente : diagnostic, actions correctives, dossier de cession. superentreprise vous accompagne.",
};

export default function PreparerPage() {
  return (
    <main>
      <PageBanner
        image="/home/ladefense.jpg"
        breadcrumb={[
          { label: "Accueil", href: "/" },
          { label: "Cession" },
          { label: "Préparer" },
        ]}
        title="Préparer la cession de votre entreprise"
        subtitle="Comment aborder votre future cession dans les meilleures conditions ?"
        cta={{ href: "/contact", label: "Échanger avec un conseiller" }}
      >
        <p>
          Une cession se prépare plusieurs années à l’avance. Ce temps vous
          permet de structurer votre entreprise, de corriger ses fragilités et de
          mettre en lumière ses atouts, pour la présenter aux repreneurs sous son
          meilleur jour.
        </p>
      </PageBanner>

      <FeatureGrid
        eyebrow="Pourquoi anticiper ?"
        title="Ce que change une préparation en amont"
        features={[
          {
            title: "Une valeur renforcée",
            description:
              "Les années qui précèdent la vente permettent de lever ce qui pèse sur le prix : une structure juridique inadaptée, des actifs immatériels peu mis en valeur ou une organisation trop centrée sur le dirigeant.",
          },
          {
            title: "Des risques maîtrisés",
            description:
              "Une documentation lacunaire ou une mauvaise surprise lors des vérifications du repreneur suffisent à faire échouer une cession. En anticipant, vous traitez ces sujets avant qu’ils ne deviennent des obstacles.",
          },
          {
            title: "Une négociation plus sereine",
            description:
              "Dossier complet, processus formalisés, risques identifiés : vous arrivez à la table des négociations avec des réponses, ce qui limite les discussions sans fin et les demandes de baisse de prix.",
          },
          {
            title: "Le choix du bon moment",
            description:
              "Préparé, vous décidez du calendrier : vous attendez le bon repreneur et les bonnes conditions, au lieu de vendre dans l’urgence sous la pression d’un imprévu personnel ou d’un marché qui se retourne.",
          },
        ]}
      />

      <ImageTextSection
        eyebrow="Les pièges à éviter"
        title="Préparer trop tard, c’est souvent vendre moins bien"
        image="/home/process2.jpg"
        cta={{ href: "/contact", label: "Faire le point sur ma situation" }}
      >
        <p>
          Comptes en retard, documents introuvables, contrats clés fragiles,
          entreprise qui repose entièrement sur son dirigeant : ces situations
          sont fréquentes lorsque la cession est décidée dans la précipitation.
        </p>
        <p>
          Il faut alors soit repousser la vente le temps de tout remettre en
          ordre, soit accepter une décote faute d’arguments. Une bonne
          préparation ne s’improvise pas en quelques mois.
        </p>
      </ImageTextSection>

      <MethodTimeline
        eyebrow="Notre méthode"
        title="Trois phases pour préparer votre cession"
        subtitle="Un accompagnement de 6 à 24 mois, adapté à votre horizon de vente"
        phases={[
          {
            title: "Diagnostic complet",
            duration: "Environ 1 mois",
            lead: "Dresser un état des lieux précis de votre entreprise.",
            description:
              "Nous analysons votre entreprise sous tous ses angles : finances, aspects juridiques, organisation et stratégie. Nous en tirons un plan d’action hiérarchisé, avec un calendrier réaliste, qui distingue ce qui fonctionne, ce qui doit être corrigé et ce qui mérite d’être mieux valorisé.",
          },
          {
            title: "Actions correctives",
            duration: "6 à 18 mois",
            lead: "Améliorer votre entreprise, chantier par chantier.",
            description:
              "C’est la phase la plus longue, et celle qui pèse le plus sur le prix final. Selon vos besoins : réorganisation juridique, formalisation des processus clés, sécurisation des contrats stratégiques, mise en valeur des actifs immatériels, amélioration de la rentabilité et réduction de votre dépendance personnelle.",
          },
          {
            title: "Dossier de cession",
            duration: "6 à 12 mois",
            lead: "Réunir tous les documents attendus par les repreneurs.",
            description:
              "Nous constituons un dossier complet : mémorandum de présentation, business plan, salle de données et valorisation actualisée. Le jour où vous décidez de vendre, les échanges avec les repreneurs peuvent démarrer sans attendre.",
          },
        ]}
      />
    </main>
  );
}
