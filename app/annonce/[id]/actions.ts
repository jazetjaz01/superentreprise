"use server";

import { redirect } from "next/navigation";
import { isProfileIdentified } from "@/lib/profile/is-identified";
import { createClient } from "@/lib/supabase/server";

export async function startConversation(formData: FormData) {
  const annonceId = String(formData.get("annonceId") ?? "");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?next=/annonce/${annonceId}`);
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("first_name, last_name, display_name")
    .eq("id", user.id)
    .single();

  if (!isProfileIdentified(profile)) {
    redirect(`/dashboard/profil?identity=required&next=/annonce/${annonceId}`);
  }

  const { data: annonce } = await supabase
    .from("annonces")
    .select("id, author_id")
    .eq("id", annonceId)
    .single();

  if (!annonce || annonce.author_id === user.id) {
    redirect(`/annonce/${annonceId}`);
  }

  const { data: existing } = await supabase
    .from("conversations")
    .select("id")
    .eq("annonce_id", annonceId)
    .eq("buyer_id", user.id)
    .maybeSingle();

  if (existing) {
    redirect(`/dashboard/messages/${existing.id}`);
  }

  const { data: conversation, error } = await supabase
    .from("conversations")
    .insert({
      annonce_id: annonceId,
      buyer_id: user.id,
      seller_id: annonce.author_id,
    })
    .select("id")
    .single();

  if (error || !conversation) {
    redirect(`/annonce/${annonceId}`);
  }

  redirect(`/dashboard/messages/${conversation.id}`);
}
