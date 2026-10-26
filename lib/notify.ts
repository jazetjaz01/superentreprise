// Emails de notification (nouveau message de contact, nouvelle candidature) via l'API Resend.
// Variables d'environnement (serveur uniquement, jamais NEXT_PUBLIC_) :
//   RESEND_API_KEY              clé API Resend (obligatoire pour envoyer)
//   CONTACT_NOTIFICATION_TO     destinataire (défaut : contact@superentreprise.com)
//   CONTACT_NOTIFICATION_FROM   expéditeur sur un domaine vérifié dans Resend
//                               (défaut : adresse de test Resend)

type Attachment = { filename: string; content: Buffer };

async function sendNotificationEmail({
  subject,
  text,
  replyTo,
  attachments = [],
  logLabel,
}: {
  subject: string;
  text: string;
  replyTo: string;
  attachments?: Attachment[];
  logLabel: string;
}): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn(`[${logLabel}] RESEND_API_KEY absente : notification email non envoyée.`);
    return;
  }

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
        reply_to: replyTo, // « Répondre » écrit directement au visiteur
        subject,
        // Texte brut : le contenu saisi par le visiteur n'est jamais interprété en HTML
        text,
        attachments: attachments.map(({ filename, content }) => ({
          filename,
          content: content.toString("base64"),
        })),
      }),
    });
    if (!response.ok) {
      console.error(`[${logLabel}] Échec de la notification email :`, response.status, await response.text());
    }
  } catch (error) {
    // Les données sont déjà enregistrées : un échec d'email ne doit pas bloquer le visiteur
    console.error(`[${logLabel}] Erreur lors de la notification email :`, error);
  }
}

type ContactMessage = {
  subject: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  message: string;
};

export async function notifyNewContactMessage(msg: ContactMessage): Promise<void> {
  await sendNotificationEmail({
    logLabel: "contact",
    replyTo: msg.email,
    subject: `[Contact] ${msg.subject} — ${msg.first_name} ${msg.last_name}`,
    text: [
      `Nouveau message reçu depuis le formulaire de contact.`,
      ``,
      `Objet : ${msg.subject}`,
      `Nom : ${msg.first_name} ${msg.last_name}`,
      `Email : ${msg.email}`,
      `Téléphone : ${msg.phone ?? "—"}`,
      ``,
      `Message :`,
      msg.message,
    ].join("\n"),
  });
}

type JobApplication = {
  opportunity_type: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  school: string | null;
  current_position: string | null;
  message: string | null;
  cv_path: string;
  cover_letter_path: string | null;
};

export async function notifyNewJobApplication(
  application: JobApplication,
  attachments: Attachment[]
): Promise<void> {
  await sendNotificationEmail({
    logLabel: "candidature",
    replyTo: application.email,
    subject: `[Candidature] ${application.opportunity_type} — ${application.first_name} ${application.last_name}`,
    attachments,
    text: [
      `Nouvelle candidature reçue depuis le site.`,
      ``,
      `Type : ${application.opportunity_type}`,
      `Nom : ${application.first_name} ${application.last_name}`,
      `Email : ${application.email}`,
      `Téléphone : ${application.phone ?? "—"}`,
      ...(application.school ? [`École / formation : ${application.school}`] : []),
      ...(application.current_position ? [`Poste actuel / entreprise : ${application.current_position}`] : []),
      ``,
      `Message :`,
      application.message ?? "—",
      ``,
      `CV et lettre de motivation en pièces jointes.`,
      `Fichiers également disponibles dans Supabase Storage (bucket « job-applications ») :`,
      `- ${application.cv_path}`,
      application.cover_letter_path ? `- ${application.cover_letter_path}` : `- (pas de lettre de motivation)`,
    ].join("\n"),
  });
}
