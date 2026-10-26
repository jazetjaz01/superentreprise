import type { Metadata } from "next";
import { FeatureGrid } from "@/components/feature-grid";
import { ImageTextSection } from "@/components/image-text-section";
import { MethodTimeline } from "@/components/method-timeline";
import { PageBanner } from "@/components/page-banner";

export const metadata: Metadata = {
  title: "Être accompagné dans votre reprise",
  description:
    "Un interlocuteur de proximité, une double expertise cession et acquisition, un accompagnement sur mesure : superentreprise vous accompagne de la première rencontre à la signature.",
};

export default function AccompagnerPage() {
  return (
    <main>
      <PageBanner
        image="/carriere/students/students1.jpg"
        breadcrumb={[
          { label: "Accueil", href: "/" },
          { label: "Acquisition" },
          { label: "Accompagner" },
        ]}
        title="Être accompagné dans votre reprise"
        subtitle="Pourquoi confier votre projet de reprise à Superentreprise ?"
        cta={{ href: "/contact", label: "Rencontrer un conseiller" }}
      >
        <p>
          Reprendre une entreprise est autant une aventure humaine qu’une
          opération technique. Nous plaçons la relation au cœur de notre
          accompagnement : un interlocuteur qui connaît votre projet, entouré des
          compétences nécessaires à chaque étape.
        </p>
      </PageBanner>

      <FeatureGrid
        eyebrow="Notre différence"
        title="Ce qui distingue notre accompagnement"
        features={[
          {
            title: "Un interlocuteur proche de vous",
            description:
              "Implantés à Perpignan, Paris et Lyon, nous connaissons le tissu économique local. Votre conseiller est joignable directement et se déplace pour vous rencontrer.",
          },
          {
            title: "La vision du cédant",
            description:
              "Nous accompagnons aussi des dirigeants qui cèdent leur entreprise. Nous comprenons leurs attentes et leurs réticences, ce qui facilite le dialogue et la négociation de votre reprise.",
          },
          {
            title: "Un accompagnement sur mesure",
            description:
              "Conseil ponctuel sur un point précis ou pilotage complet de l’opération : notre intervention s’adapte à votre besoin. Vous gardez la main sur les décisions, nous prenons en charge l’opérationnel.",
          },
          {
            title: "Des conseils coordonnés",
            description:
              "Avocat, expert-comptable, notaire, banquier : nous organisons le travail de chacun pour que votre dossier avance sans perte de temps ni zone d’ombre.",
          },
        ]}
      />

      <ImageTextSection
        eyebrow="Pourquoi être accompagné ?"
        title="Reprendre une entreprise, c’est un métier"
        image="/home/process1.jpg"
        cta={{ href: "/contact", label: "Présenter mon projet" }}
      >
        <p>
          Trouver la bonne cible, évaluer son prix, négocier avec le cédant,
          monter le financement et sécuriser les contrats : autant de
          compétences rarement réunies chez un seul repreneur, surtout lorsqu’il
          s’agit d’une première acquisition.
        </p>
        <p>
          Notre rôle : vous faire gagner du temps, vous éviter les erreurs
          coûteuses et vous permettre d’aborder chaque étape avec sérénité.
        </p>
      </ImageTextSection>

      <MethodTimeline
        eyebrow="Notre méthode"
        title="De la première rencontre à la signature"
        subtitle="Un accompagnement structuré et personnalisé"
        phases={[
          {
            title: "Premier rendez-vous",
            duration: "1 rencontre",
            lead: "Prendre le temps de comprendre votre projet.",
            description:
              "Lors d’un premier échange sans engagement, nous faisons connaissance : votre parcours, vos motivations, votre capacité de financement et le type d’entreprise que vous imaginez reprendre.",
          },
          {
            title: "Feuille de route",
            duration: "2 à 4 semaines",
            lead: "Construire ensemble votre stratégie de reprise.",
            description:
              "Nous précisons vos critères de recherche, votre calendrier et votre niveau d’implication souhaité, puis nous formalisons un plan d’accompagnement adapté à votre projet.",
          },
          {
            title: "Recherche & pilotage",
            duration: "9 à 15 mois",
            lead: "Mener le processus de reprise à vos côtés.",
            description:
              "Identification et qualification des cibles, rencontres avec les cédants, analyse des entreprises, valorisation, rédaction de l’offre, montage du financement et coordination des audits. Vous êtes informé à chaque étape et décidez des points importants.",
          },
          {
            title: "Signature & prise de fonction",
            duration: "Jusqu’à la reprise effective",
            lead: "Vous accompagner jusqu’au bout, et au-delà.",
            description:
              "Nous finalisons les aspects juridiques et financiers jusqu’à la signature, puis restons à vos côtés pendant la période de transition avec le cédant, le temps de prendre pleinement vos fonctions.",
          },
        ]}
      />

      <FeatureGrid
        eyebrow="Les points clés"
        title="Ce qu’il faut savoir avant de se lancer"
        features={[
          {
            title: "La feuille de route complète",
            description:
              "Cadrage, recherche, analyse, lettre d’intention, audits, protocole d’accord puis acte de cession : chaque étape a ses enjeux, et leur enchaînement conditionne la réussite de la reprise.",
          },
          {
            title: "Bien sélectionner les cibles",
            description:
              "Santé financière, solidité du modèle, motivations réelles du cédant, calendrier compatible : une sélection rigoureuse évite de perdre des mois sur des dossiers qui n’aboutiront pas.",
          },
          {
            title: "Qui fait quoi ?",
            description:
              "L’expert-comptable analyse les comptes, l’avocat rédige les actes, le notaire sécurise certaines opérations, le banquier finance. Nous coordonnons l’ensemble et menons la négociation.",
          },
          {
            title: "La confidentialité",
            description:
              "Le cédant attend de la discrétion : engagements de confidentialité, visites organisées avec tact, échanges encadrés. Respecter ces règles installe la confiance indispensable à la négociation.",
          },
        ]}
      />
    </main>
  );
}
