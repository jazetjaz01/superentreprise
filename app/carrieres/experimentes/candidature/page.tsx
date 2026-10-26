import type { Metadata } from "next";
import { Suspense } from "react";
import { Breadcrumb } from "@/components/breadcrumb";
import { ApplicationForm, ApplicationFormWithType } from "@/components/careers/application-form";

export const metadata: Metadata = {
  title: "Candidater · Profils expérimentés",
  description: "Envoyez votre candidature à superentreprise : profils expérimentés.",
};

export default function CandidatureExperimentesPage() {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 sm:px-6">
      <Breadcrumb
        items={[
          { label: "Accueil", href: "/" },
          { label: "Carrières", href: "/carrieres" },
          { label: "Profils expérimentés", href: "/carrieres/experimentes" },
          { label: "Candidater" },
        ]}
      />

      <h1 className="mt-8 text-3xl font-semibold tracking-tight text-brand sm:text-4xl lg:text-5xl">
        Envoyez votre candidature
      </h1>
      <p className="mt-4 text-lg text-muted-foreground">
        Joignez votre CV et, si vous le souhaitez, une lettre de motivation.
        Nous étudions chaque candidature avec attention et en toute
        confidentialité.
      </p>

      {/* Formulaire prérendu sans présélection, puis type lu dans l'URL (useSearchParams) */}
      <Suspense fallback={<ApplicationForm profile="experimente" />}>
        <ApplicationFormWithType profile="experimente" />
      </Suspense>
    </main>
  );
}
