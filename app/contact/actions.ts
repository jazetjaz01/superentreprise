"use server";

import { CONTACT_SUBJECTS } from "@/lib/contact";
import { notifyNewContactMessage } from "@/lib/notify";
import { createClient } from "@/lib/supabase/server";

export type ContactState = { error?: string; success?: boolean } | undefined;

const read = (formData: FormData, key: string) => String(formData.get(key) ?? "").trim();

export async function sendContactMessage(
  _state: ContactState,
  formData: FormData
): Promise<ContactState> {
  // Champ piège invisible : rempli uniquement par les robots de spam
  if (read(formData, "website")) return { success: true };

  const message = {
    subject: read(formData, "subject"),
    first_name: read(formData, "first_name"),
    last_name: read(formData, "last_name"),
    email: read(formData, "email").toLowerCase(),
    phone: read(formData, "phone") || null,
    message: read(formData, "message"),
  };

  if (!CONTACT_SUBJECTS.includes(message.subject as (typeof CONTACT_SUBJECTS)[number])) {
    return { error: "Veuillez sélectionner l’objet de votre demande." };
  }
  if (!message.first_name || !message.last_name) {
    return { error: "Veuillez indiquer votre prénom et votre nom." };
  }
  if (message.first_name.length > 100 || message.last_name.length > 100) {
    return { error: "Prénom ou nom trop long." };
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(message.email) || message.email.length > 254) {
    return { error: "Adresse e-mail invalide." };
  }
  if (message.phone && message.phone.length > 30) {
    return { error: "Numéro de téléphone invalide." };
  }
  if (message.message.length < 10 || message.message.length > 5000) {
    return { error: "Votre message doit contenir entre 10 et 5 000 caractères." };
  }
  if (formData.get("terms") !== "on") {
    return { error: "Veuillez accepter les conditions générales." };
  }

  // La RLS autorise l'insertion pour tous, sans lecture (pas de .select())
  const supabase = await createClient();
  const { error } = await supabase.from("contact_messages").insert(message);
  if (error) {
    console.error("[contact] Enregistrement impossible :", error);
    return { error: "L’envoi a échoué. Réessayez ou écrivez-nous par e-mail." };
  }

  await notifyNewContactMessage(message);
  return { success: true };
}
