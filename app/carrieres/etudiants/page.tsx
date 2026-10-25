import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Breadcrumb } from "@/components/breadcrumb";

export const metadata: Metadata = {
  title: "Étudiants et jeunes diplômés",
  description:
    "Stage, alternance ou premier emploi : rejoignez superentreprise et découvrez le conseil en transmission et cession d’entreprise.",
};

const INTRO_IMAGE = "/carriere/students/students1.jpg";

// Types de postes proposés (à remplacer plus tard par de vraies offres)
const opportunities = [
  {
    type: "Stage",
    title: "Stages",
    description:
      "Participez à des missions de cession et de reprise aux côtés de nos consultants : analyse financière, valorisation, préparation des dossiers.",
  },
  {
    type: "Alternance",
    title: "Alternance",
    description:
      "Conciliez vos études et une première expérience concrète du conseil aux dirigeants, tout au long de votre formation.",
  },
  {
    type: "CDI",
    title: "Premier emploi",
    description:
      "Rejoignez l’équipe en tant que chargé(e) d’affaires junior et accompagnez des chefs d’entreprise dans leurs projets de transmission.",
  },
];

export default function EtudiantsPage() {
  return (
    <main className="mx-auto w-full max-w-page flex-1 px-4 py-10 sm:px-6 lg:px-8">
      <Breadcrumb
        items={[
          { label: "Accueil", href: "/" },
          { label: "Carrières", href: "/carrieres" },
          { label: "Étudiants et jeunes diplômés" },
        ]}
      />

      <h1 className="mt-8 text-3xl font-semibold tracking-tight text-brand sm:text-4xl lg:text-5xl">
        Étudiants et jeunes diplômés
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
            Celles et ceux qui débutent apportent un regard neuf et une énergie
            précieuse à nos équipes, et ce dès le premier jour.
          </p>
          <p className="mt-6 text-muted-foreground">
            Stage, alternance ou premier emploi : plusieurs possibilités s’offrent
            à vous pour nous rejoindre et découvrir le conseil en transmission et
            cession d’entreprise aux côtés de nos experts.
          </p>
          <Link
            href="#opportunites"
            className="mt-8 inline-flex h-12 items-center bg-brand px-8 text-sm font-medium uppercase tracking-wide text-white transition-colors hover:bg-brand/90"
          >
            Voir nos opportunités
          </Link>
        </div>
      </section>

      {/* Opportunités */}
      <section id="opportunites" className="mt-28 scroll-mt-24">
        <p className="flex items-center gap-6 text-base text-brand">
          <span className="h-px w-14 bg-brand" />
          Nos opportunités
        </p>
        <h2 className="mt-6 text-3xl font-semibold tracking-tight text-brand sm:text-4xl">
          Stage, alternance ou premier emploi
        </h2>

        <ul className="mt-12 grid gap-6 md:grid-cols-3">
          {opportunities.map(({ type, title, description }) => (
            <li
              key={type}
              className="flex flex-col border-l border-brand bg-stone-100 px-8 py-10 text-brand"
            >
              <p className="text-xs font-medium uppercase tracking-widest text-brand/60">
                {type}
              </p>
              <h3 className="mt-3 text-2xl font-semibold tracking-tight">{title}</h3>
              <p className="mt-4 flex-1 text-muted-foreground">{description}</p>
              <Link
                href="/contact"
                className="mt-8 inline-flex items-center gap-2 text-sm font-medium uppercase tracking-wide hover:underline hover:underline-offset-4"
              >
                Postuler
                <ArrowRight className="size-4" />
              </Link>
            </li>
          ))}
        </ul>

        <p className="mt-10 text-muted-foreground">
          Aucune opportunité ne correspond à votre profil ?{" "}
          <Link href="/contact" className="text-brand underline underline-offset-4">
            Envoyez-nous une candidature spontanée
          </Link>
          .
        </p>
      </section>
    </main>
  );
}
