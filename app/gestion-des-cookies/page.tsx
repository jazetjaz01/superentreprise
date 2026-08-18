import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gestion des cookies | Superentreprise",
  description:
    "Informations sur les cookies utilisés par le site Superentreprise.com et sur la manière de les gérer.",
};

const cookies = [
  {
    name: "sb-access-token / sb-refresh-token",
    purpose: "Maintenir votre session connectée (authentification Supabase).",
    issuer: "Superentreprise (Supabase)",
    duration: "Jusqu'à déconnexion ou expiration de la session",
  },
  {
    name: "__stripe_mid / __stripe_sid",
    purpose:
      "Sécuriser le formulaire de paiement et prévenir la fraude lors de la souscription d'un abonnement.",
    issuer: "Stripe",
    duration: "1 an / 30 minutes",
  },
];

export default function GestionDesCookiesPage() {
  return (
    <article className="mx-auto w-full max-w-(--breakpoint-lg) px-6 py-12">
      <h1 className="font-semibold text-3xl tracking-tight">
        Gestion des cookies
      </h1>
      <p className="mt-2 text-muted-foreground text-sm">
        Dernière mise à jour : 18 août 2026
      </p>

      <div className="mt-8 flex flex-col gap-10 text-base text-foreground/90 leading-relaxed">
        <section className="flex flex-col gap-4">
          <h2 className="font-semibold text-xl tracking-tight">
            1 – Qu&apos;est-ce qu&apos;un cookie ?
          </h2>
          <p>
            Un cookie est un petit fichier texte déposé sur votre terminal
            (ordinateur, tablette, mobile) lors de la consultation d&apos;un
            site internet. Il permet notamment de reconnaître votre
            navigateur et de conserver certaines informations d&apos;une page
            à l&apos;autre, ou d&apos;une visite à l&apos;autre.
          </p>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="font-semibold text-xl tracking-tight">
            2 – Les cookies utilisés sur Superentreprise
          </h2>
          <p>
            Le site www.superentreprise.com (le « Site »), édité par Merci
            Immobilier, n&apos;utilise que des cookies strictement
            nécessaires à son fonctionnement. Ces cookies sont indispensables
            pour vous permettre d&apos;utiliser les fonctionnalités
            essentielles du Site (connexion à votre compte, paiement
            sécurisé) et ne peuvent pas être désactivés depuis le Site :
            conformément à la réglementation, ils ne nécessitent pas de
            recueil préalable de votre consentement.
          </p>

          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full min-w-full text-left text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-3 font-medium">Cookie</th>
                  <th className="px-4 py-3 font-medium">Finalité</th>
                  <th className="px-4 py-3 font-medium">Émetteur</th>
                  <th className="px-4 py-3 font-medium">Durée</th>
                </tr>
              </thead>
              <tbody>
                {cookies.map((cookie) => (
                  <tr key={cookie.name} className="border-border border-t">
                    <td className="px-4 py-3 font-mono text-xs">
                      {cookie.name}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {cookie.purpose}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {cookie.issuer}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {cookie.duration}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p>
            Le Site n&apos;utilise, à ce jour, aucun cookie publicitaire, de
            ciblage ou de mesure d&apos;audience tiers (analytics). Si cela
            venait à évoluer, cette page serait mise à jour et, le cas
            échéant, un bandeau de consentement vous serait présenté avant le
            dépôt de tout cookie non essentiel.
          </p>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="font-semibold text-xl tracking-tight">
            3 – Gérer les cookies depuis votre navigateur
          </h2>
          <p>
            Vous pouvez à tout moment configurer votre navigateur pour
            refuser ou supprimer les cookies déjà déposés. Cette opération
            s&apos;effectue différemment selon les navigateurs ; vous pouvez
            consulter les pages d&apos;aide correspondantes :
          </p>
          <ul className="list-disc pl-6">
            <li>
              <a
                className="underline hover:text-foreground"
                href="https://support.google.com/chrome/answer/95647"
                rel="noopener noreferrer"
                target="_blank"
              >
                Google Chrome
              </a>
            </li>
            <li>
              <a
                className="underline hover:text-foreground"
                href="https://support.mozilla.org/fr/kb/effacer-cookies-donnees-site-firefox"
                rel="noopener noreferrer"
                target="_blank"
              >
                Mozilla Firefox
              </a>
            </li>
            <li>
              <a
                className="underline hover:text-foreground"
                href="https://support.apple.com/fr-fr/guide/safari/sfri11471/mac"
                rel="noopener noreferrer"
                target="_blank"
              >
                Safari
              </a>
            </li>
            <li>
              <a
                className="underline hover:text-foreground"
                href="https://support.microsoft.com/fr-fr/microsoft-edge"
                rel="noopener noreferrer"
                target="_blank"
              >
                Microsoft Edge
              </a>
            </li>
          </ul>
          <p>
            Attention : la désactivation des cookies essentiels
            (authentification, paiement) empêchera le bon fonctionnement du
            Site, notamment la connexion à votre compte et la souscription
            d&apos;un abonnement.
          </p>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="font-semibold text-xl tracking-tight">
            4 – Pour en savoir plus
          </h2>
          <p>
            Pour plus d&apos;informations sur le traitement de vos données
            personnelles, consultez notre{" "}
            <a
              className="underline hover:text-foreground"
              href="/politique-de-confidentialite"
            >
              politique de confidentialité
            </a>
            . Pour toute question relative aux cookies, vous pouvez nous
            contacter à l&apos;adresse{" "}
            <a
              className="underline hover:text-foreground"
              href="mailto:contact@superentreprise.com"
            >
              contact@superentreprise.com
            </a>
            .
          </p>
        </section>
      </div>
    </article>
  );
}
