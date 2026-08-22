import { Handshake, Lock, MessageCircle, Rocket, ShieldCheck, Wallet } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const advantages = [
  {
    icon: Handshake,
    title: "Mise en relation directe",
    description:
      "Contactez directement les cédants ou les acheteurs intéressés, sans intermédiaire ni commission sur la transaction.",
  },
  {
    icon: Lock,
    title: "Confidentialité préservée",
    description:
      "Affichez un surnom plutôt que votre nom, et ne communiquez vos coordonnées qu'aux personnes de votre choix.",
  },
  {
    icon: MessageCircle,
    title: "Messagerie intégrée",
    description:
      "Échangez en toute sécurité avec vos interlocuteurs directement depuis la plateforme, sans partager votre email.",
  },
  {
    icon: Wallet,
    title: "Tarifs clairs et sans engagement",
    description:
      "Un abonnement mensuel simple pour diffuser votre annonce, résiliable à tout moment, sans frais cachés.",
  },
  {
    icon: Rocket,
    title: "Des forfaits pour chaque profil",
    description:
      "D'une annonce unique pour un cédant particulier à plusieurs dizaines pour les agences et professionnels de la cession.",
  },
  {
    icon: ShieldCheck,
    title: "Une équipe à votre écoute",
    description:
      "Une petite équipe basée à Perpignan, disponible pour vous accompagner dans votre projet de cession ou de reprise.",
  },
];

const Mission = () => {
  return (
    <div className="mx-auto max-w-(--breakpoint-xl) px-6 py-20">
      <div className="text-center">
        <strong className="font-medium text-muted-foreground text-sm uppercase tracking-wide">
          Notre mission
        </strong>
        <h1 className="mt-2 text-balance font-medium text-3xl tracking-[-0.04em] sm:text-4xl md:text-[2.75rem]">
          Faciliter la cession et la reprise d&apos;entreprises en France
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-justify text-foreground/90 leading-relaxed">
          Superentreprise met en relation les cédants d&apos;entreprises, de
          commerces et de fonds de commerce avec des repreneurs sérieux, sur
          toute la France, en Belgique et en Suisse. Notre rôle est simple :
          vous offrir une plateforme claire, sécurisée et confidentielle pour
          diffuser une annonce ou trouver l&apos;entreprise que vous
          recherchez, sans les lourdeurs et les commissions des circuits
          traditionnels.
        </p>
      </div>

      <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {advantages.map((advantage) => (
          <div key={advantage.title} className="flex flex-col gap-3">
            <advantage.icon className="size-8 stroke-[1.5px] text-primary" />
            <h3 className="font-medium text-lg tracking-tight">
              {advantage.title}
            </h3>
            <p className="text-muted-foreground text-sm">
              {advantage.description}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-16 flex flex-col items-center gap-4 rounded-xl border border-border bg-muted/50 p-8 text-center sm:flex-row sm:justify-between sm:text-left">
        <div>
          <h2 className="font-medium text-xl">Prêt à démarrer ?</h2>
          <p className="mt-1 text-muted-foreground text-sm">
            Parcourez les annonces ou déposez la vôtre en quelques minutes.
          </p>
        </div>
        <div className="flex gap-3">
          <Button render={<Link href="/annonces" />} nativeButton={false} className="rounded-full">
            Voir les annonces
          </Button>
          <Button
            render={<Link href="/deposer-une-annonce" />}
            nativeButton={false}
            variant="outline"
            className="rounded-full"
          >
            Déposer une annonce
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Mission;
