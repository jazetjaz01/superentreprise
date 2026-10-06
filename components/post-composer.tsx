"use client";

import { ImageIcon, NewspaperIcon, VideoIcon, X } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { UserAvatar } from "@/components/user-avatar";
import { Link, useRouter } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/client";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const IMAGE_EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

const MAX_VIDEO_BYTES = 50 * 1024 * 1024;
const VIDEO_EXTENSIONS: Record<string, string> = {
  "video/mp4": "mp4",
  "video/webm": "webm",
  "video/quicktime": "mov",
  "video/ogg": "ogv",
};

type PostComposerProps = {
  userId: string;
  name: string;
  avatarUrl: string | null;
};

export const PostComposer = ({ userId, name, avatarUrl }: PostComposerProps) => {
  const t = useTranslations("Composer");
  const router = useRouter();
  const fileInput = useRef<HTMLInputElement>(null);
  const videoInput = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [fileKind, setFileKind] = useState<"image" | "video" | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [commentsDisabled, setCommentsDisabled] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const reset = () => {
    setContent("");
    setFile(null);
    setFileKind(null);
    setCommentsDisabled(false);
    setError(null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    e.target.value = "";
    if (!selected) return;

    if (!(selected.type in IMAGE_EXTENSIONS)) {
      setError(t("fileType"));
      return;
    }
    if (selected.size > MAX_IMAGE_BYTES) {
      setError(t("fileTooLarge"));
      return;
    }
    setError(null);
    setFile(selected);
    setFileKind("image");
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    e.target.value = "";
    if (!selected) return;

    if (!(selected.type in VIDEO_EXTENSIONS)) {
      setError(t("videoFileType"));
      return;
    }
    if (selected.size > MAX_VIDEO_BYTES) {
      setError(t("videoTooLarge"));
      return;
    }
    setError(null);
    setFile(selected);
    setFileKind("video");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = content.trim();
    if (!text && !file) return;

    const supabase = createClient();
    setIsSubmitting(true);
    setError(null);

    let imagePath: string | null = null;
    let videoPath: string | null = null;
    try {
      if (file && fileKind === "image") {
        imagePath = `${userId}/${crypto.randomUUID()}.${IMAGE_EXTENSIONS[file.type]}`;
        const { error: uploadError } = await supabase.storage
          .from("post-images")
          .upload(imagePath, file, {
            contentType: file.type,
            cacheControl: "31536000",
          });
        if (uploadError) throw uploadError;
      } else if (file && fileKind === "video") {
        videoPath = `${userId}/${crypto.randomUUID()}.${VIDEO_EXTENSIONS[file.type]}`;
        const { error: uploadError } = await supabase.storage
          .from("post-videos")
          .upload(videoPath, file, {
            contentType: file.type,
            cacheControl: "31536000",
          });
        if (uploadError) throw uploadError;
      }

      const { error: insertError } = await supabase.from("posts").insert({
        author_id: userId,
        content: text || null,
        image_path: imagePath,
        video_path: videoPath,
        comments_disabled: commentsDisabled,
      });
      if (insertError) throw insertError;

      reset();
      setOpen(false);
      router.refresh();
    } catch {
      if (imagePath) {
        await supabase.storage.from("post-images").remove([imagePath]);
      }
      if (videoPath) {
        await supabase.storage.from("post-videos").remove([videoPath]);
      }
      setError(t("error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Card>
        <CardContent className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <UserAvatar name={name} avatarUrl={avatarUrl} size={48} />
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="h-11 flex-1 rounded-full border border-border px-5 text-left font-medium text-foreground transition-colors hover:bg-foreground/[.07]"
            >
              {t("start")}
            </button>
          </div>
          <div className="flex justify-center gap-2">
            <Button variant="ghost" onClick={() => setOpen(true)}>
              <ImageIcon className="size-8 text-blue-800" />
              <span className="text-base font-medium text-foreground">{t("photo")}</span>
            </Button>
            <Button variant="ghost" onClick={() => setOpen(true)}>
              <VideoIcon className="size-8 text-green-800" />
              <span className="text-base font-medium text-foreground">{t("video")}</span>
            </Button>
            <Button variant="ghost" nativeButton={false} render={<Link href="/articles/write" />}>
              <NewspaperIcon className="size-8 text-orange-500" />
              <span className="text-base font-medium text-foreground">{t("writeArticle")}</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>{t("dialogTitle")}</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <UserAvatar name={name} avatarUrl={avatarUrl} size={48} />
              <span className="font-medium">{name}</span>
            </div>

            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={t("textPlaceholder")}
              maxLength={3000}
              rows={5}
              className="max-h-64 resize-none border-0 px-0 text-base shadow-none focus-visible:ring-0"
            />

            {previewUrl && fileKind === "image" && (
              <div className="relative">
                <Image
                  src={previewUrl}
                  alt={t("previewAlt")}
                  width={800}
                  height={600}
                  unoptimized
                  className="max-h-72 w-full rounded-lg object-contain"
                />
                <Button
                  type="button"
                  size="icon-sm"
                  variant="secondary"
                  aria-label={t("removePhoto")}
                  className="absolute top-2 right-2"
                  onClick={() => setFile(null)}
                >
                  <X />
                </Button>
              </div>
            )}

            {previewUrl && fileKind === "video" && (
              <div className="relative">
                {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
                <video
                  src={previewUrl}
                  controls
                  className="max-h-72 w-full rounded-lg"
                />
                <Button
                  type="button"
                  size="icon-sm"
                  variant="secondary"
                  aria-label={t("removeVideo")}
                  className="absolute top-2 right-2"
                  onClick={() => setFile(null)}
                >
                  <X />
                </Button>
              </div>
            )}

            <label className="flex items-center gap-2 text-base text-foreground">
              <input
                type="checkbox"
                checked={commentsDisabled}
                onChange={(e) => setCommentsDisabled(e.target.checked)}
                className="accent-primary size-4"
              />
              {t("disableComments")}
            </label>

            {error && <p className="text-base text-red-500">{error}</p>}

            <div className="flex items-center justify-between">
              <div className="flex gap-1">
                <input
                  ref={fileInput}
                  type="file"
                  accept={Object.keys(IMAGE_EXTENSIONS).join(",")}
                  className="hidden"
                  onChange={handleImageChange}
                />
                <Button
                  type="button"
                  variant="ghost"
                  disabled={fileKind === "video"}
                  onClick={() => fileInput.current?.click()}
                >
                  <ImageIcon className="size-5 text-blue-800" />
                  <span className="text-base font-medium text-foreground">{t("addPhoto")}</span>
                </Button>
                <input
                  ref={videoInput}
                  type="file"
                  accept={Object.keys(VIDEO_EXTENSIONS).join(",")}
                  className="hidden"
                  onChange={handleVideoChange}
                />
                <Button
                  type="button"
                  variant="ghost"
                  disabled={fileKind === "image"}
                  onClick={() => videoInput.current?.click()}
                >
                  <VideoIcon className="size-5 text-green-800" />
                  <span className="text-base font-medium text-foreground">{t("addVideo")}</span>
                </Button>
              </div>
              <Button
                type="submit"
                disabled={isSubmitting || (!content.trim() && !file)}
              >
                {isSubmitting ? t("publishing") : t("publish")}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};
