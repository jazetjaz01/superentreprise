"use client";

import { ImagePlus, Loader2 } from "lucide-react";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const BUCKET = "blog-images";

export function BlogCoverUploader() {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [path, setPath] = useState("");

  const handleChange = async (file: File | undefined) => {
    if (!file) return;

    setUploading(true);
    setError(null);
    const supabase = createClient();
    const storagePath = `${crypto.randomUUID()}-${file.name}`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(storagePath, file);

    if (uploadError) {
      setError(uploadError.message);
      setUploading(false);
      return;
    }

    setPath(storagePath);
    setPreview(
      supabase.storage.from(BUCKET).getPublicUrl(storagePath).data.publicUrl,
    );
    setUploading(false);
  };

  return (
    <div className="flex flex-col gap-2">
      <label
        className={cn(
          "flex aspect-video w-full max-w-sm cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-lg border border-input border-dashed text-muted-foreground text-xs hover:bg-muted",
          uploading && "pointer-events-none opacity-60",
        )}
      >
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="" className="size-full object-cover" />
        ) : uploading ? (
          <Loader2 className="size-5 animate-spin" />
        ) : (
          <>
            <ImagePlus className="size-5" />
            Ajouter une image de couverture
          </>
        )}
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(event) => handleChange(event.target.files?.[0])}
        />
      </label>

      {error && (
        <p className="text-destructive text-sm" aria-live="polite">
          {error}
        </p>
      )}

      <input type="hidden" name="cover_image_path" value={path} />
    </div>
  );
}
