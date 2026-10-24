import Link from "next/link";
import { Pencil } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";

// Visible uniquement par l'auteur (writer) de l'article.
// Lit la session : à placer dans un <Suspense> (le reste de la page reste en cache).
export async function EditArticleLink({
  articleId,
  authorId,
}: {
  articleId: string;
  authorId: string | undefined;
}) {
  const user = await getCurrentUser();
  if (!user || user.role !== "writer" || user.id !== authorId) return null;

  return (
    <Link
      href={`/compte/articles/${articleId}`}
      className="inline-flex items-center gap-2 border border-brand px-4 py-2 text-xs font-medium uppercase tracking-wide text-brand transition-colors hover:bg-brand hover:text-white"
    >
      <Pencil className="size-3.5" />
      Modifier l’article
    </Link>
  );
}
