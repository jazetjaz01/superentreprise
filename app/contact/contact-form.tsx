"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Check, ChevronDown } from "lucide-react";
import { CONTACT_SUBJECTS } from "@/lib/contact";
import { sendContactMessage } from "./actions";

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

export const ContactForm = () => {
  const [state, action, pending] = useActionState(sendContactMessage, undefined);

  if (state?.success) {
    return (
      <div role="status" className="mt-12 border-y py-10 text-brand">
        <Check className="size-8" />
        <p className="mt-4 text-2xl font-semibold tracking-tight">
          Merci, votre message a bien été envoyé.
        </p>
        <p className="mt-3 text-muted-foreground">
          Notre équipe en prend connaissance et revient vers vous rapidement.
        </p>
      </div>
    );
  }

  return (
    <form action={action} className="relative mt-12 grid gap-8">
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
            {CONTACT_SUBJECTS.map((subject) => (
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
            maxLength={100}
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
            maxLength={100}
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
            maxLength={254}
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
            maxLength={30}
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
          minLength={10}
          maxLength={5000}
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
          <Link href="/mentions-legales#conditions" className="text-brand underline underline-offset-4">
            conditions générales
          </Link>{" "}
          et les{" "}
          <Link href="/confidentialite" className="text-brand underline underline-offset-4">
            politiques de confidentialité
          </Link>{" "}
          et de{" "}
          <Link href="/confidentialite#cookies" className="text-brand underline underline-offset-4">
            cookies
          </Link>
          .
        </p>
      </fieldset>

      {/* Champ piège invisible pour les robots de spam */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute -left-[9999px] size-px opacity-0"
      />

      {state?.error && (
        <p role="alert" className="text-destructive">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="h-14 w-fit border-2 border-brand px-12 text-sm font-medium uppercase tracking-widest text-brand transition-colors hover:bg-brand hover:text-white disabled:opacity-50"
      >
        {pending ? "Envoi…" : "Envoyer"}
      </button>
    </form>
  );
};
