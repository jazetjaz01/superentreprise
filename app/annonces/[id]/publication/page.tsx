import Link from "next/link";
import { PublishButton } from "./publish-button";
import { Button } from "@/components/ui/button";
import { getMissingFields } from "@/lib/annonces/get-missing-fields";
import { getOwnedAnnonce } from "@/lib/annonces/get-owned-annonce";
import { getActivityDisplayLabel } from "@/lib/annonces/activities";
import { transactionTypes } from "@/lib/annonces/options";
import { createClient } from "@/lib/supabase/server";

const priceFormatter = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

export default async function PublicationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { annonce, images } = await getOwnedAnnonce(id);
  const missingFields = getMissingFields(annonce, images);

  const supabase = await createClient();

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("status")
    .eq("user_id", annonce.author_id)
    .maybeSingle();

  const isSubscriptionActive =
    subscription?.status === "active" || subscription?.status === "trialing";

  const imageUrls = images.map(
    (image) =>
      supabase.storage.from("annonces-images").getPublicUrl(image.storage_path)
        .data.publicUrl,
  );

  const transactionTypeLabel = transactionTypes.find(
    (item) => item.value === annonce.transaction_type,
  )?.label;
  const activityLabel = getActivityDisplayLabel(annonce.activity);

  return (
    <div className="flex max-w-lg flex-col gap-5">
      <div>
        <h1 className="font-semibold text-xl">Publication</h1>
        <p className="mt-1 text-muted-foreground text-sm">
          Vérifiez les informations avant de publier votre annonce.
        </p>
      </div>

      <div className="flex flex-col gap-3 rounded-lg border border-border p-4 text-sm">
        <div className="flex justify-between gap-4">
          <span className="text-muted-foreground">Titre</span>
          <span className="text-right font-medium">{annonce.title}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-muted-foreground">Type de transaction</span>
          <span className="text-right font-medium">
            {transactionTypeLabel ?? "—"}
          </span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-muted-foreground">Activité</span>
          <span className="text-right font-medium">{activityLabel ?? "—"}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-muted-foreground">Prix</span>
          <span className="text-right font-medium">
            {annonce.price != null ? priceFormatter.format(annonce.price) : "—"}
          </span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-muted-foreground">Ville</span>
          <span className="text-right font-medium">
            {annonce.city ?? "—"}
          </span>
        </div>

        {annonce.description_short && (
          <div className="flex flex-col gap-1">
            <span className="text-muted-foreground">Résumé court</span>
            <span className="font-medium">{annonce.description_short}</span>
          </div>
        )}

        {annonce.description_long && (
          <div className="flex flex-col gap-1">
            <span className="text-muted-foreground">Description</span>
            <span className="whitespace-pre-line font-medium">
              {annonce.description_long}
            </span>
          </div>
        )}

        {imageUrls.length > 0 && (
          <div className="flex gap-2 pt-1">
            {imageUrls.map((url) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={url}
                src={url}
                alt=""
                className="size-16 rounded-md object-cover"
              />
            ))}
          </div>
        )}
      </div>

      {missingFields.length > 0 ? (
        <div className="rounded-lg border border-border bg-muted/50 p-4 text-sm">
          <p className="font-medium">Informations manquantes :</p>
          <ul className="mt-2 flex flex-col gap-1.5">
            {missingFields.map((field) => (
              <li key={field.label}>
                <Link
                  href={`/annonces/${id}/${field.step}`}
                  className="text-foreground underline underline-offset-2"
                >
                  {field.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : isSubscriptionActive ? (
        <PublishButton annonceId={id} />
      ) : (
        <div className="flex flex-col gap-2 rounded-lg border border-border bg-muted/50 p-4 text-sm">
          <p>
            Un abonnement de <span className="font-medium">30 € TTC / mois</span> est
            nécessaire pour diffuser votre annonce.
          </p>
          <form action="/api/stripe/checkout" method="POST">
            <Button type="submit" className="w-full rounded-full">
              S&apos;abonner et publier
            </Button>
          </form>
        </div>
      )}

      <div className="pt-2">
        <Link
          href={`/annonces/${id}/photos`}
          className="text-muted-foreground text-sm hover:text-foreground"
        >
          Précédent
        </Link>
      </div>
    </div>
  );
}
