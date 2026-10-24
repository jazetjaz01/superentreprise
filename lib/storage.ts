// N'accepte que les images envoyées par l'utilisateur dans son propre dossier
// du bucket (empêche d'enregistrer une URL externe arbitraire).
export const isOwnStorageUrl = (
  url: string,
  bucket: "article-covers" | "avatars",
  userId: string
) =>
  url.startsWith(
    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${bucket}/${userId}/`
  );
