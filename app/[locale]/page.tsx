import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations("Home");

  return (
    <main className="flex flex-1 items-center justify-center p-6">
      <h1 className="text-center text-4xl font-semibold tracking-tight">
        {t("title")}
      </h1>
    </main>
  );
}
