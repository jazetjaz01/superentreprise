import Link from "next/link";
import { AnnoncePhotoUploader } from "@/components/annonce-photo-uploader";
import { Button } from "@/components/ui/button";
import { getOwnedAnnonce } from "@/lib/annonces/get-owned-annonce";

export default async function PhotosPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { annonce, images } = await getOwnedAnnonce(id);

  return (
    <div className="flex max-w-lg flex-col gap-5">
      <div>
        <h1 className="font-semibold text-xl">Photos</h1>
        <p className="mt-1 text-muted-foreground text-sm">
          Les annonces avec plusieurs photos de qualité génèrent davantage de
          contacts.
        </p>
      </div>

      <AnnoncePhotoUploader
        annonceId={id}
        initialImages={images}
        activity={annonce.activity}
      />

      <div className="flex items-center justify-between pt-2">
        <Link
          href={`/annonces/${id}/localisation`}
          className="text-muted-foreground text-sm hover:text-foreground"
        >
          Précédent
        </Link>
        <Button
          render={<Link href={`/annonces/${id}/publication`} />}
          nativeButton={false}
          className="rounded-full"
        >
          Suivant
        </Button>
      </div>
    </div>
  );
}
