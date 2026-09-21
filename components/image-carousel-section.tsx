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
    <section className="mx-auto w-full max-w-(--breakpoint-xl) px-4 pt-12 pb-0 sm:px-6 lg:px-8">
      <div className="grid gap-4 lg:grid-cols-2 lg:gap-6">
        <Carousel
          opts={{ loop: true }}
          aria-label={t("carouselLabel")}
          className="overflow-hidden rounded-2xl"
        >
          <CarouselContent className="ml-0">
            {slides.map(({ src, altKey }) => (
              <CarouselItem key={src} className="pl-0">
                <Image
                  src={src}
                  alt={t(altKey)}
                  width={2500}
                  height={2250}
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  loading="eager"
                  className="aspect-[10/9] w-full object-cover"
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

        <div className="flex flex-col justify-center rounded-2xl bg-[#fdf8e8] p-8 sm:p-12 lg:p-16">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            {t("title")}
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-foreground/80">
            {t("body")}
          </p>
        </div>
      </div>
    </section>
  );
}
