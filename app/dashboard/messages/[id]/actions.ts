"use server";

import { revalidatePath } from "next/cache";
import { isProfileIdentified } from "@/lib/profile/is-identified";
import { createClient } from "@/lib/supabase/server";

export async function sendMessage(
  _prevState: { error: string } | null,
  formData: FormData,
) {
  const conversationId = String(formData.get("conversationId") ?? "");
  const content = String(formData.get("content") ?? "").trim();

  if (!content) {
    return { error: "Le message ne peut pas être vide." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Vous devez être connecté." };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("first_name, last_name, display_name")
    .eq("id", user.id)
    .single();

  if (!isProfileIdentified(profile)) {
    return {
      error:
        "Complétez votre nom et prénom (ou un surnom) dans votre profil avant d'envoyer un message.",
    };
  }

  const { error } = await supabase.from("messages").insert({
    conversation_id: conversationId,
    sender_id: user.id,
    content,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/dashboard/messages/${conversationId}`);

  return { error: "" };
}

export async function deleteMessage(formData: FormData) {
  const messageId = String(formData.get("messageId") ?? "");
  const conversationId = String(formData.get("conversationId") ?? "");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return;
  }

  await supabase
    .from("messages")
    .delete()
    .eq("id", messageId)
    .eq("sender_id", user.id);

  revalidatePath(`/dashboard/messages/${conversationId}`);
}
