"use client";

import { useState } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

type Bucket = "article-covers" | "avatars";

const MAX_SIZE: Record<Bucket, number> = {
  "article-covers": 5 * 1024 * 1024,
  avatars: 2 * 1024 * 1024,
};
const ACCEPTED = ["image/jpeg", "image/png", "image/webp", "image/avif"];

// Envoie l'image dans Supabase Storage ({id utilisateur}/…) depuis le
// navigateur et transmet son URL publique au formulaire via un champ caché.
export const ImageUpload = ({
  bucket,
  userId,
  name,
  defaultValue,
  label,
  aspect = "aspect-[3/2]",
}: {
  bucket: Bucket;
  userId: string;
  name: string;
  defaultValue?: string | null;
  label: string;
  aspect?: string;
}) => {
  const [url, setUrl] = useState(defaultValue ?? "");
  // Image envoyée mais pas encore enregistrée avec le formulaire
  const [pendingPath, setPendingPath] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Supprime l'image intermédiaire (remplacée ou retirée avant enregistrement).
  // L'image déjà enregistrée est supprimée côté serveur après la sauvegarde.
  const discardPending = async () => {
    if (!pendingPath) return;
    await createClient().storage.from(bucket).remove([pendingPath]);
    setPendingPath(null);
  };

  const onChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = ""; // permet de resélectionner le même fichier
    if (!file) return;
    setError(null);

    if (!ACCEPTED.includes(file.type)) {
      setError("Formats acceptés : JPEG, PNG, WebP ou AVIF.");
      return;
    }
    if (file.size > MAX_SIZE[bucket]) {
      setError(`Image trop lourde (${MAX_SIZE[bucket] / 1024 / 1024} Mo maximum).`);
      return;
    }

    setUploading(true);
    const supabase = createClient();
    const extension = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
    const path = `${userId}/${crypto.randomUUID()}.${extension}`;
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(path, file, { contentType: file.type });
    setUploading(false);

    if (uploadError) {
      setError("L’envoi de l’image a échoué. Réessayez.");
      return;
    }
    await discardPending();
    setPendingPath(path);
    setUrl(supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl);
  };

  return (
    <div className="grid gap-2">
      <span className="text-sm font-medium">{label}</span>
      <input type="hidden" name={name} value={url} />
      <div className={`relative ${aspect} w-full overflow-hidden border border-dashed border-brand/30 bg-brand/5`}>
        {url ? (
          <Image src={url} alt="" fill sizes="400px" className="object-cover" />
        ) : (
          <span className="absolute inset-0 flex items-center justify-center text-sm text-muted-foreground">
            Aucune image
          </span>
        )}
      </div>
      <div className="flex items-center gap-4">
        <label className="cursor-pointer text-sm text-brand underline underline-offset-4">
          {uploading ? "Envoi en cours…" : url ? "Changer l’image" : "Choisir une image"}
          <input
            type="file"
            accept={ACCEPTED.join(",")}
            onChange={onChange}
            disabled={uploading}
            className="sr-only"
          />
        </label>
        {url && !uploading && (
          <button
            type="button"
            onClick={async () => {
              await discardPending();
              setUrl("");
            }}
            className="text-sm text-muted-foreground underline underline-offset-4"
          >
            Retirer
          </button>
        )}
      </div>
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
};
