import Image from "next/image";

const quote = {
  text: "Notre métier repose sur la qualité de nos collaborateurs. En les accompagnant dans leur développement, nous assurons la réussite de chaque transmission que nous menons.",
  name: "Alami Er’haidi",
  role: "Fondateur de Superentreprise",
  image: "/carriere/carriere2.jpg",
};

// Page Carrières : portrait à gauche, citation à droite
export const CareersQuote = () => (
  <section className="mx-auto max-w-page px-4 py-20 sm:px-6 lg:px-8">
    <figure className="mx-auto grid max-w-6xl items-start gap-10 md:grid-cols-[16rem_minmax(0,1fr)] md:gap-16 lg:grid-cols-[18rem_minmax(0,1fr)] lg:gap-24">
      <div className="relative aspect-[3/4] w-full max-w-72 overflow-hidden bg-brand/5">
        <Image
          src={quote.image}
          alt={quote.name}
          fill
          sizes="(min-width: 1024px) 288px, (min-width: 768px) 256px, 288px"
          className="object-cover"
        />
      </div>

      <div>
        <span
          aria-hidden="true"
          className="block font-serif text-7xl leading-none text-[#B08D57]"
        >
          “
        </span>
        <blockquote className="-mt-4 text-2xl leading-snug tracking-tight text-brand sm:text-3xl lg:text-4xl">
          <p>{quote.text}</p>
        </blockquote>
        <figcaption className="mt-10">
          <p className="font-semibold uppercase tracking-widest text-brand">
            {quote.name}
          </p>
          <p className="mt-2 flex items-center gap-3 text-sm text-muted-foreground">
            <span aria-hidden="true">—</span>
            {quote.role}
          </p>
        </figcaption>
      </div>
    </figure>
  </section>
);
