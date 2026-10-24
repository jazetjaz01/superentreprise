import type { Metadata } from "next";
import { ArticleList } from "@/components/actualite/article-list";

export const metadata: Metadata = {
  title: "Actualité",
  description:
    "Articles et actualités de superentreprise sur la transmission, la cession et le financement d’entreprise.",
};

export default function ActualitePage() {
  return <ArticleList />;
}
