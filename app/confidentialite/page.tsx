import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/breadcrumb";
import { LegalSection as Section, LegalSubTitle as SubTitle } from "@/components/legal-section";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description:
    "Comment superentreprise collecte, utilise et protège vos données personnelles, et quels cookies sont utilisés sur le site.",
};

const linkClassName = "text-brand underline underline-offset-4";

// ⚠️ À compléter : région d'hébergement du projet Supabase
// (Supabase → Project Settings → General → Region)
const ToComplete = ({ children }: { children: React.ReactNode }) => (
  <span className="bg-amber-100 px-1">{children}</span>
);

export default function ConfidentialitePage() {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 sm:px-6">
      <Breadcrumb
        items={[{ label: "Accueil", href: "/" }, { label: "Politique de confidentialité" }]}
      />

      <h1 className="mt-8 text-3xl font-semibold tracking-tight text-brand sm:text-4xl lg:text-5xl">
        Politique de confidentialité
      </h1>
      <p className="mt-4 text-muted-foreground">Dernière mise à jour : 26 octobre 2026</p>

      <div className="mt-12 space-y-14">
        <Section id="responsable" number={1} title="Responsable du traitement">
          <p>
            Les données personnelles collectées sur le site www.superentreprise.com
            sont traitées par <strong className="font-semibold text-brand">Merci Immobilier</strong>{" "}
            (ci-après « Superentreprise »), immatriculée au RCS de Perpignan sous
            le numéro SIREN 852 226 620, dont le siège social est situé 7 avenue
            de Banyuls-sur-Mer, 66100 Perpignan.
          </p>
          <p>
            Pour toute question relative à vos données :{" "}
            <a href="mailto:contact@superentreprise.com" className={linkClassName}>
              contact@superentreprise.com
            </a>
            .
          </p>
        </Section>

        <Section id="donnees" number={2} title="Données collectées et finalités">
          <p>
            Nous ne collectons que les données nécessaires aux services que vous
            utilisez sur le site.
          </p>

          <div className="space-y-2">
            <SubTitle>Formulaire de contact</SubTitle>
            <p>
              Objet de la demande, prénom, nom, adresse e-mail, téléphone
              (facultatif) et message, afin de répondre à votre demande. Base
              légale : notre intérêt légitime à traiter les demandes qui nous sont
              adressées et, le cas échéant, les mesures précontractuelles prises
              à votre demande.
            </p>
          </div>

          <div className="space-y-2">
            <SubTitle>Candidatures</SubTitle>
            <p>
              Type de poste, prénom, nom, coordonnées, formation ou poste actuel,
              message, CV et lettre de motivation, afin d’étudier votre
              candidature. Base légale : les mesures précontractuelles prises à
              votre demande et votre consentement, recueilli lors de l’envoi.
            </p>
          </div>

          <div className="space-y-2">
            <SubTitle>Compte utilisateur</SubTitle>
            <p>
              Adresse e-mail et mot de passe (conservé sous forme chiffrée par
              notre prestataire d’authentification), ainsi que les informations
              de profil que vous renseignez (nom, entreprise, téléphone), afin de
              vous donner accès à votre espace. Base légale : l’exécution du
              service que vous demandez en créant un compte.
            </p>
          </div>

          <div className="space-y-2">
            <SubTitle>Fiche auteur</SubTitle>
            <p>
              Pour les auteurs d’articles : nom affiché, photo, fonction, courte
              présentation et, s’ils le souhaitent, liens LinkedIn, X et e-mail
              de contact. Ces informations sont publiques et affichées avec leurs
              articles. Base légale : le consentement de l’auteur, qui les
              renseigne et peut les modifier ou les supprimer à tout moment.
            </p>
          </div>

          <div className="space-y-2">
            <SubTitle>Données techniques</SubTitle>
            <p>
              Lors de votre visite, des données techniques (adresse IP, type de
              navigateur, pages consultées) sont traitées par notre hébergeur pour
              assurer le fonctionnement et la sécurité du site. Base légale :
              notre intérêt légitime à fournir un site fiable et sécurisé.
            </p>
          </div>
        </Section>

        <Section id="destinataires" number={3} title="Destinataires et prestataires">
          <p>
            Vos données sont destinées aux seules personnes de Superentreprise
            chargées de traiter votre demande ou votre candidature. Elles ne sont
            ni vendues ni louées. Nous faisons appel aux prestataires techniques
            suivants, qui les traitent pour notre compte :
          </p>
          <ul className="list-disc space-y-2 ps-6">
            <li>
              <strong className="font-semibold text-brand">Vercel Inc.</strong> (États-Unis) :
              hébergement du site.
            </li>
            <li>
              <strong className="font-semibold text-brand">Supabase Inc.</strong> : base de
              données, authentification et stockage des fichiers (dont les CV),
              hébergés en <ToComplete>[région à compléter]</ToComplete>.
            </li>
            <li>
              <strong className="font-semibold text-brand">Resend</strong> (États-Unis) : envoi
              des e-mails de notification lors d’un message ou d’une candidature.
            </li>
            <li>
              <strong className="font-semibold text-brand">OpenFreeMap</strong> : fonds de carte
              de la page Contact. L’affichage de la carte transmet votre adresse
              IP à ce service.
            </li>
          </ul>
          <p>
            Lorsque des données sont transférées hors de l’Union européenne, ces
            transferts sont encadrés par des garanties appropriées, notamment les
            clauses contractuelles types de la Commission européenne.
          </p>
        </Section>

        <Section id="conservation" number={4} title="Durées de conservation">
          <ul className="list-disc space-y-2 ps-6">
            <li>
              <strong className="font-semibold text-brand">Messages de contact :</strong> 3 ans
              à compter de notre dernier échange.
            </li>
            <li>
              <strong className="font-semibold text-brand">Candidatures :</strong> 2 ans à
              compter de notre dernier échange si votre candidature n’est pas
              retenue, sauf demande de suppression anticipée de votre part.
            </li>
            <li>
              <strong className="font-semibold text-brand">Compte utilisateur :</strong> tant
              que le compte est actif ; les données sont supprimées à la clôture
              du compte.
            </li>
            <li>
              <strong className="font-semibold text-brand">Fiche auteur :</strong> tant que
              l’auteur publie sur le site, ou jusqu’à sa demande de suppression.
            </li>
            <li>
              <strong className="font-semibold text-brand">Données techniques :</strong> selon
              les durées de conservation des journaux de notre hébergeur.
            </li>
          </ul>
        </Section>

        <Section id="cookies" number={5} title="Cookies">
          <p>
            Le site n’utilise <strong className="font-semibold text-brand">aucun cookie de mesure
            d’audience ni cookie publicitaire</strong>.
          </p>
          <p>
            Seuls des cookies strictement nécessaires sont déposés lorsque vous
            vous connectez à votre compte : ils conservent votre session de
            connexion et ne servent à rien d’autre. Conformément à la
            réglementation, ces cookies sont exemptés de consentement. Ils sont
            supprimés lorsque vous vous déconnectez ou à leur expiration.
          </p>
          <p>
            Vous pouvez à tout moment configurer votre navigateur pour bloquer
            les cookies ; la connexion à votre compte ne sera alors plus possible.
          </p>
        </Section>

        <Section id="droits" number={6} title="Vos droits">
          <p>
            Conformément au Règlement général sur la protection des données
            (RGPD) et à la loi Informatique et Libertés, vous disposez des droits
            suivants sur vos données : accès, rectification, effacement,
            limitation du traitement, opposition, portabilité, ainsi que le droit
            de retirer votre consentement à tout moment et de définir des
            directives relatives au sort de vos données après votre décès.
          </p>
          <p>
            Pour exercer ces droits, écrivez-nous à{" "}
            <a href="mailto:contact@superentreprise.com" className={linkClassName}>
              contact@superentreprise.com
            </a>{" "}
            ou par courrier au 7 avenue de Banyuls-sur-Mer, 66100 Perpignan. Nous
            vous répondrons dans un délai d’un mois.
          </p>
          <p>
            Si vous estimez que vos droits ne sont pas respectés, vous pouvez
            introduire une réclamation auprès de la CNIL (
            <a
              href="https://www.cnil.fr"
              target="_blank"
              rel="noopener noreferrer"
              className={linkClassName}
            >
              www.cnil.fr
            </a>
            ).
          </p>
        </Section>

        <Section id="securite" number={7} title="Sécurité">
          <p>
            Nous mettons en œuvre des mesures techniques et organisationnelles
            adaptées pour protéger vos données : connexions chiffrées (HTTPS),
            accès restreints aux seules personnes habilitées, fichiers de
            candidature stockés dans un espace privé non accessible publiquement.
          </p>
          <p>
            Pour en savoir plus sur l’éditeur du site, consultez nos{" "}
            <Link href="/mentions-legales" className={linkClassName}>
              mentions légales
            </Link>
            .
          </p>
        </Section>
      </div>
    </main>
  );
}
