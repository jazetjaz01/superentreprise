"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Check, ChevronDown, FileText } from "lucide-react";
import {
  ACCEPT_ATTRIBUTE,
  EXPERIENCED_TYPES,
  MAX_FILE_SIZE,
  STUDENT_TYPES,
} from "@/lib/job-applications";
import { submitApplication } from "@/app/carrieres/actions";

// Variantes du formulaire selon la page (étudiants / profils expérimentés)
const PROFILES = {
  etudiant: {
    types: STUDENT_TYPES as readonly string[],
    extraField: {
      name: "school",
      label: "École / formation",
      placeholder: "Ex. Master Finance, IAE de Perpignan",
    },
    messagePlaceholder: "Quelques mots sur votre projet, vos disponibilités…",
  },
  experimente: {
    types: EXPERIENCED_TYPES as readonly string[],
    extraField: {
      name: "current_position",
      label: "Poste actuel / entreprise",
      placeholder: "Ex. Chargé d’affaires, cabinet de conseil",
    },
    messagePlaceholder: "Votre parcours, vos motivations, vos disponibilités…",
  },
} as const;

export type ApplicationProfile = keyof typeof PROFILES;

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

// Sélection d'un fichier avec contrôle immédiat de la taille (2 Mo max)
const FileField = ({
  id,
  name,
  label,
  required,
}: {
  id: string;
  name: string;
  label: string;
  required?: boolean;
}) => {
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="grid gap-3">
      <span className={labelClassName}>{label}</span>
      <label
        htmlFor={id}
        className="flex min-h-14 cursor-pointer items-center gap-3 border border-dashed border-brand/40 bg-stone-100 px-4 py-3 text-brand transition-colors hover:border-brand focus-within:ring-2 focus-within:ring-brand"
      >
        <FileText className="size-5 shrink-0" />
        <span className="min-w-0 flex-1 truncate">
          {fileName ?? "Choisir un fichier (PDF ou Word, 2 Mo max.)"}
        </span>
        <input
          id={id}
          name={name}
          type="file"
          accept={ACCEPT_ATTRIBUTE}
          required={required}
          className="sr-only"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file && file.size > MAX_FILE_SIZE) {
              setError("Ce fichier dépasse 2 Mo. Merci d’en réduire la taille.");
              event.target.value = "";
              setFileName(null);
              return;
            }
            setError(null);
            setFileName(file?.name ?? null);
          }}
        />
      </label>
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
};

// Type présélectionné depuis le bouton « Postuler » (?type=Stage…)
export const ApplicationFormWithType = ({ profile }: { profile: ApplicationProfile }) => {
  const typeParam = useSearchParams().get("type") ?? "";
  const defaultType = PROFILES[profile].types.includes(typeParam) ? typeParam : "";
  return <ApplicationForm profile={profile} defaultType={defaultType} />;
};

export const ApplicationForm = ({
  profile,
  defaultType = "",
}: {
  profile: ApplicationProfile;
  defaultType?: string;
}) => {
  const [state, action, pending] = useActionState(submitApplication, undefined);
  const { types, extraField, messagePlaceholder } = PROFILES[profile];

  if (state?.success) {
    return (
      <div role="status" className="mt-12 border-y py-10 text-brand">
        <Check className="size-8" />
        <p className="mt-4 text-2xl font-semibold tracking-tight">
          Merci, votre candidature a bien été envoyée.
        </p>
        <p className="mt-3 text-muted-foreground">
          Notre équipe l’étudie avec attention et reviendra vers vous rapidement.
        </p>
      </div>
    );
  }

  return (
    <form action={action} className="relative mt-12 grid gap-8">
      <Field id="opportunity_type" label="Type de poste recherché">
        <div className="relative">
          <select
            id="opportunity_type"
            name="opportunity_type"
            required
            defaultValue={defaultType}
            className="h-14 w-full appearance-none border-2 border-brand bg-background px-4 pe-12 text-base text-brand outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
          >
            <option value="" disabled>
              Sélectionnez votre option
            </option>
            {types.map((type) => (
              <option key={type} value={type}>
                {type}
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
          <input id="first_name" name="first_name" autoComplete="given-name" placeholder="Prénom" maxLength={100} required className={`${fieldClassName} h-14`} />
        </Field>
        <Field id="last_name" label="Nom">
          <input id="last_name" name="last_name" autoComplete="family-name" placeholder="Nom" maxLength={100} required className={`${fieldClassName} h-14`} />
        </Field>
      </div>

      <div className="grid gap-8 sm:grid-cols-2">
        <Field id="email" label="Adresse e-mail">
          <input id="email" name="email" type="email" autoComplete="email" placeholder="Adresse e-mail" maxLength={254} required className={`${fieldClassName} h-14`} />
        </Field>
        <Field id="phone" label="Numéro de téléphone">
          <input id="phone" name="phone" type="tel" autoComplete="tel" placeholder="Numéro de téléphone" maxLength={30} className={`${fieldClassName} h-14`} />
        </Field>
      </div>

      <Field id={extraField.name} label={extraField.label}>
        <input id={extraField.name} name={extraField.name} placeholder={extraField.placeholder} maxLength={200} className={`${fieldClassName} h-14`} />
      </Field>

      <div className="grid gap-8 sm:grid-cols-2">
        <FileField id="cv" name="cv" label="CV" required />
        <FileField id="cover_letter" name="cover_letter" label="Lettre de motivation" />
      </div>

      <Field id="message" label="Message (facultatif)">
        <textarea id="message" name="message" rows={5} placeholder={messagePlaceholder} maxLength={3000} className={`${fieldClassName} resize-y py-4`} />
      </Field>

      <label className="flex cursor-pointer items-start gap-3 text-muted-foreground">
        <input
          type="checkbox"
          name="consent"
          required
          className="mt-0.5 size-6 shrink-0 cursor-pointer appearance-none rounded-full border-2 border-brand checked:bg-brand checked:shadow-[inset_0_0_0_4px_var(--background)] focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
        />
        <span>
          J’accepte que mes données et documents soient utilisés par
          Superentreprise pour étudier ma candidature (voir notre{" "}
          <Link href="/confidentialite" className="text-brand underline underline-offset-4">
            politique de confidentialité
          </Link>
          ).
        </span>
      </label>

      {/* Champ piège invisible pour les robots de spam */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[9999px] size-px opacity-0" />

      {state?.error && (
        <p role="alert" className="text-destructive">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="h-14 w-fit bg-brand px-12 text-sm font-medium uppercase tracking-widest text-white transition-colors hover:bg-brand/90 disabled:opacity-50"
      >
        {pending ? "Envoi en cours…" : "Envoyer ma candidature"}
      </button>
    </form>
  );
};
