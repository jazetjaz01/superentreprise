import type { Metadata } from "next";
import { Suspense } from "react";
import { SectionTitle } from "@/components/section-title";
import { OfficesSection } from "@/components/contact/offices-section";
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
            <SectionTitle>Adresse</SectionTitle>
            <div className="mt-6 border-y py-5">
              <address className="not-italic leading-relaxed text-brand">
                Superentreprise
                <br />7 avenue de Banyuls-sur-Mer
                <br />66100 Perpignan
              </address>
              <a
                href="https://www.google.com/maps/search/?api=1&query=7+avenue+de+Banyuls-sur-Mer+66100+Perpignan"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-block text-sm text-brand underline underline-offset-4"
              >
                Voir sur la carte
              </a>
            </div>
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

      {/* Suspense : la liste des agences peut avoir un cache court (table absente, mise à jour) */}
      <Suspense fallback={null}>
        <OfficesSection />
      </Suspense>
    </main>
  );
}
