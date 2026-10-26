// Règles des candidatures, partagées par le formulaire et la Server Action
// (mêmes valeurs que les contraintes de la table et du bucket job-applications)

export const OPPORTUNITY_TYPES = [
  "Stage",
  "Alternance",
  "Premier emploi",
  "Candidature spontanée",
] as const;
export type OpportunityType = (typeof OPPORTUNITY_TYPES)[number];

export const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 Mo (limite du bucket)

export const ACCEPTED_FILES = {
  "application/pdf": "pdf",
  "application/msword": "doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
} as const;

export const ACCEPT_ATTRIBUTE = ".pdf,.doc,.docx," + Object.keys(ACCEPTED_FILES).join(",");
