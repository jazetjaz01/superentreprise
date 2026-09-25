import { Info } from "lucide-react";
import { getFormatter, getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";

type NewsArticle = {
  title: string;
  slug: string;
  created_at: string;
};

export const NewsSlot = async () => {
  const t = await getTranslations("News");
  const format = await getFormatter();
  const supabase = await createClient();

  const { data } = await supabase
    .from("articles")
    .select("title, slug, created_at")
    .order("created_at", { ascending: false })
    .limit(5)
    .overrideTypes<NewsArticle[], { merge: false }>();

  const articles = data ?? [];
  if (articles.length === 0) return null;

  return (
    <div className="overflow-hidden rounded-2xl border bg-white p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-foreground">{t("title")}</h2>
        <Info className="size-4 text-muted-foreground" />
      </div>
      <p className="mt-1 text-sm text-muted-foreground">{t("subtitle")}</p>

      <ul className="mt-3 flex flex-col gap-3">
        {articles.map((article) => (
          <li key={article.slug}>
            <Link href={`/articles/${article.slug}`} className="block group">
              <p className="line-clamp-2 text-sm font-semibold text-foreground group-hover:underline">
                {article.title}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {format.relativeTime(new Date(article.created_at))}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};
