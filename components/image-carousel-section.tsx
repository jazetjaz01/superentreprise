import { useTranslations } from "next-intl";

export default function ImageCarouselSection() {
  const t = useTranslations("ImageCarouselSection");

  return (
    <section className="mx-auto w-full max-w-(--breakpoint-xl) px-4 pt-16 pb-0 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl text-center ">
        <h2 className="font-heading text-4xl leading-[1.15] font-normal text-foreground md:text-8xl ">
          {t("title")}
          <br />
          <span className="text-primary ">{t("titleAccent")}</span>
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-foreground">
          {t("body")}
        </p>
      </div>

      <div className="mt-12 overflow-hidden rounded-md">
        {/* eslint-disable-next-line jsx-a11y/media-has-caption -- decorative autoplaying background video */}
        <video
          src="/home/video-home.mp4"
          autoPlay
          muted
          playsInline
          className="aspect-16/8 w-full object-cover"
        />
      </div>
    </section>
  );
}
