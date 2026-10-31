"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";

type ApproachItem = { title: string; description: string; image: string };

// Bloc « Notre approche » : titre, introduction sur deux colonnes, puis cartes
// défilant horizontalement (flèches, glisser au doigt ou molette).
// Les cartes partent de l'alignement du contenu et débordent jusqu'au bord droit.
export const ApproachCarousel = ({
  title,
  lead,
  aside,
  items,
}: {
  title: string;
  lead: React.ReactNode;
  aside?: React.ReactNode;
  items: ApproachItem[];
}) => {
  const trackRef = useRef<HTMLUListElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const updateArrows = () => {
    const track = trackRef.current;
    if (!track) return;
    setCanPrev(track.scrollLeft > 1);
    setCanNext(track.scrollLeft + track.clientWidth < track.scrollWidth - 1);
  };

  useEffect(() => {
    updateArrows();
    window.addEventListener("resize", updateArrows);
    return () => window.removeEventListener("resize", updateArrows);
  }, []);

  // Avance d'une carte (largeur + espacement)
  const scroll = (direction: 1 | -1) => {
    const track = trackRef.current;
    const card = track?.firstElementChild as HTMLElement | null;
    if (!track || !card) return;
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    track.scrollBy({ left: direction * (card.offsetWidth + gap), behavior: "smooth" });
  };

  const arrowClassName =
    "rounded-full p-2 text-brand transition-colors hover:bg-brand/5 disabled:cursor-default disabled:text-brand/30 disabled:hover:bg-transparent";

  return (
    <section className="py-24">
      <div className="mx-auto max-w-page px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-normal tracking-tight text-brand sm:text-5xl">{title}</h2>

        <div className="mt-12 grid gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="space-y-6 text-xl leading-snug text-brand sm:text-2xl">{lead}</div>
          {aside && <div className="leading-relaxed text-muted-foreground">{aside}</div>}
        </div>

        <div className="mt-16 flex justify-end gap-2">
          <button
            type="button"
            onClick={() => scroll(-1)}
            disabled={!canPrev}
            aria-label="Cartes précédentes"
            className={arrowClassName}
          >
            <ArrowLeft className="size-5" />
          </button>
          <button
            type="button"
            onClick={() => scroll(1)}
            disabled={!canNext}
            aria-label="Cartes suivantes"
            className={arrowClassName}
          >
            <ArrowRight className="size-5" />
          </button>
        </div>
      </div>

      {/* Marge gauche alignée sur le conteneur max-w-page (96rem) et ses gouttières */}
      <ul
        ref={trackRef}
        onScroll={updateArrows}
        className="mt-6 flex snap-x snap-mandatory gap-8 overflow-x-auto pb-4 [--gutter:1rem] [scrollbar-width:none] sm:[--gutter:1.5rem] lg:[--gutter:2rem] [&::-webkit-scrollbar]:hidden ps-[max(var(--gutter),calc((100%-96rem)/2+var(--gutter)))] pe-(--gutter) scroll-ps-[max(var(--gutter),calc((100%-96rem)/2+var(--gutter)))]"
      >
        {items.map(({ title, description, image }) => (
          <li key={title} className="w-[80vw] max-w-sm shrink-0 snap-start sm:w-[22rem] lg:max-w-none lg:w-[26rem]">
            <div className="relative aspect-[16/9] overflow-hidden">
              <Image src={image} alt="" fill sizes="26rem" className="object-cover" />
            </div>
            <h3 className="mt-6 text-2xl tracking-tight text-brand">{title}</h3>
            <p className="mt-2 leading-relaxed text-muted-foreground">{description}</p>
          </li>
        ))}
      </ul>
    </section>
  );
};
