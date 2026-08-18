import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Conditions générales d'utilisation | Superentreprise",
  description:
    "Conditions générales d'utilisation et d'abonnement du site Superentreprise.com.",
};

export default function ConditionsGeneralesPage() {
  return (
    <article className="mx-auto w-full max-w-(--breakpoint-lg) px-6 py-12">
      <h1 className="font-semibold text-3xl tracking-tight">
        Conditions générales d&apos;utilisation
      </h1>
      <p className="mt-2 text-muted-foreground text-sm">
        Dernière mise à jour : 18 août 2026
      </p>

      <div className="mt-8 flex flex-col gap-10 text-base text-foreground/90 leading-relaxed">
        <section className="flex flex-col gap-4">
          <h2 className="font-semibold text-xl tracking-tight">
            1 – Objet et champ d&apos;application
          </h2>
          <p>
            Les présentes conditions générales d&apos;utilisation (les « CGU »)
            régissent l&apos;accès et l&apos;utilisation du site
            www.superentreprise.com (le « Site »), édité par Merci
            Immobilier, dont les coordonnées figurent dans les{" "}
            <a className="underline hover:text-foreground" href="/mentions-legales">
              mentions légales
            </a>
            .
          </p>
          <p>
            Le Site met en relation des cédants d&apos;entreprises, de
            commerces ou de fonds de commerce (les « Vendeurs ») et des
            personnes intéressées par leur reprise (les « Acheteurs »), ci-
            après désignés ensemble les « Utilisateurs ». Toute création de
            compte et toute utilisation du Site impliquent l&apos;acceptation
            pleine et entière des présentes CGU.
          </p>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="font-semibold text-xl tracking-tight">
            2 – Inscription et compte utilisateur
          </h2>
          <p>
            L&apos;inscription est gratuite et ouverte à toute personne
            physique majeure ou personne morale. Elle s&apos;effectue par
            email et mot de passe ou via un compte Google, et requiert de
            préciser sa qualité de Vendeur ou d&apos;Acheteur.
          </p>
          <p>
            L&apos;Utilisateur s&apos;engage à fournir des informations
            exactes, à jour et complètes lors de son inscription et à les
            maintenir à jour. Il est seul responsable de la confidentialité
            de ses identifiants et de toute activité effectuée depuis son
            compte.
          </p>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="font-semibold text-xl tracking-tight">
            3 – Dépôt et diffusion des annonces
          </h2>
          <p>
            Tout Vendeur peut créer une annonce décrivant l&apos;entreprise,
            le commerce ou le fonds de commerce qu&apos;il souhaite céder. Le
            Vendeur garantit l&apos;exactitude des informations qu&apos;il
            publie (activité, localisation, données financières, photos) et
            s&apos;engage à ne diffuser aucun contenu trompeur, illicite ou
            portant atteinte aux droits de tiers.
          </p>
          <p>
            La diffusion effective d&apos;une annonce sur le Site est
            conditionnée à la souscription d&apos;un abonnement actif, décrit
            à l&apos;article 4. Une annonce incomplète ou dont l&apos;abonnement
            n&apos;est pas actif n&apos;est pas visible des Acheteurs.
          </p>
          <p>
            Superentreprise se réserve le droit de refuser la publication ou
            de retirer, sans préavis ni indemnité, toute annonce contraire
            aux présentes CGU, à la loi ou aux bonnes mœurs.
          </p>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="font-semibold text-xl tracking-tight">
            4 – Abonnement, résiliation et renouvellement
          </h2>

          <div>
            <h3 className="font-medium">4.1 Formule et tarif</h3>
            <p className="mt-2">
              La diffusion d&apos;une annonce est proposée sous la forme
              d&apos;un abonnement mensuel sans engagement de durée, au tarif
              de 30 € TTC par mois. Le tarif applicable est celui affiché sur
              le Site au moment de la souscription.
            </p>
          </div>

          <div>
            <h3 className="font-medium">4.2 Souscription et paiement</h3>
            <p className="mt-2">
              L&apos;abonnement est souscrit et géré via la solution de
              paiement Stripe. Le premier prélèvement intervient à la
              souscription ; les prélèvements suivants sont effectués
              automatiquement à chaque échéance mensuelle, à la même date
              anniversaire, sur le moyen de paiement enregistré par
              l&apos;Utilisateur.
            </p>
          </div>

          <div>
            <h3 className="font-medium">4.3 Renouvellement automatique</h3>
            <p className="mt-2">
              L&apos;abonnement se renouvelle automatiquement par tacite
              reconduction, pour une durée d&apos;un mois, sauf résiliation
              par l&apos;Utilisateur avant la date de renouvellement dans les
              conditions décrites ci-dessous. L&apos;Utilisateur est informé
              par email de chaque prélèvement via les reçus émis par Stripe.
            </p>
          </div>

          <div>
            <h3 className="font-medium">4.4 Résiliation</h3>
            <p className="mt-2">
              L&apos;Utilisateur peut résilier son abonnement à tout moment,
              sans frais ni justification, depuis son espace personnel
              (rubrique « Mon abonnement » &gt; « Résilier abonnement ») ou
              depuis le portail de facturation Stripe accessible depuis son
              compte.
            </p>
            <p className="mt-2">
              La résiliation prend effet à la fin de la période de facturation
              en cours : aucun remboursement au prorata n&apos;est effectué
              pour la période déjà payée, et l&apos;annonce reste diffusée
              jusqu&apos;à cette date. À l&apos;issue de la période en cours,
              aucun nouveau prélèvement n&apos;est effectué et
              l&apos;annonce associée est automatiquement dépubliée.
            </p>
          </div>

          <div>
            <h3 className="font-medium">4.5 Défaut de paiement</h3>
            <p className="mt-2">
              En cas d&apos;échec de prélèvement à une échéance de
              renouvellement, l&apos;abonnement peut être suspendu et
              l&apos;annonce dépubliée jusqu&apos;à régularisation du moyen de
              paiement. L&apos;Utilisateur peut mettre à jour son moyen de
              paiement à tout moment depuis son espace personnel.
            </p>
          </div>

          <div>
            <h3 className="font-medium">4.6 Modification tarifaire</h3>
            <p className="mt-2">
              Superentreprise se réserve le droit de faire évoluer le tarif
              de l&apos;abonnement. Toute modification sera communiquée à
              l&apos;Utilisateur avant son entrée en vigueur et ne
              s&apos;appliquera qu&apos;au renouvellement suivant sa prise
              d&apos;effet.
            </p>
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="font-semibold text-xl tracking-tight">
            5 – Messagerie entre Utilisateurs
          </h2>
          <p>
            Le Site propose une messagerie interne permettant aux Acheteurs
            et aux Vendeurs d&apos;échanger au sujet d&apos;une annonce.
            Chaque Utilisateur s&apos;engage à n&apos;utiliser cette
            messagerie qu&apos;à des fins liées à la cession ou à
            l&apos;acquisition d&apos;une entreprise, à l&apos;exclusion de
            tout démarchage, spam ou contenu illicite.
          </p>
          <p>
            Pour préserver la confidentialité des échanges, l&apos;affichage
            du nom et prénom d&apos;un Utilisateur peut être remplacé par un
            surnom qu&apos;il choisit de renseigner dans son profil.
            L&apos;envoi de messages requiert que l&apos;Utilisateur ait
            complété a minima son nom et prénom, ou un surnom.
          </p>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="font-semibold text-xl tracking-tight">
            6 – Responsabilité
          </h2>
          <p>
            Superentreprise agit en tant qu&apos;intermédiaire technique de
            mise en relation entre Vendeurs et Acheteurs et n&apos;intervient
            pas dans la négociation, la conclusion ou l&apos;exécution des
            transactions entre Utilisateurs. Superentreprise n&apos;est ni
            agent immobilier, ni conseil, ni partie aux transactions
            conclues entre Utilisateurs.
          </p>
          <p>
            Les informations publiées dans les annonces sont fournies à
            titre indicatif et sous la seule responsabilité de leur auteur.
            Superentreprise ne saurait être tenue responsable des erreurs,
            inexactitudes ou omissions qu&apos;elles pourraient contenir, ni
            des conséquences d&apos;une transaction conclue entre
            Utilisateurs.
          </p>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="font-semibold text-xl tracking-tight">
            7 – Données personnelles
          </h2>
          <p>
            Le traitement des données personnelles des Utilisateurs est
            décrit dans la politique de confidentialité du Site, accessible
            depuis le pied de page.
          </p>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="font-semibold text-xl tracking-tight">
            8 – Modification des CGU
          </h2>
          <p>
            Superentreprise se réserve le droit de modifier les présentes
            CGU à tout moment. Les CGU applicables sont celles en vigueur à
            la date de connexion de l&apos;Utilisateur au Site. En cas de
            modification substantielle affectant les conditions
            d&apos;abonnement, les Utilisateurs abonnés en seront informés
            préalablement.
          </p>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="font-semibold text-xl tracking-tight">
            9 – Droit applicable et litiges
          </h2>
          <p>
            Les présentes CGU sont régies par le droit français. Tout litige
            relatif à leur validité, leur interprétation ou leur exécution
            relève de la compétence exclusive des tribunaux français, sous
            réserve des dispositions d&apos;ordre public applicables aux
            consommateurs.
          </p>
        </section>
      </div>
    </article>
  );
}
