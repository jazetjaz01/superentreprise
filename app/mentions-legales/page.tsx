import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mentions légales | Superentreprise",
  description:
    "Mentions légales du site Superentreprise.com, édité par Merci Immobilier.",
};

export default function MentionsLegalesPage() {
  return (
    <article className="mx-auto w-full max-w-(--breakpoint-lg) px-6 py-12">
      <h1 className="font-semibold text-3xl tracking-tight">
        Mentions légales
      </h1>

      <div className="mt-8 flex flex-col gap-10 text-base text-foreground/90 leading-relaxed">
        <section className="flex flex-col gap-4">
          <h2 className="font-semibold text-xl tracking-tight">
            1 – Mentions légales
          </h2>

          <div>
            <h3 className="font-medium">Éditeur du site</h3>
            <p className="mt-2">
              Le site www.superentreprise.com est édité par :
              <br />
              Merci Immobilier
              <br />
              Immatriculée au RCS de Perpignan sous le numéro SIREN 852 226
              620
              <br />
              Siège social : 7 Avenue de Banyuls sur Mer, 66100 Perpignan
              <br />
              Email :{" "}
              <a
                className="underline hover:text-foreground"
                href="mailto:contact@superentreprise.com"
              >
                contact@superentreprise.com
              </a>
              <br />
              Tél. : 06 16 22 46 82
            </p>
          </div>

          <div>
            <h3 className="font-medium">Hébergeur</h3>
            <p className="mt-2">
              Vercel Inc.
              <br />
              440 N Barranca Ave #4133, Covina, CA 91723
              <br />
              <a
                className="underline hover:text-foreground"
                href="https://vercel.com"
                rel="noopener noreferrer"
                target="_blank"
              >
                https://vercel.com
              </a>
            </p>
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="font-semibold text-xl tracking-tight">
            2 – Conditions d&apos;utilisation
          </h2>

          <p className="font-medium">
            Avertissement : nous vous invitons à lire avec attention les
            présentes conditions d&apos;utilisation.
          </p>

          <div>
            <h3 className="font-medium">Acceptation des conditions</h3>
            <p className="mt-2">
              Tout internaute qui souhaite utiliser notre site internet est
              réputé avoir pris connaissance des conditions d&apos;utilisation
              et les avoir acceptées. Superentreprise se réserve le droit de
              les modifier à tout moment.
            </p>
          </div>

          <div>
            <h3 className="font-medium">Annonces immobilières</h3>
            <p className="mt-2">
              Les informations contenues dans les annonces sont fournies à
              titre indicatif. Superentreprise s&apos;efforce de diffuser des
              informations exactes mais ne saurait être tenue pour
              responsable en cas d&apos;erreurs, d&apos;inexactitudes ou de
              non-conformité des biens présentés.
            </p>
          </div>

          <div>
            <h3 className="font-medium">Propriété intellectuelle</h3>
            <p className="mt-2">
              Tout le contenu du présent site (graphismes, images, textes,
              logos, icônes) est la propriété exclusive de Merci Immobilier.
              Toute reproduction ou distribution, même partielle, est
              strictement interdite sans accord préalable écrit, conformément
              aux articles L.335-2 et suivants du Code de la propriété
              intellectuelle.
            </p>
          </div>

          <div>
            <h3 className="font-medium">Accessibilité</h3>
            <p className="mt-2">
              Le site est normalement accessible 24h/24. Toutefois, Superentreprise
               se réserve le droit, sans préavis, de fermer
              temporairement le site pour maintenance ou mise à jour
              technique.
            </p>
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="font-semibold text-xl tracking-tight">3 – Litiges</h2>
          <p>
            Les présentes conditions sont régies par le droit français. Tout
            litige relatif à l&apos;utilisation du site sera de la compétence
            exclusive des tribunaux français.
          </p>
        </section>
      </div>
    </article>
  );
}
