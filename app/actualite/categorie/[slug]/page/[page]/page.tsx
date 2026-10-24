import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getArticlesPage, getCategories } from "@/lib/articles";
import { pageParams, parsePageParam } from "@/lib/page-param";
import { ArticleList } from "@/components/actualite/article-list";

export async function generateStaticParams({ params }: { params: { slug: string } }) {
  const { totalPages } = await getArticlesPage(params.slug, 1);
  return pageParams(totalPages);
}

export async function generateMetadata(
  props: PageProps<"/actualite/categorie/[slug]/page/[page]">
): Promise<Metadata> {
  const { slug, page } = await props.params;
  const category = (await getCategories()).find((c) => c.slug === slug);
  return { title: `${category?.name ?? "Actualité"} · page ${page}` };
}

async function CategoryArticlesPage(props: PageProps<"/actualite/categorie/[slug]/page/[page]">) {
  const { slug, page: pageParam } = await props.params;
  const page = parsePageParam(pageParam);
  const category = (await getCategories()).find((c) => c.slug === slug);
  if (!page || !category) notFound();
  return <ArticleList categorySlug={slug} page={page} />;
}

export default function CategoryPaginatedPage(
  props: PageProps<"/actualite/categorie/[slug]/page/[page]">
) {
  return (
    <Suspense fallback={<div className="flex-1" />}>
      <CategoryArticlesPage {...props} />
    </Suspense>
  );
}
