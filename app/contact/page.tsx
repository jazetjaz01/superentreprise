import type { Metadata } from "next";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { SectionTitle } from "@/components/section-title";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contactez l’équipe superentreprise pour échanger sur la transmission ou la succession de votre entreprise.",
};

const SUBJECTS = [
  "Céder mon entreprise",
  "Reprendre une entreprise",
  "Valoriser mon entreprise",
  "Préparer une transmission familiale",
  "Carrières",
  "Autre demande",
];

const labelClassName = "text-sm font-medium uppercase tracking-wide text-brand";
const fieldClassName =
  "w-full bg-stone-100 px-4 text-base text-brand placeholder:text-muted-foreground outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-brand";

const Field = ({
  id,
  label,
  children,
}: {
  id: string;
  label: string;
  children: React.ReactNode;
}) => (
  <div className="grid gap-3">
    <label htmlFor={id} className={labelClassName}>
      {label}
    </label>
    {children}
  </div>
);

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
              Un projet de cession, de reprise ou de transmission ? Décrivez-nous
              votre situation, nous revenons vers vous rapidement.
            </p>
          </div>

          <form className="mt-12 grid gap-8">
            <Field id="subject" label="Objet de la demande">
              <div className="relative">
                <select
                  id="subject"
                  name="subject"
                  required
                  defaultValue=""
                  className="h-14 w-full appearance-none border-2 border-brand bg-background px-4 pe-12 text-base text-brand outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
                >
                  <option value="" disabled>
                    Sélectionnez votre option
                  </option>
                  {SUBJECTS.map((subject) => (
                    <option key={subject} value={subject}>
                      {subject}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  aria-hidden="true"
                  className="pointer-events-none absolute top-1/2 right-4 size-5 -translate-y-1/2 text-brand"
                />
              </div>
            </Field>

            <div className="grid gap-8 sm:grid-cols-2">
              <Field id="first_name" label="Prénom">
                <input
                  id="first_name"
                  name="first_name"
                  autoComplete="given-name"
                  placeholder="Prénom"
                  required
                  className={`${fieldClassName} h-14`}
                />
              </Field>
              <Field id="last_name" label="Nom">
                <input
                  id="last_name"
                  name="last_name"
                  autoComplete="family-name"
                  placeholder="Nom"
                  required
                  className={`${fieldClassName} h-14`}
                />
              </Field>
            </div>

            <div className="grid gap-8 sm:grid-cols-2">
              <Field id="email" label="Adresse e-mail">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="Adresse e-mail"
                  required
                  className={`${fieldClassName} h-14`}
                />
              </Field>
              <Field id="phone" label="Numéro de téléphone">
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  placeholder="Numéro de téléphone"
                  className={`${fieldClassName} h-14`}
                />
              </Field>
            </div>

            <Field id="message" label="Votre message">
              <textarea
                id="message"
                name="message"
                rows={7}
                placeholder="Veuillez saisir votre message."
                required
                className={`${fieldClassName} resize-y py-4`}
              />
            </Field>

            <fieldset className="grid gap-4">
              <legend className={labelClassName}>J’accepte les termes et conditions</legend>
              <label className="mt-4 flex w-fit cursor-pointer items-center gap-3 text-brand">
                <input
                  type="checkbox"
                  name="terms"
                  required
                  className="size-6 cursor-pointer appearance-none rounded-full border-2 border-brand checked:bg-brand checked:shadow-[inset_0_0_0_4px_var(--background)] focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
                />
                Accepter
              </label>
              <p className="text-muted-foreground">
                J’accepte les{" "}
                <Link href="#" className="text-brand underline underline-offset-4">
                  conditions générales
                </Link>{" "}
                et les{" "}
                <Link href="#" className="text-brand underline underline-offset-4">
                  politiques de confidentialité
                </Link>{" "}
                et de{" "}
                <Link href="#" className="text-brand underline underline-offset-4">
                  cookies
                </Link>
                .
              </p>
            </fieldset>

            <button
              type="submit"
              className="h-14 w-fit border-2 border-brand px-12 text-sm font-medium uppercase tracking-widest text-brand transition-colors hover:bg-brand hover:text-white"
            >
              Envoyer
            </button>
          </form>
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
              Les informations transmises sont traitées en toute
              confidentialité et utilisées uniquement pour répondre à votre
              demande.
            </p>
          </section>
          <section>
            <SectionTitle>Par téléphone</SectionTitle>
            <p className="mt-6 border-y py-5">
              <a href="tel:+33616224682" className="text-brand underline underline-offset-4">
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
