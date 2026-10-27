import type { ReactNode } from "react";

// Mise en forme des pages juridiques (mentions légales, confidentialité)
export const LegalSection = ({
  id,
  number,
  title,
  children,
}: {
  id: string;
  number: number;
  title: string;
  children: ReactNode;
}) => (
  <section id={id} className="scroll-mt-24 border-t pt-10">
    <h2 className="text-2xl font-semibold tracking-tight text-brand">
      {number} – {title}
    </h2>
    <div className="mt-6 space-y-6 leading-relaxed text-foreground/90">{children}</div>
  </section>
);

export const LegalSubTitle = ({ children }: { children: ReactNode }) => (
  <h3 className="text-sm font-medium uppercase tracking-wide text-brand">{children}</h3>
);
