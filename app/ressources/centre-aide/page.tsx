import { MailIcon, MapPinIcon, PhoneIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Centre d'aide | Superentreprise",
  description:
    "Besoin d'aide ? Retrouvez nos coordonnées et les questions fréquentes sur Superentreprise.",
};

export default function CentreAidePage() {
  return (
    <div className="mx-auto w-full max-w-(--breakpoint-lg) px-6 py-12 text-center">
      <strong className="font-medium text-muted-foreground text-sm uppercase tracking-wide">
        Centre d&apos;aide
      </strong>
      <h1 className="mt-2 font-medium text-3xl tracking-[-0.02em] sm:text-4xl">
        Comment pouvons-nous vous aider ?
      </h1>
      <p className="mx-auto mt-3 max-w-xl text-lg text-muted-foreground">
        Notre équipe est à votre écoute pour toute question sur
        l&apos;achat ou la vente de votre entreprise.
      </p>

      <div className="mx-auto mt-16 grid max-w-(--breakpoint-lg) gap-10 md:grid-cols-3">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-border/30 bg-primary/5 text-primary dark:bg-primary/10">
            <MailIcon />
          </div>
          <h2 className="mt-6 font-medium text-xl">Email</h2>
          <p className="mt-2 text-muted-foreground">
            Notre équipe vous répond sous 24h ouvrées.
          </p>
          <Link
            className="mt-4 font-medium text-primary"
            href="mailto:contact@superentreprise.com"
          >
            contact@superentreprise.com
          </Link>
        </div>
        <div className="flex flex-col items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-border/30 bg-primary/5 text-primary dark:bg-primary/10">
            <MapPinIcon />
          </div>
          <h2 className="mt-6 font-medium text-xl">Bureau</h2>
          <p className="mt-2 text-muted-foreground">
            Venez nous rencontrer sur rendez-vous.
          </p>
          <span className="mt-4 font-medium text-primary">
            Merci Immobilier
            <br />7 avenue de Banyuls sur Mer
            <br />
            66100 Perpignan
          </span>
        </div>
        <div className="flex flex-col items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-border/30 bg-primary/5 text-primary dark:bg-primary/10">
            <PhoneIcon />
          </div>
          <h2 className="mt-6 font-medium text-xl">Téléphone</h2>
          <p className="mt-2 text-muted-foreground">
            Du lundi au vendredi, 9h - 18h.
          </p>
          <Link className="mt-4 font-medium text-primary" href="tel:+33616224682">
            06 16 22 46 82
          </Link>
        </div>
      </div>

      <div className="mx-auto mt-16 flex max-w-xl flex-col items-center gap-4 rounded-xl border border-border bg-muted/50 p-8">
        <p className="text-muted-foreground">
          Vous trouverez peut-être déjà une réponse à votre question dans
          notre foire aux questions.
        </p>
        <Link
          href="/faq"
          className="font-medium text-primary underline underline-offset-2"
        >
          Consulter les questions fréquentes
        </Link>
      </div>
    </div>
  );
}
