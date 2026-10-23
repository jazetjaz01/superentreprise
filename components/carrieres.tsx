"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

type Slide = {
  title: string;
  description: string;
  // Images provisoires : à remplacer par des photos dédiées (portrait 3:4, ex. 1200 × 1600 px)
  image: string;
  cta: { href: string; label: string };
};

const slides: Slide[] = [
  {
    title: "Rejoignez des entrepreneurs au service des entrepreneurs",
    description:
      "Chez superentreprise, chaque collaborateur accompagne des dirigeants dans l’un des moments les plus importants de leur vie professionnelle. Une mission exigeante, humaine et porteuse de sens.",
    image: "/home/carriere1.jpg",
    cta: { href: "#", label: "Carrières" },
  },
  {
    title: "Des profils expérimentés",
    description:
      "Vous avez une expérience en fusions-acquisitions, en finance d’entreprise, en droit ou en conseil ? Mettez votre expertise au service des cédants et des repreneurs.",
    image: "/home/carriere2.jpg",
    cta: { href: "#", label: "Voir les offres" },
  },
  {
    title: "Étudiants et jeunes diplômés",
    description:
      "Stages et alternances : apprenez aux côtés d’experts de la transmission et participez concrètement à des opérations dès vos premiers jours.",
    image: "/home/process3.jpg",
    cta: { href: "#", label: "Stages et alternances" },
  },
  {
    title: "Candidature spontanée",
    description:
      "Vous ne trouvez pas l’offre qui vous correspond ? Envoyez-nous votre candidature, nous serons ravis d’échanger avec vous.",
    image: "/home/nousconnaitre.jpg",
    cta: { href: "/contact", label: "Nous écrire" },
  },
];

// La vignette de droite montre la diapositive suivante : même piste, décalée d'un cran
const previewSlides = [...slides.slice(1), slides[0]];

const pad = (n: number) => String(n).padStart(2, "0");

const ImageTrack = ({
  items,
  index,
  sizes,
}: {
  items: Slide[];
  index: number;
  sizes: string;
}) => (
  <div
    className="flex h-full transition-transform duration-700 ease-in-out"
    style={{ transform: `translateX(-${index * 100}%)` }}
  >
    {items.map(({ image }, i) => (
      <div key={i} className="relative h-full w-full shrink-0">
        <Image src={image} alt="" fill sizes={sizes} className="object-cover" />
      </div>
    ))}
  </div>
);

export const Carrieres = () => {
  const [index, setIndex] = useState(0);
  const slide = slides[index];
  const go = (step: number) =>
    setIndex((i) => (i + step + slides.length) % slides.length);

  return (
    <section
      aria-roledescription="carrousel"
      aria-label="Carrières"
      className="bg-brand text-white"
    >
      <div className="mx-auto grid max-w-page items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-12 lg:gap-16 lg:px-8">
        <div className="relative aspect-[3/4] overflow-hidden lg:col-span-4">
          <ImageTrack
            items={slides}
            index={index}
            sizes="(min-width: 1024px) 33vw, 100vw"
          />
        </div>

        <div className="lg:col-span-5">
          <p className="flex items-center gap-6 text-base">
            <span>
              {pad(index + 1)} / {pad(slides.length)}
            </span>
            <span className="h-px w-12 bg-white" />
            Travailler chez superentreprise
          </p>

          <div
            key={index}
            aria-live="polite"
            className="animate-in fade-in slide-in-from-bottom-2 duration-500"
          >
            <h2 className="mt-8 text-3xl font-semibold tracking-tight sm:text-4xl">
              {slide.title}
            </h2>
            <p className="mt-6 text-white/85">{slide.description}</p>
            <Link
              href={slide.cta.href}
              className="mt-8 inline-flex h-12 items-center bg-white px-8 text-sm font-medium uppercase tracking-wide text-brand transition-colors hover:bg-white/90"
            >
              {slide.cta.label}
            </Link>
          </div>

          <div className="mt-12 flex gap-4">
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Diapositive précédente"
              className="p-1 transition-transform hover:-translate-x-0.5"
            >
              <ArrowLeft className="size-5" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Diapositive suivante"
              className="p-1 transition-transform hover:translate-x-0.5"
            >
              <ArrowRight className="size-5" />
            </button>
          </div>
        </div>

        <div className="relative hidden aspect-[4/5] self-end overflow-hidden lg:col-span-3 lg:block">
          <ImageTrack items={previewSlides} index={index} sizes="25vw" />
        </div>
      </div>
    </section>
  );
};
