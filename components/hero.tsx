import { ArrowUpRight, CirclePlay } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <div className="flex items-center justify-center px-6 pt-12 pb-20 ">
      <div className="mx-auto grid w-full max-w-(--breakpoint-2xl) gap-16 lg:grid-cols-2">
        <div>
          <Badge className="rounded-full border-border py-1" variant="secondary" render={<Link href="#" />}>Just released v1.0.0 <ArrowUpRight className="ml-1 size-4" /></Badge>
          <h1 className="mt-6 max-w-[17ch] font-semibold text-4xl leading-[1.2]! tracking-[-0.04em] md:text-5xl lg:text-[2.75rem] xl:text-[3.25rem]">
            Vous cherchez à <br />acheter 
            une super <br /> entreprise ?
          </h1>
          <p className="mt-4 max-w-[60ch]  text-lg sm:mt-6 sm:text-xl/normal">
            Superentreprise est le spécialiste  français d'annonces de vente et achat d'entreprises, TPE, PME, commerces, fonds de commerce, immobilier entreprise et franchises.
          </p>
          <div className="mt-8 flex items-center gap-4 sm:mt-12">
            <Button className="rounded-full" size="lg">
              Get Started <ArrowUpRight className="h-5! w-5!" />
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
