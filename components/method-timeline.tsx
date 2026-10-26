type Phase = {
  title: string;
  duration: string;
  lead: string;
  description: string;
};

// Frise verticale des phases d'accompagnement :
// libellé « Phase X » | ligne + point | carte (titre, durée, accroche, texte)
export const MethodTimeline = ({
  eyebrow,
  title,
  subtitle,
  phases,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  phases: Phase[];
}) => (
  <section className="mx-auto max-w-page px-4 py-24 sm:px-6 lg:px-8">
    <div className="text-center text-brand">
      <span className="mx-auto block h-px w-10 bg-brand" />
      <p className="mt-6 text-sm tracking-wide">{eyebrow}</p>
      <h2 className="mx-auto mt-4 max-w-3xl text-3xl font-semibold tracking-tight sm:text-4xl">
        {title}
      </h2>
      {subtitle && <p className="mt-4 text-muted-foreground">{subtitle}</p>}
    </div>

    <ol className="mx-auto mt-16 max-w-6xl">
      {phases.map((phase, index) => (
        <li
          key={phase.title}
          className="grid lg:grid-cols-[minmax(0,1fr)_5rem_minmax(0,2fr)]"
        >
          {/* Libellé de phase (ordinateur) */}
          <p className="hidden items-center justify-center text-xl text-brand lg:flex">
            Phase {index + 1}
          </p>

          {/* Ligne verticale continue + point centré sur la carte */}
          <div aria-hidden="true" className="relative hidden lg:block">
            <span
              className={`absolute left-1/2 w-px -translate-x-1/2 bg-brand/25 ${
                index === 0 ? "top-1/2 bottom-0" : index === phases.length - 1 ? "top-0 bottom-1/2" : "inset-y-0"
              }`}
            />
            <span className="absolute top-1/2 left-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand ring-4 ring-brand/15" />
          </div>

          <div className="py-4 lg:py-6">
            <p className="mb-3 text-sm font-medium uppercase tracking-wide text-brand/60 lg:hidden">
              Phase {index + 1}
            </p>
            <article className="bg-stone-100 p-8 sm:p-10">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <h3 className="text-2xl font-semibold tracking-tight text-brand">{phase.title}</h3>
                <span className="bg-brand px-3 py-1.5 text-xs font-medium uppercase tracking-wide text-white">
                  {phase.duration}
                </span>
              </div>
              <p className="mt-4 font-medium text-brand">{phase.lead}</p>
              <p className="mt-3 leading-relaxed text-muted-foreground">{phase.description}</p>
            </article>
          </div>
        </li>
      ))}
    </ol>
  </section>
);
