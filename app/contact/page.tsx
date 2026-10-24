import type { Metadata } from "next";
import { SectionTitle } from "@/components/section-title";
import { ContactForm } from "./contact-form";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contactez l’équipe superentreprise pour échanger sur la transmission ou la succession de votre entreprise.",
};

export default function ContactPage() {
  return (
    <main className="mx-auto w-full max-w-page flex-1 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-6xl gap-16 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-20">
        {/* Colonne principale : formulaire */}
        <div>
          <div className="text-brand">
            <p className="flex items-center gap-6 text-base">
              <span className="h-px w-14 bg-brand" />
              Contact
            </p>
            <h1 className="mt-6 text-3xl font-semibold tracking-tight sm:text-4xl">
              Contactez-nous
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Un projet de cession, de reprise ou de transmission ?
              Décrivez-nous votre situation, nous revenons vers vous rapidement.
            </p>
          </div>

          <ContactForm />
        </div>

        {/* Colonne droite : informations */}
        <aside className="space-y-12 lg:sticky lg:top-8 lg:self-start lg:pt-40">
          <section>
            <SectionTitle>Votre demande</SectionTitle>
            <p className="mt-6 border-y py-5 text-muted-foreground">
              Un membre de notre équipe prend connaissance de votre message et
              revient vers vous pour convenir d’un premier échange.
            </p>
          </section>
          <section>
            <SectionTitle>Confidentialité</SectionTitle>
            <p className="mt-6 border-y py-5 text-muted-foreground">
              Les informations transmises sont traitées en toute confidentialité
              et utilisées uniquement pour répondre à votre demande.
            </p>
          </section>
          <section>
            <SectionTitle>Par téléphone</SectionTitle>
            <p className="mt-6 border-y py-5">
              <a
                href="tel:+33616224682"
                className="text-brand underline underline-offset-4"
              >
                06 16 22 46 82
              </a>
            </p>
          </section>
          <section>
            <SectionTitle>Par e-mail</SectionTitle>
            <p className="mt-6 border-y py-5">
              <a
                href="mailto:contact@superentreprise.com"
                className="text-brand underline underline-offset-4"
              >
                contact@superentreprise.com
              </a>
            </p>
          </section>
        </aside>
      </div>
    </main>
  );
}
