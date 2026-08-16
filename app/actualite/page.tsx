import Link from "next/link";
import Actualite, { formatActualiteDate, type ActualitePost } from "@/components/actualite";
import { Button } from "@/components/ui/button";
import { getCurrentUserAdminStatus } from "@/lib/actualite/is-admin";
import { getDisplayName } from "@/lib/profile/display-name";
import { createClient } from "@/lib/supabase/server";

export default async function ActualitePage() {
  const supabase = await createClient();
  const { isAdmin } = await getCurrentUserAdminStatus();

  const { data: articles } = await supabase
    .from("actualite_articles")
    .select("*, actualite_categories(name)")
    .eq("status", "publie")
    .order("published_at", { ascending: false });

  const authorIds = [...new Set((articles ?? []).map((article) => article.author_id))];
  const { data: authors } = await supabase
    .from("public_profiles")
    .select("*")
    .in("id", authorIds.length > 0 ? authorIds : [""]);
  const authorsById = new Map((authors ?? []).map((author) => [author.id, author]));

  const posts: ActualitePost[] = (articles ?? []).map((article) => {
    const author = authorsById.get(article.author_id);
    const authorName = getDisplayName(author, "Superentreprise");

    return {
      id: article.id,
      slug: article.slug,
      title: article.title,
      category: article.actualite_categories?.name ?? null,
      author: authorName,
      authorImage: author?.avatar_url ?? null,
      date: formatActualiteDate(article.published_at ?? article.created_at),
      image: article.cover_image_path
        ? supabase.storage
            .from("actualite-images")
            .getPublicUrl(article.cover_image_path).data.publicUrl
        : null,
    };
  });

  return (
    <div>
      {isAdmin && (
        <div className="mx-auto flex max-w-(--breakpoint-xl) justify-end px-6 pt-8 xl:px-0">
          <Button render={<Link href="/actualite/nouveau" />} nativeButton={false} className="rounded-full">
            Nouvel article
          </Button>
        </div>
      )}
      <Actualite posts={posts} />
    </div>
  );
}
