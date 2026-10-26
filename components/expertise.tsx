import Image from "next/image";

type Step = {
  title: string;
  description: string;
  // Chemin d'une image dans public/ (ex. "/images/diagnostic.jpg")
  image?: string;
};

const steps: Step[] = [
  {
    title: "Diagnostic & Stratégie",
    description:
      "Nous analysons votre entreprise, sa valeur et vos objectifs personnels afin de définir la stratégie de transmission ou de cession la plus adaptée.",
    image: "/home/process1.jpg",
  },
  {
    title: "Préparation et Optimisation",
    description:
      "Nous préparons l’entreprise à la transmission : valorisation, structuration juridique et fiscale, documentation et mise en avant de ses atouts auprès des repreneurs.",
    image: "/home/process2.jpg",
  },
  {
    title: "Exécution et Closing",
    description:
      "Nous identifions et approchons les repreneurs, menons les négociations et vous accompagnons jusqu’à la signature, en toute confidentialité.",
    image: "/home/process3.jpg",
  },
];

export const Expertise = () => (
  <section id="expertise" className="mx-auto max-w-page scroll-mt-20 px-4 sm:px-6 lg:px-8">
    <div className="text-center text-brand">
      <span className="mx-auto block h-px w-10 bg-brand" />
      <p className="mt-6 text-sm tracking-wide">Notre expertise</p>
      <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
        Un accompagnement en trois étapes
      </h2>
    </div>

    <ol className="mt-16 grid gap-12 md:grid-cols-3 md:gap-8">
      {steps.map(({ title, description, image }, index) => {
        const number = String(index + 1).padStart(2, "0");
        return (
          <li key={title}>
            <div className="relative aspect-[4/5] overflow-hidden bg-brand/5">
              {image ? (
                <Image
                  src={image}
                  alt=""
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover"
                />
              ) : (
                <span className="absolute inset-0 flex items-center justify-center text-8xl font-light text-brand/20">
                  {number}
                </span>
              )}
            </div>
            <p className="mt-6 text-sm tracking-wide text-brand/60">
              Étape {number}
            </p>
            <h3 className="mt-2 text-2xl font-semibold tracking-tight text-brand sm:text-3xl">
              {title}
            </h3>
            <p className="mt-4 text-muted-foreground">{description}</p>
          </li>
        );
      })}
    </ol>
  </section>
);
