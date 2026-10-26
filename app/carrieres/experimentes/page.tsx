import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Breadcrumb } from "@/components/breadcrumb";

export const metadata: Metadata = {
  title: "Profils expérimentés",
  description:
    "Fusions-acquisitions, finance d’entreprise, droit et fiscalité : rejoignez superentreprise et accompagnez les dirigeants dans la transmission de leur entreprise.",
};

// Image provisoire : idéalement une photo paysage dédiée (ex. 1600 × 900 px)
const INTRO_IMAGE = "/carriere/carriere1.jpg";

const APPLY_HREF = "/carrieres/experimentes/candidature";

// Expertises recherchées (à remplacer plus tard par de vraies offres)
const opportunities = [
  {
    domain: "Fusions-acquisitions",
    description:
      "Vous avez mené des opérations de cession ou d’acquisition ? Mettez votre expérience au service des dirigeants de PME et d’ETI.",
  },
  {
    domain: "Finance d’entreprise",
    description:
      "Analyse financière, valorisation, financement : votre expertise est au cœur de chaque transmission réussie.",
  },
  {
    domain: "Droit & fiscalité",
    description:
      "Structuration juridique et fiscale des opérations : accompagnez cédants et repreneurs à chaque étape clé.",
  },
];

export default function ExperimentesPage() {
  return (
    <main className="mx-auto w-full max-w-page flex-1 px-4 py-10 sm:px-6 lg:px-8">
      <Breadcrumb
        items={[
          { label: "Accueil", href: "/" },
          { label: "Carrières", href: "/carrieres" },
          { label: "Profils expérimentés" },
        ]}
      />

      <h1 className="mt-8 text-3xl font-semibold tracking-tight text-brand sm:text-4xl lg:text-5xl">
        Profils expérimentés
      </h1>

      {/* Introduction : image à gauche, texte à droite */}
      <section className="mt-12 grid items-center gap-10 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:gap-16 lg:ps-24">
        <div className="relative aspect-[16/9] overflow-hidden bg-brand/5">
          <Image
            src={INTRO_IMAGE}
            alt=""
            fill
            priority
            sizes="(min-width: 1024px) 60vw, 100vw"
            className="object-cover"
          />
        </div>
        <div className="max-w-md">
          <p className="text-2xl leading-snug tracking-tight text-brand sm:text-3xl">
            Nos talents sont la clé de notre réussite, et nous accueillons de
            nouveaux collaborateurs à toutes les étapes de leur carrière.
          </p>
          <p className="mt-6 text-muted-foreground">
            Nous recherchons des profils expérimentés, un regard neuf sur
            l’accompagnement des dirigeants et l’envie de viser l’excellence. Si
            vous souhaitez renforcer notre équipe, découvrez nos opportunités
            ci-dessous.
          </p>
          <Link
            href={APPLY_HREF}
            className="mt-8 inline-flex h-12 items-center bg-brand px-8 text-sm font-medium uppercase tracking-wide text-white transition-colors hover:bg-brand/90"
          >
            Postuler
          </Link>
        </div>
      </section>

      {/* Expertises recherchées */}
      <section id="opportunites" className="mt-28 scroll-mt-24">
        <p className="flex items-center gap-6 text-base text-brand">
          <span className="h-px w-14 bg-brand" />
          Nos opportunités
        </p>
        <h2 className="mt-6 text-3xl font-semibold tracking-tight text-brand sm:text-4xl">
          Les expertises que nous recherchons
        </h2>

        <ul className="mt-12 grid gap-6 md:grid-cols-3">
          {opportunities.map(({ domain, description }) => (
            <li
              key={domain}
              className="flex flex-col border-l border-brand bg-stone-100 px-8 py-10 text-brand"
            >
              <p className="text-xs font-medium uppercase tracking-widest text-brand/60">
                Profil expérimenté
              </p>
              <h3 className="mt-3 text-2xl font-semibold tracking-tight">{domain}</h3>
              <p className="mt-4 flex-1 text-muted-foreground">{description}</p>
              <Link
                href={`${APPLY_HREF}?type=${encodeURIComponent("Poste expérimenté")}`}
                className="mt-8 inline-flex items-center gap-2 text-sm font-medium uppercase tracking-wide hover:underline hover:underline-offset-4"
              >
                Postuler
                <ArrowRight className="size-4" />
              </Link>
            </li>
          ))}
        </ul>

        <p className="mt-10 text-muted-foreground">
          Votre expertise ne figure pas dans cette liste ?{" "}
          <Link
            href={`${APPLY_HREF}?type=${encodeURIComponent("Candidature spontanée")}`}
            className="text-brand underline underline-offset-4"
          >
            Envoyez-nous une candidature spontanée
          </Link>
          .
        </p>
      </section>
    </main>
  );
}
