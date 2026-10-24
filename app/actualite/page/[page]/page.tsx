import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getArticlesPage } from "@/lib/articles";
import { pageParams, parsePageParam } from "@/lib/page-param";
import { ArticleList } from "@/components/actualite/article-list";

export async function generateStaticParams() {
  const { totalPages } = await getArticlesPage(undefined, 1);
  return pageParams(totalPages);
}

export async function generateMetadata(
  props: PageProps<"/actualite/page/[page]">
): Promise<Metadata> {
  const { page } = await props.params;
  return { title: `Actualité · page ${page}` };
}

async function ArticlesPage(props: PageProps<"/actualite/page/[page]">) {
  const page = parsePageParam((await props.params).page);
  if (!page) notFound();
  return <ArticleList page={page} />;
}

export default function ActualitePaginatedPage(props: PageProps<"/actualite/page/[page]">) {
  // params est lu dans le Suspense (pages créées après le build)
  return (
    <Suspense fallback={<div className="flex-1" />}>
      <ArticlesPage {...props} />
    </Suspense>
  );
}
