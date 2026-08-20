import { ImageOff } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { startConversation } from "./actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { getActivityDisplayLabel } from "@/lib/annonces/activities";
import { getDepartment } from "@/lib/annonces/departments";
import { transactionTypes } from "@/lib/annonces/options";
import { getDisplayName } from "@/lib/profile/display-name";
import { createClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";

const priceFormatter = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

export default async function AnnonceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: annonce } = await supabase
    .from("annonces")
    .select("*, annonce_images(*)")
    .eq("id", id)
    .single();

  if (!annonce) {
    notFound();
  }

  const isOwner = user?.id === annonce.author_id;

  if (annonce.status !== "publiee" && !isOwner) {
    notFound();
  }

  const images = [...(annonce.annonce_images ?? [])].sort(
    (a, b) => a.position - b.position,
  );
  const imageUrls = images.map(
    (image) =>
      supabase.storage.from("annonces-images").getPublicUrl(image.storage_path)
        .data.publicUrl,
  );

  const { data: seller } = await supabase
    .from("public_profiles")
    .select("*")
    .eq("id", annonce.author_id)
    .maybeSingle();
  const sellerName = getDisplayName(seller, "Vendeur");
  const { count: sellerAnnoncesCount } = await supabase
    .from("annonces")
    .select("id", { count: "exact", head: true })
    .eq("author_id", annonce.author_id)
    .eq("status", "publiee");

  const activityLabel = getActivityDisplayLabel(annonce.activity);
  const transactionTypeLabel = transactionTypes.find(
    (item) => item.value === annonce.transaction_type,
  )?.label;
  const department = getDepartment(annonce.postal_code);

  const stats = [
    { label: "Chiffre d'affaires", value: annonce.revenue },
    { label: "EBITDA", value: annonce.ebitda },
    { label: "Loyer mensuel", value: annonce.rent },
  ].filter((stat) => stat.value != null);

  return (
    <div className="mx-auto w-full max-w-(--breakpoint-2xl) px-6 py-12">
      {isOwner && annonce.status !== "publiee" && (
        <div className="mb-6 flex items-center justify-between rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm">
          <span>
            Aperçu uniquement — cette annonce n&apos;est pas publiée et n&apos;est
            visible que par vous.
          </span>
          <Button
            render={<Link href={`/annonces/${annonce.id}/publication`} />}
            nativeButton={false}
            size="sm"
            variant="outline"
            className="rounded-full"
          >
            Publier
          </Button>
        </div>
      )}

      {isOwner && annonce.status === "publiee" && (
        <div className="mb-6 flex items-center justify-between rounded-lg border border-border bg-muted/50 px-4 py-3 text-sm">
          <span className="text-muted-foreground">
            C&apos;est votre annonce.
          </span>
          <Button
            render={<Link href={`/annonces/${annonce.id}/activite`} />}
            nativeButton={false}
            size="sm"
            variant="outline"
            className="rounded-full"
          >
            Modifier
          </Button>
        </div>
      )}

      {imageUrls.length > 0 ? (
        <div
          className={cn(
            "flex flex-col gap-2 overflow-hidden rounded-xl lg:grid lg:h-105",
            imageUrls.length === 1 && "lg:grid-cols-1",
            imageUrls.length === 2 && "lg:grid-cols-2",
            imageUrls.length === 3 && "lg:grid-cols-3 lg:grid-rows-2",
            imageUrls.length === 4 && "lg:grid-cols-2 lg:grid-rows-3",
            imageUrls.length >= 5 && "lg:grid-cols-4 lg:grid-rows-2",
          )}
        >
          {imageUrls.map((url, index) => (
            <div
              key={url}
              className={cn(
                "relative aspect-4/3 bg-muted lg:aspect-auto",
                index === 0 &&
                  imageUrls.length === 3 &&
                  "lg:col-span-2 lg:row-span-2",
                index === 0 &&
                  imageUrls.length === 4 &&
                  "lg:row-span-3",
                index === 0 &&
                  imageUrls.length >= 5 &&
                  "lg:col-span-2 lg:row-span-2",
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt={index === 0 ? annonce.title : ""}
                className="size-full object-cover"
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex h-105 w-full items-center justify-center rounded-xl bg-muted text-muted-foreground">
          <ImageOff className="size-8" />
        </div>
      )}

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="flex flex-col gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-muted-foreground text-sm">
              {activityLabel && <span>{activityLabel}</span>}
              {department && (
                <>
                  <span>·</span>
                  <span>
                    {annonce.hide_exact_location
                      ? department.name
                      : `${annonce.city} (${department.code})`}
                  </span>
                </>
              )}
            </div>
            <h1 className="mt-1 font-semibold text-3xl tracking-tight">
              {annonce.title}
            </h1>
          </div>

          {annonce.description_short && (
            <p className="text-lg text-muted-foreground">
              {annonce.description_short}
            </p>
          )}

          {stats.length > 0 && (
            <div className="grid grid-cols-3 gap-4 rounded-lg border border-border p-4">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <div className="text-muted-foreground text-xs">
                    {stat.label}
                  </div>
                  <div className="font-semibold">
                    {priceFormatter.format(stat.value!)}
                  </div>
                </div>
              ))}
            </div>
          )}

          {annonce.description_long && (
            <div className="flex flex-col gap-2">
              <h2 className="font-semibold text-lg">Description</h2>
              <p className="whitespace-pre-line text-muted-foreground">
                {annonce.description_long}
              </p>
            </div>
          )}
        </div>

        <div className="flex h-fit flex-col gap-8">
          {!isOwner && (
            <div className="flex flex-col gap-4 rounded-xl border border-border p-5">
              {seller?.company_name && (
                <div>
                  <div className="font-semibold text-lg">
                    {seller.company_name}
                  </div>
                  {seller.company_city && (
                    <div className="text-muted-foreground text-sm">
                      {seller.company_city}
                    </div>
                  )}
                </div>
              )}

              <div className="flex items-center gap-3">
                <Avatar className="size-14">
                  <AvatarImage src={seller?.avatar_url ?? undefined} alt={sellerName} />
                  <AvatarFallback className="text-lg">
                    {sellerName.slice(0, 1).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-semibold text-lg">{sellerName}</div>
                  {sellerAnnoncesCount != null && sellerAnnoncesCount > 0 && (
                    <div className="text-muted-foreground text-sm">
                      {sellerAnnoncesCount} annonce
                      {sellerAnnoncesCount > 1 ? "s" : ""}
                    </div>
                  )}
                </div>
              </div>

              <form action={startConversation}>
                <input type="hidden" name="annonceId" value={annonce.id} />
                <Button type="submit" className="w-full rounded-full">
                  Contacter
                </Button>
              </form>
            </div>
          )}

          <aside className="flex flex-col gap-4 rounded-xl border border-border p-5">
            <div>
              <div className="text-muted-foreground text-sm">Prix de vente</div>
              <div className="font-semibold text-2xl">
                {annonce.price != null
                  ? priceFormatter.format(annonce.price)
                  : "Prix sur demande"}
              </div>
            </div>
            {transactionTypeLabel && (
              <div>
                <div className="text-muted-foreground text-sm">
                  Type de transaction
                </div>
                <div className="font-medium">{transactionTypeLabel}</div>
              </div>
            )}
            {annonce.employees_count != null && (
              <div>
                <div className="text-muted-foreground text-sm">Salariés</div>
                <div className="font-medium">{annonce.employees_count}</div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
