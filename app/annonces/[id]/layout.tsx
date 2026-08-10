import { AnnonceStepper } from "@/components/annonce-stepper";
import { getOwnedAnnonce } from "@/lib/annonces/get-owned-annonce";

export default async function AnnonceEditLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  await getOwnedAnnonce(id);

  return (
    <div className="mx-auto grid w-full max-w-(--breakpoint-lg) gap-8 px-6 py-12 lg:grid-cols-[220px_1fr]">
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <AnnonceStepper annonceId={id} />
      </aside>
      <div>{children}</div>
    </div>
  );
}
