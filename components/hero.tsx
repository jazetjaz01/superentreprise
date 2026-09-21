import Image from "next/image";
import { useTranslations } from "next-intl";
import { OAuthButtons } from "@/components/oauth-buttons";
import { Link } from "@/i18n/navigation";

const legalLink = (chunks: React.ReactNode) => (
  <Link href="#" className="font-bold text-foreground hover:underline">
    {chunks}
  </Link>
);

export default function Hero() {
  const t = useTranslations("Hero");

  return (
    <section className="mx-auto grid w-full max-w-(--breakpoint-xl) flex-1 items-center gap-12 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:px-8">
      <div className="mx-auto w-full max-w-md lg:mx-0 lg:max-w-xl">
        <h1 className="text-3xl leading-[1.2] font-semibold tracking-tight md:text-4xl lg:text-[3.25rem]">
          {t("title")}
        </h1>

        <div className="mt-8 max-w-md">
          <OAuthButtons />

          <p className="mt-6 text-center text-xs leading-relaxed text-muted-foreground">
            {t.rich("legal", {
              terms: legalLink,
              privacy: legalLink,
              cookies: legalLink,
            })}
          </p>

          <p className="mt-10 text-center">
            {t("newHere")}{" "}
            <Link
              href="/auth/sign-up"
              className="font-bold text-foreground hover:underline"
            >
              {t("signUp")}
            </Link>
          </p>
        </div>
      </div>

      <Image
        src="/home/hero_1.jpg"
        alt=""
        aria-hidden="true"
        width={1746}
        height={1069}
        sizes="(min-width: 1024px) 50vw, 100vw"
        priority
        className="h-auto w-full self-start rounded-2xl"
      />
    </section>
  );
}
