import Image from "next/image";
import Link from "next/link";

// En-tête plein écran de la page Carrières : image, voile sombre, logo,
// titre et deux boutons. data-hero : la navbar reste sombre au-dessus.
export const CareersHero = () => (
  <section data-hero className="relative h-svh min-h-[560px] w-full overflow-hidden">
    <Image
      src="/carriere/carriere1.jpg"
      alt=""
      fill
      priority
      sizes="100vw"
      className="object-cover"
    />
    <div aria-hidden="true" className="absolute inset-0 bg-black/45" />

    <div className="relative flex h-full flex-col items-center justify-center px-4 text-center text-white">
      <Image
        src="/logo.svg"
        alt=""
        width={64}
        height={64}
        className="size-14 brightness-0 invert sm:size-16"
      />
      <h1 className="mt-10 max-w-4xl text-4xl font-semibold leading-tight tracking-tight text-shadow-lg sm:text-5xl lg:text-6xl">
        superentreprise est la somme des talents de tous ses collaborateurs
      </h1>
      <div className="mt-12 flex flex-col gap-4 sm:flex-row">
        <Link
          href="/carrieres/etudiants"
          className="flex h-12 items-center justify-center border border-white bg-white px-8 text-sm font-medium uppercase tracking-wide text-brand transition-colors hover:bg-white/90"
        >
          Étudiants et jeunes diplômés
        </Link>
        <Link
          href="/carrieres/experimentes"
          className="flex h-12 items-center justify-center border border-white px-8 text-sm font-medium uppercase tracking-wide text-white transition-colors hover:bg-white hover:text-brand"
        >
          Profils expérimentés
        </Link>
      </div>
    </div>
  </section>
);
