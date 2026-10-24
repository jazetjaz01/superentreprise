import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getCategories } from "@/lib/articles";
import { ArticleList } from "@/components/actualite/article-list";

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata(
  props: PageProps<"/actualite/categorie/[slug]">
): Promise<Metadata> {
  const { slug } = await props.params;
  const category = (await getCategories()).find((c) => c.slug === slug);
  return { title: category ? `${category.name} · Actualité` : "Actualité" };
}

async function CategoryArticles(props: PageProps<"/actualite/categorie/[slug]">) {
  const { slug } = await props.params;
  const category = (await getCategories()).find((c) => c.slug === slug);
  if (!category) notFound();
  return <ArticleList categorySlug={slug} />;
}

export default function CategoryPage(props: PageProps<"/actualite/categorie/[slug]">) {
  // params est lu dans le Suspense (catégories ajoutées après le build)
  return (
    <Suspense fallback={<div className="flex-1" />}>
      <CategoryArticles {...props} />
    </Suspense>
  );
}
