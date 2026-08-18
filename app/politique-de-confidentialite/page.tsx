import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politique de confidentialité | Superentreprise",
  description:
    "Politique de confidentialité et de protection des données personnelles du site Superentreprise.com.",
};

export default function PolitiqueConfidentialitePage() {
  return (
    <article className="mx-auto w-full max-w-(--breakpoint-lg) px-6 py-12">
      <h1 className="font-semibold text-3xl tracking-tight">
        Politique de confidentialité
      </h1>
      <p className="mt-2 text-muted-foreground text-sm">
        Dernière mise à jour : 18 août 2026
      </p>

      <div className="mt-8 flex flex-col gap-10 text-base text-foreground/90 leading-relaxed">
        <section className="flex flex-col gap-4">
          <h2 className="font-semibold text-xl tracking-tight">
            1 – Responsable du traitement
          </h2>
          <p>
            Le responsable du traitement des données personnelles collectées
            sur le site www.superentreprise.com (le « Site ») est Merci
            Immobilier, dont les coordonnées figurent dans les{" "}
            <a
              className="underline hover:text-foreground"
              href="/mentions-legales"
            >
              mentions légales
            </a>
            . Pour toute question relative à vos données personnelles, vous
            pouvez nous contacter à l&apos;adresse{" "}
            <a
              className="underline hover:text-foreground"
              href="mailto:contact@superentreprise.com"
            >
              contact@superentreprise.com
            </a>
            .
          </p>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="font-semibold text-xl tracking-tight">
            2 – Données collectées
          </h2>
          <p>Selon votre utilisation du Site, nous collectons :</p>
          <ul className="list-disc pl-6">
            <li>
              <span className="font-medium">Données de compte</span> : email,
              mot de passe (chiffré) ou identifiant Google, rôle
              (vendeur/acheteur).
            </li>
            <li>
              <span className="font-medium">Données de profil</span> : nom,
              prénom, surnom, téléphone, photo de profil, et pour les
              vendeurs les informations de la fiche société (dénomination,
              adresse, SIRET) utilisées pour l&apos;établissement des
              factures.
            </li>
            <li>
              <span className="font-medium">Données d&apos;annonce</span> :
              informations relatives à l&apos;entreprise ou au commerce cédé
              (activité, localisation, données financières, photographies).
            </li>
            <li>
              <span className="font-medium">Données de messagerie</span> :
              contenu des messages échangés entre acheteurs et vendeurs via
              la messagerie interne du Site.
            </li>
            <li>
              <span className="font-medium">Données de paiement</span> :
              gérées directement par notre prestataire Stripe ; Superentreprise
              ne stocke aucune donnée bancaire (numéro de carte, cryptogramme).
            </li>
            <li>
              <span className="font-medium">Données de connexion</span> :
              adresse IP, journaux techniques nécessaires au fonctionnement
              et à la sécurité du Site.
            </li>
          </ul>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="font-semibold text-xl tracking-tight">
            3 – Finalités du traitement
          </h2>
          <p>Vos données sont traitées pour les finalités suivantes :</p>
          <ul className="list-disc pl-6">
            <li>Créer et gérer votre compte utilisateur ;</li>
            <li>
              Publier et diffuser vos annonces, et vous permettre de
              consulter celles des autres utilisateurs ;
            </li>
            <li>
              Permettre la mise en relation et les échanges entre acheteurs
              et vendeurs via la messagerie interne ;
            </li>
            <li>
              Gérer votre abonnement, les paiements associés et
              l&apos;émission des factures ;
            </li>
            <li>
              Assurer la sécurité du Site, prévenir la fraude et répondre à
              nos obligations légales ;
            </li>
            <li>
              Répondre à vos demandes adressées via le formulaire de contact.
            </li>
          </ul>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="font-semibold text-xl tracking-tight">
            4 – Base légale
          </h2>
          <p>Ces traitements reposent selon les cas sur :</p>
          <ul className="list-disc pl-6">
            <li>
              <span className="font-medium">
                L&apos;exécution du contrat
              </span>{" "}
              qui vous lie à Superentreprise (création de compte, diffusion
              d&apos;annonces, messagerie, gestion de l&apos;abonnement) ;
            </li>
            <li>
              <span className="font-medium">Votre consentement</span>,
              notamment pour les cookies non essentiels ;
            </li>
            <li>
              <span className="font-medium">
                Notre intérêt légitime
              </span>
              , pour la sécurité du Site et la prévention de la fraude ;
            </li>
            <li>
              <span className="font-medium">Nos obligations légales</span>,
              notamment comptables et fiscales.
            </li>
          </ul>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="font-semibold text-xl tracking-tight">
            5 – Confidentialité entre utilisateurs
          </h2>
          <p>
            Dans le cadre d&apos;une cession d&apos;entreprise, la
            confidentialité est un enjeu important. Vous pouvez choisir
            d&apos;afficher un surnom plutôt que votre nom et prénom auprès
            des autres utilisateurs. Votre email, votre téléphone et vos
            informations de facturation ne sont jamais communiqués aux autres
            utilisateurs du Site : seuls votre nom, prénom ou surnom et,
            le cas échéant, votre photo de profil sont visibles par la
            personne avec laquelle vous échangez au sujet d&apos;une annonce.
          </p>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="font-semibold text-xl tracking-tight">
            6 – Destinataires et sous-traitants
          </h2>
          <p>
            Vos données sont destinées aux équipes de Superentreprise et sont
            transmises aux prestataires suivants, dans la stricte limite de
            leurs missions respectives :
          </p>
          <ul className="list-disc pl-6">
            <li>
              <span className="font-medium">Supabase</span> : hébergement de
              la base de données, authentification et stockage des fichiers
              (photos d&apos;annonces, avatars) ;
            </li>
            <li>
              <span className="font-medium">Stripe</span> : traitement des
              paiements, gestion de l&apos;abonnement et facturation ;
            </li>
            <li>
              <span className="font-medium">Vercel</span> : hébergement du
              Site (voir{" "}
              <a
                className="underline hover:text-foreground"
                href="/mentions-legales"
              >
                mentions légales
              </a>
              ).
            </li>
          </ul>
          <p>
            Ces prestataires n&apos;utilisent vos données que pour le compte
            de Superentreprise et dans le cadre des finalités décrites ci-
            dessus. Vos données ne sont ni vendues, ni louées à des tiers à
            des fins commerciales.
          </p>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="font-semibold text-xl tracking-tight">
            7 – Transferts hors Union européenne
          </h2>
          <p>
            Certains de nos prestataires (notamment Stripe et Vercel) sont
            susceptibles de traiter des données depuis les États-Unis. Ces
            transferts sont encadrés par des garanties appropriées prévues
            par le Règlement Général sur la Protection des Données (clauses
            contractuelles types ou mécanismes équivalents).
          </p>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="font-semibold text-xl tracking-tight">
            8 – Durée de conservation
          </h2>
          <p>
            Vos données de compte et de profil sont conservées pendant toute
            la durée de vie de votre compte, puis archivées ou supprimées
            dans les délais nécessaires au respect de nos obligations légales
            (notamment comptables) après sa clôture. Les données de
            facturation sont conservées conformément aux durées légales de
            conservation applicables en matière comptable et fiscale. Les
            annonces et messages sont conservés tant que le compte associé
            est actif, et peuvent être supprimés à votre demande dans les
            conditions décrites à l&apos;article 10.
          </p>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="font-semibold text-xl tracking-tight">
            9 – Cookies
          </h2>
          <p>
            Le Site utilise des cookies strictement nécessaires à son
            fonctionnement, notamment pour maintenir votre session connectée
            (authentification Supabase) et pour le traitement sécurisé des
            paiements par Stripe lors de la souscription d&apos;un
            abonnement. Ces cookies ne nécessitent pas de consentement
            préalable car ils sont indispensables à la fourniture du
            service que vous avez demandé.
          </p>
          <p>
            Le Site n&apos;utilise, à ce jour, aucun cookie publicitaire ni
            aucun outil de mesure d&apos;audience tiers. Pour plus de
            détails, consultez notre page{" "}
            <a
              className="underline hover:text-foreground"
              href="/gestion-des-cookies"
            >
              Gestion des cookies
            </a>
            .
          </p>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="font-semibold text-xl tracking-tight">
            10 – Vos droits
          </h2>
          <p>
            Conformément au Règlement Général sur la Protection des Données
            (RGPD) et à la loi Informatique et Libertés, vous disposez d&apos;un
            droit d&apos;accès, de rectification, d&apos;effacement, de
            limitation, d&apos;opposition et de portabilité de vos données,
            ainsi que du droit de définir des directives relatives à leur
            sort après votre décès.
          </p>
          <p>
            Vous pouvez exercer ces droits directement depuis votre espace
            personnel (rubrique « Mon profil ») pour la mise à jour de vos
            informations, ou en nous contactant à l&apos;adresse{" "}
            <a
              className="underline hover:text-foreground"
              href="mailto:contact@superentreprise.com"
            >
              contact@superentreprise.com
            </a>
            . Vous disposez également du droit d&apos;introduire une
            réclamation auprès de la Commission Nationale de
            l&apos;Informatique et des Libertés (CNIL) — www.cnil.fr.
          </p>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="font-semibold text-xl tracking-tight">
            11 – Sécurité
          </h2>
          <p>
            Superentreprise met en œuvre les mesures techniques et
            organisationnelles appropriées pour protéger vos données contre
            toute perte, accès non autorisé, divulgation ou altération,
            notamment via le chiffrement des mots de passe et des règles de
            sécurité au niveau de la base de données (Row Level Security)
            garantissant que chaque utilisateur n&apos;accède qu&apos;aux
            données auxquelles il a légitimement droit.
          </p>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="font-semibold text-xl tracking-tight">
            12 – Modification de la politique de confidentialité
          </h2>
          <p>
            La présente politique de confidentialité peut être modifiée à
            tout moment afin de s&apos;adapter aux évolutions du Site ou de
            la réglementation. La version applicable est celle publiée sur
            le Site à la date de votre visite.
          </p>
        </section>
      </div>
    </article>
  );
}
