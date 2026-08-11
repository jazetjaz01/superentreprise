import { redirect } from "next/navigation";
import { ArticleForm } from "./article-form";
import { getCurrentUserAdminStatus } from "@/lib/actualite/is-admin";
import { createClient } from "@/lib/supabase/server";

export default async function NouvelArticlePage() {
  const { user, isAdmin } = await getCurrentUserAdminStatus();

  if (!user) {
    redirect("/login?next=/actualite/nouveau");
  }
  if (!isAdmin) {
    redirect("/actualite");
  }

  const supabase = await createClient();
  const { data: categories } = await supabase
    .from("actualite_categories")
    .select("*")
    .order("name");

  return (
    <div className="mx-auto max-w-(--breakpoint-xl) px-6 py-16 xl:px-0">
      <ArticleForm categories={categories ?? []} />
    </div>
  );
}
