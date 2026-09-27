import Image from "next/image";
import { useTranslations } from "next-intl";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const slides = [
  { src: "/home/paper-se_1.jpg", altKey: "slide1Alt" },
  { src: "/home/paper-se_2.jpg", altKey: "slide2Alt" },
  { src: "/home/paper-se_3.jpg", altKey: "slide3Alt" },
] as const;

const arrowClassName =
  "size-10 border-0 bg-white/80 text-foreground shadow-sm hover:bg-white";

export default function ImageCarouselSection() {
  const t = useTranslations("ImageCarouselSection");

  return (
    <section className="mx-auto w-full max-w-(--breakpoint-xl) px-4 pt-16 pb-0 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl text-center ">
        <h2 className="font-heading text-4xl leading-[1.15] font-semibold tracking-tight text-foreground md:text-8xl ">
          {t("title")}
          <br />
          <span className="text-primary ">{t("titleAccent")}</span>
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-foreground">
          {t("body")}
        </p>
      </div>

      <Carousel
        opts={{ loop: true }}
        aria-label={t("carouselLabel")}
        className="mt-12 overflow-hidden rounded-2xl"
      >
        <CarouselContent className="ml-0">
          {slides.map(({ src, altKey }) => (
            <CarouselItem key={src} className="pl-0">
              <Image
                src={src}
                alt={t(altKey)}
                width={2500}
                height={1400}
                sizes="100vw"
                loading="eager"
                className="aspect-16/8 w-full object-cover"
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious
          aria-label={t("previous")}
          className={`${arrowClassName} left-3`}
        />
        <CarouselNext
          aria-label={t("next")}
          className={`${arrowClassName} right-3`}
        />
      </Carousel>
    </section>
  );
}
