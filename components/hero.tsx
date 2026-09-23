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
    <section className="mt-4 flex w-full flex-1 flex-col justify-center bg-muted lg:mt-6">
      <div className="mx-auto grid w-full max-w-(--breakpoint-xl) items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:gap-6 lg:px-8 lg:py-16">
        <h1 className="text-3xl leading-[1.2] font-semibold tracking-tight md:text-4xl lg:text-[3.25rem]">
          {t("title")}
        </h1>

        <div className="w-full max-w-md lg:justify-self-end">
          <OAuthButtons />

          <p className="mt-6 text-center text-xs leading-relaxed text-foreground">
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
    </section>
  );
}
