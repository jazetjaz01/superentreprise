"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function createDraftAnnonce() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/deposer-une-annonce");
  }

  const { data: annonce, error } = await supabase
    .from("annonces")
    .insert({
      author_id: user.id,
      title: "Nouvelle annonce",
      status: "brouillon",
    })
    .select("id")
    .single();

  if (error || !annonce) {
    throw new Error("Impossible de créer l'annonce.");
  }

  redirect(`/annonces/${annonce.id}/informations`);
}
