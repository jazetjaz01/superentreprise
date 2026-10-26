import type { ReactNode } from "react";

// Message clé centré sur fond blanc, encadré de traits fins
// (même vocabulaire que les en-têtes de section du site)
export const HighlightPanel = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => (
  <section className="mx-auto max-w-page px-4 py-12 sm:px-6 lg:px-8">
    <div className="mx-auto max-w-5xl border-y px-2 py-16 text-center lg:py-20">
      <span aria-hidden="true" className="mx-auto block h-px w-10 bg-brand" />
      <h2 className="mt-6 text-2xl font-semibold tracking-tight text-brand sm:text-3xl">
        {title}
      </h2>
      <div className="mx-auto mt-6 max-w-3xl space-y-4 text-lg leading-relaxed text-muted-foreground">
        {children}
      </div>
    </div>
  </section>
);
