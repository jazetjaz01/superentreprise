import Image from "next/image";
import Link from "next/link";

// Image au format 4:3 (ex. 1600 × 1200 px)
const image: string | undefined = "/home/nousconnaitre.jpg";

export const NousConnaitre = () => (
  <section className="mx-auto max-w-page px-4 py-20 sm:px-6 lg:px-8">
    <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
      <div className="relative aspect-[4/3] overflow-hidden bg-brand/5">
        {image ? (
          <Image
            src={image}
            alt=""
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        ) : (
          <Image
            src="/logo.svg"
            alt=""
            width={96}
            height={96}
            className="absolute inset-0 m-auto size-24 opacity-20"
          />
        )}
      </div>

      <div className="text-brand">
        <p className="flex items-center gap-6 text-base">
          <span className="h-px w-14 bg-brand" />
          Nous connaître
        </p>
        <h2 className="mt-8 text-3xl font-semibold tracking-tight sm:text-4xl">
          Des entrepreneurs qui comprennent les entrepreneurs
        </h2>
        <div className="mt-6 space-y-5 text-muted-foreground">
          <p>
            superentreprise accompagne les chefs d’entreprise à chaque étape de
            leur projet de transmission ou de cession. Nous savons qu’une
            transmission est bien plus qu’une opération financière : c’est
            l’aboutissement d’une vie d’entrepreneur.
          </p>
          <p>
            Notre engagement : un accompagnement sur mesure, confidentiel et
            exigeant, pour que la transmission de votre entreprise se fasse dans
            les meilleures conditions, pour vous comme pour vos équipes.
          </p>
        </div>
        <Link
          href="#"
          className="mt-10 inline-flex h-12 items-center bg-brand px-8 text-sm font-medium uppercase tracking-wide text-white transition-colors hover:bg-brand/90"
        >
          En savoir plus
        </Link>
      </div>
    </div>
  </section>
);
