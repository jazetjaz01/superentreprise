import Image from "next/image";
import Link from "next/link";

// Page Carrières : image en fond, panneau translucide flouté avec
// le texte à gauche et les deux accès aux offres à droite
export const CareersJobSearch = () => (
  <section className="mx-auto max-w-page px-4 py-20 sm:px-6 lg:px-8">
    <div className="relative overflow-hidden px-4 py-12 sm:p-12 lg:p-16">
      <Image
        src="/carriere/carriere3.jpg"
        alt=""
        fill
        sizes="(min-width: 1536px) 1472px, 100vw"
        className="object-cover"
      />

      <div className="relative grid gap-10 bg-black/15 p-8 text-white backdrop-blur-xl sm:p-12 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-16 lg:p-14">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Rechercher un emploi
          </h2>
          <p className="mt-5 max-w-3xl text-lg text-white/90">
            De nombreuses opportunités sont à pourvoir chez superentreprise :
            stage, alternance, CDI et CDD. N’hésitez pas à consulter nos offres et
            à nous transmettre votre candidature.
          </p>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row lg:flex-col">
          <Link
            href="/carrieres/etudiants"
            className="flex min-h-14 items-center border border-white bg-white px-8 py-3 text-sm font-medium uppercase tracking-wide text-brand transition-colors hover:bg-white/90 lg:w-72"
          >
            Étudiants et jeunes diplômés
          </Link>
          <Link
            href="#experimentes"
            className="flex min-h-14 items-center border border-white px-8 py-3 text-sm font-medium uppercase tracking-wide text-white transition-colors hover:bg-white hover:text-brand lg:w-72"
          >
            Profils expérimentés
          </Link>
        </div>
      </div>
    </div>
  </section>
);
