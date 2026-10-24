import type { ReactNode } from "react";

// Titre de colonne latérale : petit trait + libellé en majuscules
// (articles : « Derniers articles », « Rédigé par »… ; page contact)
export const SectionTitle = ({ children }: { children: ReactNode }) => (
  <h2 className="flex items-center gap-4 text-sm font-medium uppercase tracking-wide text-brand">
    <span className="h-px w-8 bg-brand" />
    {children}
  </h2>
);
