import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";

export type ImageBucket = "article-covers" | "avatars";

const publicPrefix = (bucket: ImageBucket) =>
  `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${bucket}/`;

// N'accepte que les images envoyées par l'utilisateur dans son propre dossier
// du bucket (empêche d'enregistrer une URL externe arbitraire).
export const isOwnStorageUrl = (url: string, bucket: ImageBucket, userId: string) =>
  url.startsWith(`${publicPrefix(bucket)}${userId}/`);

// URL publique → chemin dans le bucket (« {userId}/{fichier} »)
export const storagePathFromUrl = (url: string, bucket: ImageBucket) =>
  decodeURIComponent(url.slice(publicPrefix(bucket).length));

// Supprime une image du bucket si elle appartient à l'utilisateur.
// Un échec n'empêche pas l'enregistrement : au pire un fichier orphelin reste.
export async function removeOwnImage(
  supabase: SupabaseClient<Database>,
  url: string | null | undefined,
  bucket: ImageBucket,
  userId: string
) {
  if (!url || !isOwnStorageUrl(url, bucket, userId)) return;
  await supabase.storage.from(bucket).remove([storagePathFromUrl(url, bucket)]);
}
