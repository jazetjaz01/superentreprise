import type { Metadata } from "next";
import Image from "next/image";
import { Breadcrumb } from "@/components/breadcrumb";
import { FeatureGrid } from "@/components/feature-grid";

export const metadata: Metadata = {
  title: "Nous connaître",
  description:
    "superentreprise, cabinet de conseil indépendant dédié à la cession, à l’acquisition et à la transmission d’entreprise.",
};

export default function NousConnaitrePage() {
  return (
    <main className="flex-1">
      <section className="mx-auto max-w-page px-4 pt-10 pb-24 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ label: "Accueil", href: "/" }, { label: "Nous connaître" }]} />

        <h1 className="mt-8 text-5xl font-normal tracking-tight text-brand sm:text-6xl lg:text-7xl">
          Nous connaître
        </h1>

        <div className="mt-12 grid items-center gap-12 lg:mt-16 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:gap-16">
          {/* Image principale, une seconde image dépasse en retrait sur la gauche */}
          <div className="relative lg:ps-16 xl:ps-24">
            <div className="absolute top-1/2 left-0 hidden h-3/5 w-24 -translate-y-1/2 overflow-hidden lg:block xl:w-32">
              <Image
                src="/home/ladefense.jpg"
                alt=""
                fill
                sizes="8rem"
                className="object-cover"
              />
            </div>
            <div className="relative aspect-[16/9] overflow-hidden">
              <Image
                src="/home/nousconnaitre.jpg"
                alt="L’équipe superentreprise"
                fill
                priority
                sizes="(min-width: 1024px) 60vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>

          <div className="max-w-md text-brand">
            <p className="text-2xl leading-snug tracking-tight sm:text-3xl">
              superentreprise est un cabinet de conseil indépendant, entièrement
              dédié à la transmission d’entreprise.
            </p>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              Cession, acquisition, transmission familiale : nous accompagnons
              les dirigeants de PME et leurs repreneurs, de la première
              évaluation jusqu’à la signature, avec un interlocuteur unique et
              une parfaite confidentialité.
            </p>
          </div>
        </div>
      </section>

      <FeatureGrid
        eyebrow="Nos engagements"
        title="Ce qui guide notre accompagnement"
        features={[
          {
            title: "Indépendance",
            description:
              "Nous ne dépendons d’aucun réseau bancaire ni d’aucun groupe. Nos recommandations ont un seul objectif : servir les intérêts de nos clients.",
          },
          {
            title: "Confidentialité",
            description:
              "Une transmission se prépare dans la discrétion. Chaque information est partagée au bon moment, avec les bons interlocuteurs, pour protéger vos équipes et vos clients.",
          },
          {
            title: "Proximité",
            description:
              "Implantés à Perpignan, en région parisienne et à Lyon, nous connaissons le tissu économique local et restons joignables à chaque étape de votre projet.",
          },
          {
            title: "Exigence",
            description:
              "Évaluation, recherche de contreparties, négociation, closing : chaque étape est menée avec méthode et rigueur, jusqu’à la réussite de l’opération.",
          },
        ]}
      />
    </main>
  );
}
