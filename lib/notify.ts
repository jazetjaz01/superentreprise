// Email de notification à chaque nouveau message de contact, via l'API Resend.
// Variables d'environnement (serveur uniquement, jamais NEXT_PUBLIC_) :
//   RESEND_API_KEY              clé API Resend (obligatoire pour envoyer)
//   CONTACT_NOTIFICATION_TO     destinataire (défaut : contact@superentreprise.com)
//   CONTACT_NOTIFICATION_FROM   expéditeur sur un domaine vérifié dans Resend
//                               (défaut : adresse de test Resend)

type ContactMessage = {
  subject: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  message: string;
};

export async function notifyNewContactMessage(msg: ContactMessage): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("[contact] RESEND_API_KEY absente : notification email non envoyée.");
    return;
  }

  // Texte brut : le contenu saisi par le visiteur n'est jamais interprété en HTML
  const text = [
    `Nouveau message reçu depuis le formulaire de contact.`,
    ``,
    `Objet : ${msg.subject}`,
    `Nom : ${msg.first_name} ${msg.last_name}`,
    `Email : ${msg.email}`,
    `Téléphone : ${msg.phone ?? "—"}`,
    ``,
    `Message :`,
    msg.message,
  ].join("\n");

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.CONTACT_NOTIFICATION_FROM ?? "superentreprise <onboarding@resend.dev>",
        to: process.env.CONTACT_NOTIFICATION_TO ?? "contact@superentreprise.com",
        reply_to: msg.email, // « Répondre » écrit directement au visiteur
        subject: `[Contact] ${msg.subject} — ${msg.first_name} ${msg.last_name}`,
        text,
      }),
    });
    if (!response.ok) {
      console.error("[contact] Échec de la notification email :", response.status, await response.text());
    }
  } catch (error) {
    // Le message est déjà enregistré : un échec d'email ne doit pas bloquer le visiteur
    console.error("[contact] Erreur lors de la notification email :", error);
  }
}
