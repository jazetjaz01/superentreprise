"use client";

import { ImagePlus, Loader2, Plus, Star, Trash2 } from "lucide-react";
import { useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { stockImages } from "@/lib/annonces/stock-images";
import { compressImage } from "@/lib/images/compress-image";
import { cn } from "@/lib/utils";
import type { Tables } from "@/lib/supabase/database.types";

const BUCKET = "annonces-images";
const MAX_IMAGES = 5;

type AnnonceImage = Tables<"annonce_images">;

function publicUrlFor(storagePath: string) {
  const supabase = createClient();
  return supabase.storage.from(BUCKET).getPublicUrl(storagePath).data
    .publicUrl;
}

export function AnnoncePhotoUploader({
  annonceId,
  initialImages,
}: {
  annonceId: string;
  initialImages: AnnonceImage[];
}) {
  const [images, setImages] = useState(initialImages);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const remainingSlots = MAX_IMAGES - images.length;

  const uploadOneFile = async (file: File, position: number) => {
    const supabase = createClient();
    const compressedFile = await compressImage(file);
    const path = `${annonceId}/${crypto.randomUUID()}-${compressedFile.name}`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(path, compressedFile);

    if (uploadError) {
      setError(uploadError.message);
      return null;
    }

    const { data: row, error: insertError } = await supabase
      .from("annonce_images")
      .insert({
        annonce_id: annonceId,
        storage_path: path,
        position,
        is_cover: position === 0,
      })
      .select("*")
      .single();

    if (insertError || !row) {
      setError(insertError?.message ?? "Échec de l'enregistrement.");
      return null;
    }

    return row;
  };

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const selected = Array.from(files).slice(0, remainingSlots);
    if (files.length > selected.length) {
      setError(
        `Vous ne pouvez ajouter que ${MAX_IMAGES} photos maximum par annonce.`,
      );
    } else {
      setError(null);
    }
    if (selected.length === 0) return;

    setUploading(true);
    try {
      let nextPosition = images.length;
      for (const file of selected) {
        const row = await uploadOneFile(file, nextPosition);
        if (row) {
          nextPosition += 1;
          setImages((current) => [...current, row]);
        }
      }
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const handleUseStockImage = async (stockUrl: string) => {
    if (remainingSlots <= 0) return;

    setUploading(true);
    setError(null);
    try {
      const response = await fetch(stockUrl);
      const blob = await response.blob();
      const file = new File([blob], stockUrl.split("/").pop()!, {
        type: blob.type || "image/jpeg",
      });

      const row = await uploadOneFile(file, images.length);
      if (row) {
        setImages((current) => [...current, row]);
      }
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (image: AnnonceImage) => {
    const supabase = createClient();
    await supabase.storage.from(BUCKET).remove([image.storage_path]);
    await supabase.from("annonce_images").delete().eq("id", image.id);
    setImages((current) => current.filter((item) => item.id !== image.id));
  };

  const handleSetCover = async (image: AnnonceImage) => {
    const supabase = createClient();
    await supabase
      .from("annonce_images")
      .update({ is_cover: false })
      .eq("annonce_id", annonceId);
    await supabase
      .from("annonce_images")
      .update({ is_cover: true })
      .eq("id", image.id);

    setImages((current) =>
      current.map((item) => ({ ...item, is_cover: item.id === image.id })),
    );
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {images.map((image) => (
          <div
            key={image.id}
            className="group relative aspect-square overflow-hidden rounded-lg bg-muted"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={publicUrlFor(image.storage_path)}
              alt=""
              className="size-full object-cover"
            />
            {image.is_cover && (
              <span className="absolute top-1.5 left-1.5 rounded-full bg-foreground px-2 py-0.5 text-[10px] text-background">
                Photo principale
              </span>
            )}
            <div className="absolute inset-x-0 bottom-0 flex items-center justify-end gap-1 bg-linear-to-t from-black/60 to-transparent p-1.5 opacity-0 transition-opacity group-hover:opacity-100">
              {!image.is_cover && (
                <button
                  type="button"
                  onClick={() => handleSetCover(image)}
                  className="rounded-full bg-background/90 p-1.5 text-foreground hover:bg-background"
                  aria-label="Définir comme photo principale"
                >
                  <Star className="size-3.5" />
                </button>
              )}
              <button
                type="button"
                onClick={() => handleDelete(image)}
                className="rounded-full bg-background/90 p-1.5 text-destructive hover:bg-background"
                aria-label="Supprimer la photo"
              >
                <Trash2 className="size-3.5" />
              </button>
            </div>
          </div>
        ))}

        {remainingSlots > 0 && (
          <label
            className={cn(
              "flex aspect-square cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-input border-dashed text-muted-foreground text-xs hover:bg-muted",
              uploading && "pointer-events-none opacity-60",
            )}
          >
            {uploading ? (
              <Loader2 className="size-5 animate-spin" />
            ) : (
              <ImagePlus className="size-5" />
            )}
            Ajouter
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(event) => handleFiles(event.target.files)}
            />
          </label>
        )}
      </div>

      <p className="text-muted-foreground text-xs">
        {images.length} / {MAX_IMAGES} photos
      </p>

      {error && (
        <p className="text-destructive text-sm" aria-live="polite">
          {error}
        </p>
      )}

      {remainingSlots > 0 && (
        <div className="flex flex-col gap-2 border-border border-t pt-4">
          <p className="text-sm">
            Pas de photo sous la main ? Choisissez une image parmi notre
            bibliothèque.
          </p>
          <div className="flex flex-wrap gap-3">
            {stockImages.map((stock) => (
              <button
                key={stock.url}
                type="button"
                disabled={uploading}
                onClick={() => handleUseStockImage(stock.url)}
                className="group relative size-28 shrink-0 overflow-hidden rounded-md ring-1 ring-border disabled:pointer-events-none disabled:opacity-60"
                title={stock.label}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={stock.url}
                  alt={stock.label}
                  className="size-full object-cover"
                />
                <span className="absolute inset-0 flex items-center justify-center bg-black/0 text-transparent transition-colors group-hover:bg-black/40 group-hover:text-white">
                  <Plus className="size-6" />
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
