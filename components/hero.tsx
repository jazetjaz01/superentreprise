import Image from "next/image";
import { useTranslations } from "next-intl";
import { OAuthButtons } from "@/components/oauth-buttons";
import { Link } from "@/i18n/navigation";

const legalLink = (chunks: React.ReactNode) => (
  <Link href="#" className="font-semibold text-blue-700 hover:underline">
    {chunks}
  </Link>
);

export default function Hero() {
  const t = useTranslations("Hero");

  return (
    <section className="mx-auto grid w-full max-w-(--breakpoint-xl) flex-1 items-center gap-12 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:px-8">
      <div className="mx-auto w-full max-w-md lg:mx-0 lg:max-w-xl">
        <h1 className="text-4xl leading-[1.2] font-medium tracking-tight md:text-5xl lg:text-[3.25rem]">
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
              className="font-semibold text-blue-700 hover:underline"
            >
              {t("signUp")}
            </Link>
          </p>
        </div>
      </div>

      <Image
        src="/hero-illustration.svg"
        alt=""
        aria-hidden="true"
        width={800}
        height={700}
        priority
        className="mx-auto h-auto w-full max-w-xl"
      />
    </section>
  );
}
