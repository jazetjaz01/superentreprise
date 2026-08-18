"use server";

import { revalidatePath } from "next/cache";
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
