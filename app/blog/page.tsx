import Link from "next/link";
import Blog, { formatBlogDate, type BlogPost } from "@/components/blog";
import { Button } from "@/components/ui/button";
import { getCurrentUserAdminStatus } from "@/lib/blog/is-admin";
import { createClient } from "@/lib/supabase/server";

export default async function BlogPage() {
  const supabase = await createClient();
  const { isAdmin } = await getCurrentUserAdminStatus();

  const { data: articles } = await supabase
    .from("blog_articles")
    .select("*, blog_categories(name), profiles(first_name, last_name, avatar_url)")
    .eq("status", "publie")
    .order("published_at", { ascending: false });

  const posts: BlogPost[] = (articles ?? []).map((article) => {
    const author = article.profiles;
    const authorName =
      [author?.first_name, author?.last_name].filter(Boolean).join(" ") ||
      "Superentreprise";

    return {
      id: article.id,
      title: article.title,
      category: article.blog_categories?.name ?? null,
      author: authorName,
      authorImage: author?.avatar_url ?? null,
      date: formatBlogDate(article.published_at ?? article.created_at),
      image: article.cover_image_path
        ? supabase.storage.from("blog-images").getPublicUrl(article.cover_image_path)
            .data.publicUrl
        : null,
    };
  });

  return (
    <div>
      {isAdmin && (
        <div className="mx-auto flex max-w-(--breakpoint-xl) justify-end px-6 pt-8 xl:px-0">
          <Button render={<Link href="/blog/nouveau" />} nativeButton={false} className="rounded-full">
            Nouvel article
          </Button>
        </div>
      )}
      <Blog posts={posts} />
    </div>
  );
}
