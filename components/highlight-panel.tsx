import type { ReactNode } from "react";

// Encadré bleu marine centré pour un message clé (pages d'accompagnement)
export const HighlightPanel = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => (
  <section className="mx-auto max-w-page px-4 py-12 sm:px-6 lg:px-8">
    <div className="mx-auto max-w-6xl bg-brand px-6 py-16 text-center text-white sm:px-12 lg:py-20">
      <span aria-hidden="true" className="mx-auto block h-px w-10 bg-white/60" />
      <h2 className="mt-6 text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h2>
      <div className="mx-auto mt-6 max-w-3xl space-y-4 text-lg leading-relaxed text-white/85">
        {children}
      </div>
    </div>
  </section>
);
