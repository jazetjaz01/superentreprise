import { cache } from "react";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export const getOwnedAnnonce = cache(async (id: string) => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?next=/annonces/${id}`);
  }

  const { data: annonce } = await supabase
    .from("annonces")
    .select("*")
    .eq("id", id)
    .single();

  if (!annonce || annonce.author_id !== user.id) {
    notFound();
  }

  const { data: images } = await supabase
    .from("annonce_images")
    .select("*")
    .eq("annonce_id", id)
    .order("position", { ascending: true });

  return { annonce, images: images ?? [] };
});
