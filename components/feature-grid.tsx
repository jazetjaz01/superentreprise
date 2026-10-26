type Feature = { title: string; description: string };

// Grille d'arguments numérotés (01, 02…) sous un en-tête centré.
// Pages d'accompagnement : Valoriser, Préparer, Transmettre…
export const FeatureGrid = ({
  eyebrow,
  title,
  features,
}: {
  eyebrow: string;
  title: string;
  features: Feature[];
}) => (
  <section className="mx-auto max-w-page px-4 py-24 sm:px-6 lg:px-8">
    <div className="text-center text-brand">
      <span className="mx-auto block h-px w-10 bg-brand" />
      <p className="mt-6 text-sm tracking-wide">{eyebrow}</p>
      <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h2>
    </div>

    <ol className="mx-auto mt-16 grid max-w-7xl gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
      {features.map(({ title, description }, index) => (
        <li key={title} className="border-l border-brand px-6 py-2">
          <p className="text-4xl font-light leading-none text-brand/40">
            {String(index + 1).padStart(2, "0")}
          </p>
          <h3 className="mt-6 text-xl font-semibold tracking-tight text-brand">{title}</h3>
          <p className="mt-3 leading-relaxed text-muted-foreground">{description}</p>
        </li>
      ))}
    </ol>
  </section>
);
