type Stat = {
  value: string;
  prefix?: string; // ex. « c. » (environ)
  caption: string;
};

const stats: Stat[] = [
  { value: "12", caption: "collaborateurs" },
  { value: "3", caption: "implantations : Perpignan, Paris et Lyon" },
  { value: "4", caption: "domaines d’intervention : cession, reprise, valorisation et transmission familiale" },
  { value: "8", caption: "recrutements prévus en 2026" },
];

// Page Carrières : culture d'entreprise + chiffres clés
export const CareersCulture = () => (
  <section className="mx-auto max-w-page px-4 py-24 sm:px-6 lg:px-8">
    <h2 className="mx-auto max-w-5xl text-center text-3xl font-semibold leading-tight tracking-tight text-brand sm:text-5xl">
      superentreprise incarne une culture d’entreprise fondée sur l’engagement,
      l’esprit entrepreneurial et la transmission.
    </h2>

    <div className="mx-auto mt-16 max-w-3xl text-center">
      <p className="text-2xl leading-snug text-brand sm:text-3xl">
        Conseil indépendant au service des dirigeants, superentreprise repose
        avant tout sur les femmes et les hommes qui accompagnent chaque jour nos
        clients.
      </p>
      <div className="mx-auto mt-8 max-w-2xl space-y-6 text-muted-foreground">
        <p>
          Pour mener à bien chaque mission, nous apportons le plus grand soin au
          recrutement de nos collaborateurs, à leur évolution et à leur
          épanouissement au sein de l’équipe.
        </p>
        <p>
          Cessions, reprises, transmissions familiales : nos collaborateurs
          interviennent sur des opérations concrètes, aux côtés de chefs
          d’entreprise, dans un cadre exigeant où chacun peut prendre
          rapidement des responsabilités.
        </p>
      </div>
    </div>

    <ul className="mx-auto mt-20 grid max-w-6xl gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0">
      {stats.map(({ value, prefix, caption }) => (
        <li key={caption} className="border-l border-brand px-8 py-6 text-brand">
          <p className="flex items-baseline gap-1 leading-none">
            {prefix && <span className="text-3xl font-light">{prefix}</span>}
            <span className="text-6xl font-light tracking-tight">{value}</span>
          </p>
          <p className="mt-4 max-w-56">{caption}</p>
        </li>
      ))}
    </ul>
  </section>
);
