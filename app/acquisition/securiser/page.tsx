import type { Metadata } from "next";
import { FeatureGrid } from "@/components/feature-grid";
import { ImageTextSection } from "@/components/image-text-section";
import { MethodTimeline } from "@/components/method-timeline";
import { PageBanner } from "@/components/page-banner";

export const metadata: Metadata = {
  title: "Sécuriser votre acquisition",
  description:
    "Audits, montage juridique et financier, garanties contractuelles : superentreprise vous aide à sécuriser la reprise d’une entreprise, de l’audit jusqu’à la signature.",
};

export default function SecuriserPage() {
  return (
    <main>
      <PageBanner
        image="/carriere/carriere3.jpg"
        breadcrumb={[
          { label: "Accueil", href: "/" },
          { label: "Acquisition" },
          { label: "Sécuriser" },
        ]}
        title="Sécuriser votre acquisition"
        subtitle="Comment reprendre une entreprise sans mauvaise surprise ?"
        cta={{ href: "/contact", label: "Échanger avec un conseiller" }}
      >
        <p>
          Reprendre une entreprise engage votre patrimoine et votre avenir
          professionnel. Vérifier ce que vous achetez, structurer le financement
          et obtenir les bonnes garanties vous protège bien au-delà du jour de la
          signature.
        </p>
      </PageBanner>

      <FeatureGrid
        eyebrow="Pourquoi sécuriser votre reprise ?"
        title="Ce que la sécurisation vous apporte"
        features={[
          {
            title: "Acheter en connaissance de cause",
            description:
              "Un passif caché, un contrat clé fragile ou un litige en cours peuvent peser lourd après la reprise. Les audits permettent de les découvrir avant de signer, et d’en tenir compte dans le prix ou les conditions.",
          },
          {
            title: "Un montage solide",
            description:
              "Reprise des titres ou du fonds de commerce, holding de reprise, répartition entre apport et dette : la structure retenue conditionne votre fiscalité, votre capacité de remboursement et votre marge de manœuvre.",
          },
          {
            title: "Des garanties qui vous protègent",
            description:
              "Garantie d’actif et de passif, somme placée sous séquestre, complément de prix lié aux résultats : bien négociés, ces mécanismes vous couvrent si la réalité diffère de ce qui vous a été présenté.",
          },
          {
            title: "Une transition maîtrisée",
            description:
              "Engagement de non-concurrence du cédant, accompagnement pendant les premiers mois, information des équipes et des clients au bon moment : autant de points à prévoir pour démarrer sereinement.",
          },
        ]}
      />

      <ImageTextSection
        eyebrow="Les pièges à éviter"
        title="Signer trop vite peut coûter cher"
        image="/home/carriere2.jpg"
        cta={{ href: "/contact", label: "Faire relire mon projet" }}
      >
        <p>
          Se contenter des comptes présentés par le cédant, accepter une garantie
          trop limitée ou s’engager sans mesurer la portée des clauses : ces
          raccourcis exposent le repreneur à des difficultés qu’il découvre
          souvent après la signature.
        </p>
        <p>
          Un accompagnement juridique, financier et fiscal vous permet de savoir
          précisément ce que vous achetez et ce à quoi vous vous engagez.
        </p>
      </ImageTextSection>

      <MethodTimeline
        eyebrow="Notre accompagnement"
        title="Trois étapes pour sécuriser votre reprise"
        subtitle="Une approche complète : juridique, financière et contractuelle"
        phases={[
          {
            title: "Audits d’acquisition",
            duration: "1 à 2 mois",
            lead: "Vérifier chaque aspect de l’entreprise reprise.",
            description:
              "Nous coordonnons les audits comptable, fiscal, juridique et social : qualité des comptes, contrats stratégiques, litiges, situation du personnel. L’objectif : identifier les risques avant de vous engager et ajuster votre offre en conséquence.",
          },
          {
            title: "Montage juridique & financier",
            duration: "2 à 4 mois",
            lead: "Structurer l’opération dans votre intérêt.",
            description:
              "Nous vous aidons à choisir la structure de reprise la plus adaptée, à construire le plan de financement avec les banques et les dispositifs d’aide, et à préparer la documentation nécessaire à l’opération.",
          },
          {
            title: "Sécurisation contractuelle",
            duration: "Jusqu’à la signature",
            lead: "Négocier chaque clause qui vous protège.",
            description:
              "Garantie d’actif et de passif, séquestre, complément de prix, non-concurrence du cédant, accompagnement de transition : nous négocions ces clauses avec vous et coordonnons avocats, experts-comptables, banques et notaire jusqu’à l’acte final.",
          },
        ]}
      />

      <FeatureGrid
        eyebrow="Les points clés"
        title="Les protections à connaître"
        features={[
          {
            title: "La garantie d’actif et de passif",
            description:
              "Elle vous indemnise si un passif antérieur à la reprise apparaît ou si un actif s’avère surévalué. Son montant, sa durée et ses conditions de mise en œuvre se négocient.",
          },
          {
            title: "Le séquestre",
            description:
              "Une partie du prix est conservée par un tiers pendant une durée convenue. Elle garantit que l’indemnisation prévue pourra effectivement être versée en cas de problème.",
          },
          {
            title: "Le complément de prix",
            description:
              "Une partie du prix dépend des résultats futurs de l’entreprise. Ce mécanisme partage le risque avec le cédant lorsque la valeur est difficile à établir avec certitude.",
          },
          {
            title: "La non-concurrence du cédant",
            description:
              "Le cédant s’engage à ne pas exercer une activité concurrente pendant une durée et sur un territoire définis, afin de protéger la clientèle que vous reprenez.",
          },
        ]}
      />
    </main>
  );
}
