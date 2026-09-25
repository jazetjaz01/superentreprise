import Image from "next/image";
import { getFormatter, getTranslations } from "next-intl/server";

export const ArticleBanner = async () => {
  const t = await getTranslations("Articles");
  const format = await getFormatter();
  const monthYear = format.dateTime(new Date(), { month: "long", year: "numeric" });

  return (
    <div className="relative isolate h-40 w-full overflow-hidden sm:h-72">
      <Image
        src="/actualite/carte-monde.jpg"
        alt=""
        fill
        priority
        className="object-cover"
      />
      <div className="absolute inset-0 bg-white/55" />

      <div className="relative flex h-full flex-col items-center justify-center gap-4 px-4 text-center">
        <div className="flex items-center gap-2 rounded-full bg-white py-1.5 pr-4 pl-1.5 shadow-md">
          <span className="flex size-8 items-center justify-center rounded-full bg-sky-700">
            <Image src="/logose.svg" alt="" width={18} height={18} className="invert" />
          </span>
          <span className="text-sm font-bold text-foreground">{t("banner.label")}</span>
          <span className="rounded-md bg-amber-400 px-2 py-0.5 text-xs font-bold text-black capitalize">
            {monthYear}
          </span>
        </div>
        <p className="text-xl font-bold text-foreground sm:text-2xl">{t("banner.title")}</p>
      </div>
    </div>
  );
};
