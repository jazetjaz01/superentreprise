// Règles des candidatures, partagées par les formulaires et la Server Action
// (mêmes valeurs que les contraintes de la table et du bucket job-applications)

export const STUDENT_TYPES = ["Stage", "Alternance", "Premier emploi", "Candidature spontanée"] as const;
export const EXPERIENCED_TYPES = ["Poste expérimenté", "Candidature spontanée"] as const;

export const OPPORTUNITY_TYPES = [...new Set([...STUDENT_TYPES, ...EXPERIENCED_TYPES])];
export type OpportunityType = (typeof STUDENT_TYPES)[number] | (typeof EXPERIENCED_TYPES)[number];

export const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 Mo (limite du bucket)

export const ACCEPTED_FILES = {
  "application/pdf": "pdf",
  "application/msword": "doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
} as const;

export const ACCEPT_ATTRIBUTE = ".pdf,.doc,.docx," + Object.keys(ACCEPTED_FILES).join(",");
