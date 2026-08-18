"use client";

import { ArrowUpRight, CirclePlay } from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Audience = "acheteur" | "vendeur";

const videos = ["/video/video.mp4", "/video/video1.mp4", "/video/video2.mp4"];

const content: Record<
  Audience,
  { title: React.ReactNode; description: string; cta: string }
> = {
  acheteur: {
    title: (
      <>
        Vous voulez acheter <br /> une  entreprise ?
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
      "Superentreprise est le spécialiste français d'annonces de vente et achat d'entreprises, TPE, PME, commerces, fonds de commerce, immobilier entreprise et franchises.",
    cta: "Créer une annonce",
  },
};

export default function Hero() {
  const [audience, setAudience] = useState<Audience>("acheteur");
  const active = content[audience];

  const acheteurRef = useRef<HTMLButtonElement>(null);
  const vendeurRef = useRef<HTMLButtonElement>(null);
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });
  const [videoSrc, setVideoSrc] = useState(videos[0]);

  useEffect(() => {
    setVideoSrc(videos[Math.floor(Math.random() * videos.length)]);
  }, []);

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
          <div className="relative inline-flex items-center gap-1 rounded-full bg-rose-100/30 p-1 text-xs">
            <div
              className="absolute top-1 bottom-1 rounded-full border-2  bg-background  transition-[left,width] duration-300 ease-out"
              style={{ left: indicator.left, width: indicator.width }}
            />
            <button
              ref={acheteurRef}
              type="button"
              onClick={() => setAudience("acheteur")}
              className={cn(
                "relative z-10 rounded-full px-4 py-2 uppercase transition-colors duration-300 ",
                audience === "acheteur"
                  ? "font-semibold text-foreground"
                  : "font-semibold  hover:text-foreground text-pink-900/50",
              )}
            >
              Acheteurs
            </button>
            <button
              ref={vendeurRef}
              type="button"
              onClick={() => setAudience("vendeur")}
              className={cn(
                "relative z-10 rounded-full px-4 py-2 uppercase transition-colors duration-300 ",
                audience === "vendeur"
                  ? "font-semibold text-foreground"
                  : "font-semibold  hover:text-foreground text-pink-900/50",
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
          key={videoSrc}
          className="mt-auto aspect-video w-full rounded-xl bg-accent object-cover"
          src={videoSrc}
          autoPlay
          loop
          muted
          playsInline
        />
      </div>
    </div>
  );
}
