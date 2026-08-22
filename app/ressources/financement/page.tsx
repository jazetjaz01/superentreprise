import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Financement | Superentreprise",
  description:
    "Les principales solutions pour financer la reprise d'une entreprise, d'un commerce ou d'un fonds de commerce.",
};

export default function FinancementPage() {
  return (
    <article className="mx-auto w-full max-w-(--breakpoint-lg) px-6 py-12">
      <h1 className="font-semibold text-3xl tracking-tight">Financement</h1>
      <p className="mt-2 text-muted-foreground text-lg">
        Les principales solutions pour financer la reprise d&apos;une
        entreprise, d&apos;un commerce ou d&apos;un fonds de commerce.
      </p>

      <div className="mt-10 flex flex-col gap-10 text-base text-foreground/90 leading-relaxed">
        <section className="flex flex-col gap-3">
          <h2 className="font-semibold text-xl tracking-tight">
            L&apos;apport personnel
          </h2>
          <p>
            La plupart des financeurs demandent un apport personnel
            représentant généralement 20 à 30 % du montant de la reprise. Il
            démontre votre engagement dans le projet et facilite l&apos;accès
            aux autres sources de financement.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="font-semibold text-xl tracking-tight">
            Le prêt bancaire professionnel
          </h2>
          <p>
            La banque reste la principale source de financement d&apos;une
            reprise. Elle étudiera votre dossier (business plan, capacité de
            remboursement, garanties) et peut couvrir une part importante du
            prix de cession, en complément de votre apport.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="font-semibold text-xl tracking-tight">
            Le crédit vendeur
          </h2>
          <p>
            Le cédant accepte d&apos;être payé en plusieurs fois, tout ou
            partie du prix étant réglé après la vente. Cette solution réduit
            le besoin de financement initial et rassure les banques, car elle
            montre la confiance du vendeur dans la pérennité de
            l&apos;activité transmise.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="font-semibold text-xl tracking-tight">
            Les garanties et prêts d&apos;honneur
          </h2>
          <p>
            Des organismes comme Bpifrance, Initiative France ou les Réseaux
            Entreprendre proposent des garanties bancaires et des prêts
            d&apos;honneur sans intérêt ni garantie personnelle, qui viennent
            renforcer votre apport et faciliter l&apos;obtention d&apos;un
            prêt bancaire.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="font-semibold text-xl tracking-tight">
            Les aides régionales et sectorielles
          </h2>
          <p>
            Selon votre région et votre secteur d&apos;activité, des
            subventions ou avances remboursables peuvent être mobilisées.
            Renseignez-vous auprès de votre Chambre de Commerce et
            d&apos;Industrie (CCI) ou de votre Chambre de Métiers et de
            l&apos;Artisanat (CMA).
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="font-semibold text-xl tracking-tight">
            Le love money et les investisseurs privés
          </h2>
          <p>
            Famille, proches ou investisseurs privés (business angels)
            peuvent également participer au financement, en fonds propres ou
            sous forme de prêt. Cette solution est particulièrement utile
            pour compléter un plan de financement serré.
          </p>
        </section>
      </div>
    </article>
  );
}
