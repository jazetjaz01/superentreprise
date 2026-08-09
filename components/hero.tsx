"use client";

import { ArrowUpRight, CirclePlay } from "lucide-react";
import { useLayoutEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Audience = "acheteur" | "vendeur";

const content: Record<
  Audience,
  { title: React.ReactNode; description: string; cta: string }
> = {
  acheteur: {
    title: (
      <>
        Vous souhaitez acheter <br /> une  entreprise ?
      </>
    ),
    description:
      "Superentreprise est le spécialiste français d'annonces de vente et achat d'entreprises, TPE, PME, commerces, fonds de commerce, immobilier entreprise et franchises.",
    cta: "Voir les annonces",
  },
  vendeur: {
    title: (
      <>
        Vous souhaitez vendre <br /> une entreprise ?
      </>
    ),
    description:
      "Publiez votre annonce et trouvez le bon repreneur pour votre entreprise, commerce, fonds de commerce ou franchise.",
    cta: "Déposer une annonce",
  },
};

export default function Hero() {
  const [audience, setAudience] = useState<Audience>("acheteur");
  const active = content[audience];

  const acheteurRef = useRef<HTMLButtonElement>(null);
  const vendeurRef = useRef<HTMLButtonElement>(null);
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });

  useLayoutEffect(() => {
    const el = audience === "acheteur" ? acheteurRef.current : vendeurRef.current;
    if (el) {
      setIndicator({ left: el.offsetLeft, width: el.offsetWidth });
    }
  }, [audience]);

  return (
    <div className="flex items-center justify-center px-6 pt-12 pb-20 ">
      <div className="mx-auto grid w-full max-w-(--breakpoint-2xl) gap-16 lg:grid-cols-2">
        <div>
          <div className="relative inline-flex items-center gap-1 rounded-full bg-muted p-1 text-sm font-semibold">
            <div
              className="absolute top-1 bottom-1 rounded-full border border-border bg-background shadow-sm transition-[left,width] duration-300 ease-out"
              style={{ left: indicator.left, width: indicator.width }}
            />
            <button
              ref={acheteurRef}
              type="button"
              onClick={() => setAudience("acheteur")}
              className={cn(
                "relative z-10 rounded-full px-4 py-1.5 uppercase transition-colors duration-300",
                audience === "acheteur"
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              Acheteurs
            </button>
            <button
              ref={vendeurRef}
              type="button"
              onClick={() => setAudience("vendeur")}
              className={cn(
                "relative z-10 rounded-full px-4 py-1.5 uppercase transition-colors duration-300",
                audience === "vendeur"
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              Vendeurs
            </button>
          </div>

          <div key={audience} className="animate-in fade-in slide-in-from-bottom-1 duration-300">
            <h1 className="mt-6 max-w-[17ch] font-semibold text-3xl leading-[1.2]! tracking-[-0.04em] md:text-4xl lg:text-[2.75rem] xl:text-[3.25rem]">
              {active.title}
            </h1>
            <p className="mt-4 max-w-[60ch]  text-lg sm:mt-6 sm:text-base/normal text-justify">
              {active.description}
            </p>
            <div className="mt-8 flex items-center gap-4 sm:mt-12">
              <Button className="rounded-full" size="lg">
                {active.cta} <ArrowUpRight className="h-5! w-5!" />
              </Button>
              <Button
                className="rounded-full shadow-none"
                size="lg"
                variant="outline"
              >
                <CirclePlay className="h-5! w-5!" /> Watch Demo
              </Button>
            </div>
          </div>
        </div>
        <video
          className="mt-auto aspect-video w-full rounded-xl bg-accent object-cover"
          src="/video/video.mp4"
          autoPlay
          loop
          muted
          playsInline
        />
      </div>
    </div>
  );
}
