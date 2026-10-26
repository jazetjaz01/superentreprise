import type { Metadata } from "next";
import { FeatureGrid } from "@/components/feature-grid";
import { ImageTextSection } from "@/components/image-text-section";
import { MethodTimeline } from "@/components/method-timeline";
import { PageBanner } from "@/components/page-banner";

export const metadata: Metadata = {
  title: "Reprendre une entreprise",
  description:
    "Devenir chef d’entreprise par la reprise : superentreprise vous aide à cadrer votre projet, trouver la bonne cible, la financer et sécuriser l’acquisition jusqu’à la signature.",
};

export default function ReprendrePage() {
  return (
    <main>
      <PageBanner
        image="/home/ladefense.jpg"
        breadcrumb={[
          { label: "Accueil", href: "/" },
          { label: "Acquisition" },
          { label: "Reprendre" },
        ]}
        title="Reprendre une entreprise"
        subtitle="Comment devenir chef d’entreprise par la reprise ?"
        cta={{ href: "/contact", label: "Être accompagné dans ma reprise" }}
      >
        <p>
          Reprendre une entreprise existante, c’est gagner des années sur le
          chemin de l’entrepreneuriat : les clients, l’équipe et le modèle
          économique sont déjà là. Encore faut-il trouver la bonne cible, la
          financer et sécuriser l’opération.
        </p>
      </PageBanner>

      <FeatureGrid
        eyebrow="Pourquoi reprendre plutôt que créer ?"
        title="Les atouts d’une reprise d’entreprise"
        features={[
          {
            title: "Un historique qui rassure",
            description:
              "L’entreprise réalise déjà un chiffre d’affaires et dispose de comptes établis. Les banques s’appuient sur cet historique pour financer l’opération, et vous évitez l’incertitude des premières années d’une création.",
          },
          {
            title: "Des actifs déjà constitués",
            description:
              "Réputation, savoir-faire, clientèle, organisation : ces éléments, qui ont demandé des années à se construire, représentent une part importante de la valeur d’une PME. Avec la reprise, vous en disposez dès le premier jour.",
          },
          {
            title: "Un apport personnel maîtrisé",
            description:
              "Prêts d’honneur, aides régionales et montages avec effet de levier permettent de financer une large part du prix par la dette, remboursée grâce à la rentabilité de l’entreprise reprise.",
          },
          {
            title: "Un projet à votre image",
            description:
              "Entreprise structurée avec une équipe autonome, activité artisanale à développer, secteur réglementé ou en croissance : le bon projet est celui qui correspond à vos compétences et à votre projet de vie.",
          },
        ]}
      />

      <ImageTextSection
        eyebrow="La clé d’une reprise réussie"
        title="Bien comprendre l’entreprise que vous reprenez"
        image="/home/carriere4.jpg"
        cta={{ href: "/contact", label: "Parler de mon projet" }}
      >
        <p>
          Le financement n’est pas le principal facteur de réussite. Ce qui fait
          la différence, c’est l’adéquation entre le repreneur et l’entreprise :
          comprendre son activité, son marché, ses équipes et ses fragilités
          avant de s’engager.
        </p>
        <p>
          C’est tout l’enjeu de notre accompagnement : vous aider à choisir une
          entreprise qui vous ressemble, et à la reprendre en connaissance de
          cause.
        </p>
      </ImageTextSection>

      <MethodTimeline
        eyebrow="Notre méthode"
        title="De l’idée de reprise à la signature"
        subtitle="Durée indicative : 9 à 18 mois"
        phases={[
          {
            title: "Cadrage du projet",
            duration: "Environ 1 mois",
            lead: "Définir ce que vous recherchez vraiment.",
            description:
              "Nous faisons le point sur votre parcours, vos compétences et votre capacité de financement, puis nous précisons vos critères de recherche : secteur, taille, localisation, niveau d’implication souhaité.",
          },
          {
            title: "Recherche des cibles",
            duration: "4 à 9 mois",
            lead: "Identifier et approcher les entreprises pertinentes.",
            description:
              "Nous repérons les entreprises à reprendre correspondant à vos critères, vérifions en amont leur cohérence financière et la solidité de leur modèle, puis organisons la prise de contact et les premières rencontres avec les cédants.",
          },
          {
            title: "Analyse & valorisation",
            duration: "1 à 2 mois",
            lead: "Comprendre la réalité de l’entreprise et sa juste valeur.",
            description:
              "Nous étudions les documents transmis par le cédant (comptes, contrats, organisation, clientèle), repérons les points forts et les zones de risque, et établissons une valorisation argumentée pour préparer votre offre.",
          },
          {
            title: "Offre & audits",
            duration: "2 à 3 mois",
            lead: "Formaliser votre offre et vérifier chaque point.",
            description:
              "Nous rédigeons avec vous la lettre d’intention (prix, financement, calendrier, conditions suspensives), puis coordonnons les audits comptable, fiscal, juridique et social qui confirment ou ajustent la valeur de l’entreprise.",
          },
          {
            title: "Négociation & signature",
            duration: "1 à 2 mois",
            lead: "Sécuriser l’accord et préparer la transition.",
            description:
              "Nous négocions le protocole d’accord (prix définitif, modalités de paiement, garantie d’actif et de passif, accompagnement par le cédant), pilotons l’opération jusqu’à la signature et organisons la période de transition.",
          },
        ]}
      />

      <FeatureGrid
        eyebrow="Les points clés"
        title="Ce qu’un repreneur doit maîtriser"
        features={[
          {
            title: "Le cadre juridique",
            description:
              "Lettre d’intention, protocole d’accord, acte de cession : comprenez les engagements que vous prenez et les garanties que vous obtenez avant d’entrer en négociation.",
          },
          {
            title: "Le montage financier",
            description:
              "Apport personnel, prêt bancaire, prêts d’honneur, éventuelle holding de reprise : un financement bien structuré conditionne la réussite de l’opération et votre sérénité ensuite.",
          },
          {
            title: "Vos protections",
            description:
              "Garantie d’actif et de passif, complément de prix lié aux résultats futurs, somme placée sous séquestre : autant de mécanismes qui vous protègent des mauvaises surprises après la reprise.",
          },
          {
            title: "La transition avec le cédant",
            description:
              "Présentation aux équipes, aux clients et aux fournisseurs, transmission du savoir-faire : une période d’accompagnement par le cédant sécurise vos premiers mois à la tête de l’entreprise.",
          },
        ]}
      />
    </main>
  );
}
