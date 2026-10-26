import type { Metadata } from "next";
import { FeatureGrid } from "@/components/feature-grid";
import { ImageTextSection } from "@/components/image-text-section";
import { MethodTimeline } from "@/components/method-timeline";
import { PageBanner } from "@/components/page-banner";

export const metadata: Metadata = {
  title: "Transmettre votre entreprise",
  description:
    "Vente à un tiers, transmission familiale ou reprise par les salariés : superentreprise vous aide à choisir la bonne stratégie et vous accompagne jusqu’à la signature.",
};

export default function TransmettrePage() {
  return (
    <main>
      <PageBanner
        image="/carriere/carriere1.jpg"
        breadcrumb={[
          { label: "Accueil", href: "/" },
          { label: "Cession" },
          { label: "Transmettre" },
        ]}
        title="Transmettre votre entreprise"
        subtitle="À qui confier votre entreprise, et selon quelles modalités ?"
        cta={{ href: "/contact", label: "Échanger avec un conseiller" }}
      >
        <p>
          Céder à un tiers, transmettre à vos enfants ou à vos salariés : chaque
          option répond à des objectifs différents et appelle une stratégie
          propre. Bien connaître ces scénarios vous aide à retenir celui qui
          correspond à votre situation et à vos priorités.
        </p>
      </PageBanner>

      <FeatureGrid
        eyebrow="Pourquoi le choix du repreneur est décisif"
        title="Un repreneur, des conséquences sur tout le reste"
        features={[
          {
            title: "Le prix de vente",
            description:
              "Tous les repreneurs ne valorisent pas votre entreprise de la même façon : un groupe peut payer pour des synergies, un fonds pour un potentiel de croissance, tandis qu’un repreneur individuel reste limité par sa capacité de financement.",
          },
          {
            title: "Ce qui vous tient à cœur",
            description:
              "L’avenir de vos équipes, la transmission de votre savoir-faire, la continuité de vos relations clients : selon le profil du repreneur, ces éléments seront plus ou moins préservés.",
          },
          {
            title: "La fiscalité",
            description:
              "Transmission familiale, cession des titres ou du fonds de commerce, montage avec effet de levier : chaque voie obéit à des règles fiscales différentes, avec un impact direct sur ce qu’il vous reste après la vente.",
          },
          {
            title: "La confidentialité",
            description:
              "Clients, concurrents, salariés : certaines cessions exigent une discrétion totale. Adapter la démarche à ce niveau d’exigence évite les fuites qui fragilisent l’entreprise pendant la vente.",
          },
        ]}
      />

      <ImageTextSection
        eyebrow="Les pièges à éviter"
        title="Sans stratégie claire, la transmission subit les événements"
        image="/home/process3.jpg"
        cta={{ href: "/contact", label: "Définir ma stratégie" }}
      >
        <p>
          Des mois passés avec des repreneurs qui ne correspondent pas, une
          information qui circule trop tôt, des négociations qui s’enlisent faute
          d’objectifs précis, et un prix final en deçà des attentes : c’est le
          risque quand la stratégie n’est pas posée dès le départ.
        </p>
        <p>
          Une transmission réussie commence par trois questions : quel repreneur
          recherchez-vous, quel niveau de discrétion vous faut-il, et quelles
          conditions êtes-vous prêt à accepter ?
        </p>
      </ImageTextSection>

      <MethodTimeline
        eyebrow="Notre méthode"
        title="De la stratégie à la signature"
        subtitle="Durée indicative : 12 à 18 mois"
        phases={[
          {
            title: "Stratégie de transmission",
            duration: "1 à 2 mois",
            lead: "Fixer le cap avant d’approcher les repreneurs.",
            description:
              "Nous clarifions vos objectifs (prix, calendrier, discrétion, avenir de l’entreprise), identifions le profil de repreneur le plus adapté, arbitrons entre cession des titres et du fonds de commerce, et choisissons l’approche : démarche confidentielle ciblée ou diffusion plus large.",
          },
          {
            title: "Recherche des repreneurs",
            duration: "6 à 10 mois",
            lead: "Trouver et sélectionner les bons interlocuteurs.",
            description:
              "Nous préparons une présentation anonyme puis un mémorandum détaillé, sollicitons les repreneurs pertinents de notre réseau, vérifions leur sérieux et leur capacité de financement, et organisons les premières rencontres en préservant la confidentialité.",
          },
          {
            title: "Négociation & signature",
            duration: "4 à 6 mois",
            lead: "Sécuriser l’accord jusqu’à l’acte final.",
            description:
              "Nous analysons les offres, négocions le prix et les conditions (complément de prix, garanties, non-concurrence), encadrons les vérifications menées par le repreneur et coordonnons avocats, experts-comptables, banques et notaire jusqu’à la signature.",
          },
        ]}
      />

      <FeatureGrid
        eyebrow="Les points clés"
        title="Les grandes questions d’une transmission"
        features={[
          {
            title: "Céder à vos salariés",
            description:
              "Une reprise par l’équipe dirigeante ou les salariés repose sur des montages financiers spécifiques et s’accompagne d’une obligation d’information préalable des salariés.",
          },
          {
            title: "Titres ou fonds de commerce",
            description:
              "Vendre les parts de la société ou seulement son fonds de commerce n’a pas les mêmes conséquences fiscales et juridiques, ni pour vous ni pour le repreneur : un arbitrage à étudier tôt.",
          },
          {
            title: "Discrétion ou large diffusion",
            description:
              "Approcher quelques repreneurs ciblés en toute confidentialité ou ouvrir largement le processus : chaque approche a ses avantages, selon votre secteur et vos priorités.",
          },
          {
            title: "Les étapes jusqu’au closing",
            description:
              "Présentation anonyme, mémorandum, lettres d’intention, vérifications, négociation des garanties, protocole d’accord puis acte de cession : un parcours exigeant, que nous pilotons à vos côtés.",
          },
        ]}
      />
    </main>
  );
}
