import type { Metadata } from "next";
import { Breadcrumb } from "@/components/breadcrumb";
import { LegalSection as Section, LegalSubTitle as SubTitle } from "@/components/legal-section";

export const metadata: Metadata = {
  title: "Mentions légales",
  description: "Mentions légales et conditions d’utilisation du site superentreprise.com.",
};

export default function MentionsLegalesPage() {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 sm:px-6">
      <Breadcrumb items={[{ label: "Accueil", href: "/" }, { label: "Mentions légales" }]} />

      <h1 className="mt-8 text-3xl font-semibold tracking-tight text-brand sm:text-4xl lg:text-5xl">
        Mentions légales
      </h1>

      <div className="mt-12 space-y-14">
        <Section id="mentions" number={1} title="Mentions légales">
          <div className="space-y-2">
            <SubTitle>Éditeur du site</SubTitle>
            <p>
              Le site www.superentreprise.com est édité par :
              <br />
              <strong className="font-semibold text-brand">Merci Immobilier</strong>{" "}
              (ci-après « Superentreprise »)
              <br />
              Immatriculée au RCS de Perpignan sous le numéro SIREN 852 226 620
              <br />
              Siège social : 7 avenue de Banyuls-sur-Mer, 66100 Perpignan
              <br />
              Email :{" "}
              <a
                href="mailto:contact@superentreprise.com"
                className="text-brand underline underline-offset-4"
              >
                contact@superentreprise.com
              </a>
              <br />
              Tél. :{" "}
              <a href="tel:+33616224682" className="text-brand underline underline-offset-4">
                06 16 22 46 82
              </a>
            </p>
          </div>

          <div className="space-y-2">
            <SubTitle>Directeur de la publication</SubTitle>
            <p>Alami Er’haidi, fondateur de Superentreprise</p>
          </div>

          <div className="space-y-2">
            <SubTitle>Hébergeur</SubTitle>
            <p>
              Vercel Inc.
              <br />
              440 N Barranca Ave #4133, Covina, CA 91723, États-Unis
              <br />
              <a
                href="https://vercel.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand underline underline-offset-4"
              >
                https://vercel.com
              </a>
            </p>
          </div>
        </Section>

        <Section id="conditions" number={2} title="Conditions d’utilisation">
          <p className="font-medium uppercase tracking-wide text-brand">
            Avertissement : nous vous invitons à lire avec attention les présentes
            conditions d’utilisation.
          </p>

          <div className="space-y-2">
            <SubTitle>Acceptation des conditions</SubTitle>
            <p>
              Tout internaute qui souhaite utiliser notre site internet est réputé
              avoir pris connaissance des présentes conditions d’utilisation et les
              avoir acceptées. Superentreprise se réserve le droit de les modifier à
              tout moment.
            </p>
          </div>

          <div className="space-y-2">
            <SubTitle>Contenus du site</SubTitle>
            <p>
              Les informations publiées sur le site, notamment dans la rubrique
              Actualité, sont fournies à titre informatif et général. Elles ne
              constituent pas un conseil juridique, fiscal ou financier adapté à
              une situation particulière. Superentreprise s’efforce de diffuser des
              informations exactes et à jour, mais ne saurait être tenue pour
              responsable en cas d’erreurs, d’inexactitudes ou d’omissions.
            </p>
          </div>

          <div className="space-y-2">
            <SubTitle>Propriété intellectuelle</SubTitle>
            <p>
              Tout le contenu du présent site (graphismes, images, textes, logos,
              icônes) est la propriété exclusive de Superentreprise. Toute
              reproduction ou distribution, même partielle, est strictement
              interdite sans accord préalable écrit, conformément aux articles
              L.335-2 et suivants du Code de la propriété intellectuelle.
            </p>
          </div>

          <div className="space-y-2">
            <SubTitle>Accessibilité</SubTitle>
            <p>
              Le site est normalement accessible 24 h/24. Toutefois,
              Superentreprise se réserve le droit, sans préavis, de fermer
              temporairement le site pour maintenance ou mise à jour technique.
            </p>
          </div>
        </Section>

        <Section id="litiges" number={3} title="Litiges">
          <p>
            Les présentes conditions sont régies par le droit français. Tout litige
            relatif à l’utilisation du site sera de la compétence exclusive des
            tribunaux français.
          </p>
        </Section>
      </div>
    </main>
  );
}
