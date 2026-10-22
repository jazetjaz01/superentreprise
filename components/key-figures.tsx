type Figure = {
  label: string;
  value: string;
  prefix?: string;
  suffix?: string;
  caption: string;
};

const figures: Figure[] = [
  {
    label: "Entreprises à céder",
    prefix: "≈",
    value: "600 000",
    caption: "entreprises potentiellement à transmettre dans les dix prochaines années*",
  },
  {
    label: "Dirigeants de PME",
    value: "25",
    suffix: "%",
    caption: "ont 60 ans ou plus, contre 17,4 % en 2010**",
  },
  {
    label: "Cessions-transmissions",
    prefix: "≈",
    value: "51 000",
    caption: "opérations réalisées chaque année en France***",
  },
];

export const KeyFigures = () => (
  <section className="mx-auto max-w-page px-4 py-20 sm:px-6 lg:px-8">
    <ul className="grid gap-6 md:grid-cols-3 md:gap-8">
      {figures.map(({ label, value, prefix, suffix, caption }) => (
        <li
          key={label}
          className="border-l border-brand bg-stone-100 px-8 py-10 text-brand"
        >
          <p className="text-base">{label}</p>
          <p className="mt-3 flex items-baseline gap-2 leading-none">
            {prefix && <span className="text-4xl font-light">{prefix}</span>}
            <span className="text-6xl font-light tracking-tight sm:text-7xl">
              {value}
            </span>
            {suffix && <span className="text-4xl font-light">{suffix}</span>}
          </p>
          <p className="mt-4 text-base">{caption}</p>
        </li>
      ))}
    </ul>
    <p className="mt-6 text-xs text-muted-foreground">
      * Estimation Bpifrance Création. ** Part des dirigeants de PME en 2020.
      *** BPCE L’Observatoire (50 877 cessions-transmissions en 2016).
    </p>
  </section>
);
