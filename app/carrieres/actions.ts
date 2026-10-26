"use server";

import {
  ACCEPTED_FILES,
  MAX_FILE_SIZE,
  OPPORTUNITY_TYPES,
  type OpportunityType,
} from "@/lib/job-applications";
import { notifyNewJobApplication } from "@/lib/notify";
import { createClient } from "@/lib/supabase/server";

export type ApplicationState = { error?: string; success?: boolean } | undefined;

const read = (formData: FormData, key: string) => String(formData.get(key) ?? "").trim();

// Signature binaire attendue selon le format (refuse un fichier simplement renommé)
function hasValidSignature(bytes: Uint8Array, extension: string) {
  const startsWith = (...sig: number[]) => sig.every((b, i) => bytes[i] === b);
  if (extension === "pdf") return startsWith(0x25, 0x50, 0x44, 0x46); // %PDF
  if (extension === "docx") return startsWith(0x50, 0x4b, 0x03, 0x04); // ZIP (Office Open XML)
  if (extension === "doc") return startsWith(0xd0, 0xcf, 0x11, 0xe0); // OLE (Word 97-2003)
  return false;
}

type CheckedFile = { extension: string; bytes: Buffer; type: string; name: string };

async function checkFile(
  value: FormDataEntryValue | null,
  label: string,
  required: boolean
): Promise<{ file?: CheckedFile; error?: string }> {
  if (!(value instanceof File) || value.size === 0) {
    return required ? { error: `Veuillez joindre votre ${label}.` } : {};
  }
  const extension = ACCEPTED_FILES[value.type as keyof typeof ACCEPTED_FILES];
  const nameExtension = value.name.split(".").pop()?.toLowerCase();
  if (!extension || nameExtension !== extension) {
    return { error: `Votre ${label} doit être au format PDF ou Word (.doc, .docx).` };
  }
  if (value.size > MAX_FILE_SIZE) {
    return { error: `Votre ${label} ne doit pas dépasser 2 Mo.` };
  }
  const bytes = Buffer.from(await value.arrayBuffer());
  if (!hasValidSignature(bytes, extension)) {
    return { error: `Votre ${label} semble endommagé ou n’est pas un vrai fichier PDF / Word.` };
  }
  return { file: { extension, bytes, type: value.type, name: value.name } };
}

export async function submitApplication(
  _state: ApplicationState,
  formData: FormData
): Promise<ApplicationState> {
  // Champ piège invisible : rempli uniquement par les robots de spam
  if (read(formData, "website")) return { success: true };

  const opportunityType = read(formData, "opportunity_type");
  const firstName = read(formData, "first_name");
  const lastName = read(formData, "last_name");
  const email = read(formData, "email").toLowerCase();
  const phone = read(formData, "phone") || null;
  const school = read(formData, "school") || null;
  const currentPosition = read(formData, "current_position") || null;
  const message = read(formData, "message") || null;

  if (!OPPORTUNITY_TYPES.includes(opportunityType as OpportunityType)) {
    return { error: "Veuillez choisir le type de poste recherché." };
  }
  if (!firstName || !lastName || firstName.length > 100 || lastName.length > 100) {
    return { error: "Veuillez indiquer votre prénom et votre nom." };
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || email.length > 254) {
    return { error: "Adresse e-mail invalide." };
  }
  if (
    (phone && phone.length > 30) ||
    (school && school.length > 200) ||
    (currentPosition && currentPosition.length > 200)
  ) {
    return { error: "Téléphone, formation ou poste actuel trop long." };
  }
  if (message && message.length > 3000) {
    return { error: "Votre message ne doit pas dépasser 3 000 caractères." };
  }
  if (formData.get("consent") !== "on") {
    return { error: "Veuillez accepter le traitement de vos données pour candidater." };
  }

  const cv = await checkFile(formData.get("cv"), "CV", true);
  if (cv.error) return { error: cv.error };
  const letter = await checkFile(formData.get("cover_letter"), "lettre de motivation", false);
  if (letter.error) return { error: letter.error };

  // Fichiers rangés dans un dossier propre à la candidature : « {uuid}/cv.pdf »
  const folder = crypto.randomUUID();
  const cvPath = `${folder}/cv.${cv.file!.extension}`;
  const letterPath = letter.file ? `${folder}/lettre.${letter.file.extension}` : null;

  // Bucket privé : envoi autorisé, lecture réservée au dashboard
  const supabase = await createClient();
  const uploads = [
    { path: cvPath, file: cv.file! },
    ...(letter.file && letterPath ? [{ path: letterPath, file: letter.file }] : []),
  ];
  for (const { path, file } of uploads) {
    const { error } = await supabase.storage
      .from("job-applications")
      .upload(path, file.bytes, { contentType: file.type });
    if (error) {
      console.error("[candidature] Envoi du fichier impossible :", error);
      return { error: "L’envoi de vos fichiers a échoué. Réessayez dans quelques instants." };
    }
  }

  const application = {
    opportunity_type: opportunityType,
    first_name: firstName,
    last_name: lastName,
    email,
    phone,
    school,
    current_position: currentPosition,
    message,
    cv_path: cvPath,
    cover_letter_path: letterPath,
  };
  const { error } = await supabase.from("job_applications").insert(application);
  if (error) {
    console.error("[candidature] Enregistrement impossible :", error);
    return { error: "L’enregistrement de votre candidature a échoué. Réessayez ou écrivez-nous." };
  }

  // Pièces jointes nommées lisiblement : « CV - Jean Dupont.pdf »
  const fullName = `${firstName} ${lastName}`.replace(/[^\p{L}\p{N} '-]/gu, "");
  await notifyNewJobApplication(application, [
    { filename: `CV - ${fullName}.${cv.file!.extension}`, content: cv.file!.bytes },
    ...(letter.file
      ? [
          {
            filename: `Lettre de motivation - ${fullName}.${letter.file.extension}`,
            content: letter.file.bytes,
          },
        ]
      : []),
  ]);

  return { success: true };
}
