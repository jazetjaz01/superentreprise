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
    <section className="mx-auto grid w-full max-w-(--breakpoint-xl) flex-1 items-stretch gap-4 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:gap-6 lg:px-8">
      <div className="flex flex-col justify-center rounded-2xl bg-muted p-8 sm:p-12 lg:p-16">
        <h1 className="text-3xl leading-[1.2] font-semibold tracking-tight md:text-4xl lg:text-[3.25rem]">
          {t("title")}
        </h1>
      </div>

      <div className="flex flex-col justify-center rounded-2xl bg-[#fdf8e8] p-8 sm:p-12 lg:p-16">
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
    </section>
  );
}
