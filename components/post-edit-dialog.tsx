'use client'

import { ImageIcon, Pencil, VideoIcon, X } from 'lucide-react'
import NextImage from 'next/image'
import { useTranslations } from 'next-intl'
import { useRef, useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { useRouter } from '@/i18n/navigation'
import { createClient } from '@/lib/supabase/client'

const MAX_IMAGE_BYTES = 5 * 1024 * 1024
const IMAGE_EXTENSIONS: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
}

const MAX_VIDEO_BYTES = 50 * 1024 * 1024
const VIDEO_EXTENSIONS: Record<string, string> = {
  'video/mp4': 'mp4',
  'video/webm': 'webm',
  'video/quicktime': 'mov',
  'video/ogg': 'ogv',
}

type MediaKind = 'image' | 'video'

type PostEditDialogProps = {
  postId: string
  content: string | null
  imagePath: string | null
  imageUrl: string | null
  videoPath: string | null
  videoUrl: string | null
  uploaderId: string
}

export const PostEditDialog = ({
  postId,
  content,
  imagePath,
  imageUrl,
  videoPath,
  videoUrl,
  uploaderId,
}: PostEditDialogProps) => {
  const t = useTranslations('Feed')
  const router = useRouter()
  const imageInput = useRef<HTMLInputElement>(null)
  const videoInput = useRef<HTMLInputElement>(null)
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState(content ?? '')
  const [removeMedia, setRemoveMedia] = useState(false)
  const [newFile, setNewFile] = useState<File | null>(null)
  const [newFileKind, setNewFileKind] = useState<MediaKind | null>(null)
  const [newPreviewUrl, setNewPreviewUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const currentKind: MediaKind | null = imagePath ? 'image' : videoPath ? 'video' : null
  const currentUrl = imageUrl ?? videoUrl

  const resetMediaState = () => {
    setRemoveMedia(false)
    setNewFile(null)
    setNewFileKind(null)
    setNewPreviewUrl((current) => {
      if (current) URL.revokeObjectURL(current)
      return null
    })
  }

  const selectFile = (selected: File, kind: MediaKind) => {
    const extensions = kind === 'image' ? IMAGE_EXTENSIONS : VIDEO_EXTENSIONS
    const maxBytes = kind === 'image' ? MAX_IMAGE_BYTES : MAX_VIDEO_BYTES

    if (!(selected.type in extensions)) {
      setError(kind === 'image' ? t('fileType') : t('videoFileType'))
      return
    }
    if (selected.size > maxBytes) {
      setError(kind === 'image' ? t('fileTooLarge') : t('videoTooLarge'))
      return
    }
    setError(null)
    setNewFile(selected)
    setNewFileKind(kind)
    setNewPreviewUrl((current) => {
      if (current) URL.revokeObjectURL(current)
      return URL.createObjectURL(selected)
    })
    setRemoveMedia(false)
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    e.target.value = ''
    if (selected) selectFile(selected, 'image')
  }

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    e.target.value = ''
    if (selected) selectFile(selected, 'video')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsSubmitting(true)
    setError(null)

    let uploadedPath: string | null = null
    try {
      let nextImagePath = imagePath
      let nextVideoPath = videoPath

      if (newFile && newFileKind === 'image') {
        uploadedPath = `${uploaderId}/${crypto.randomUUID()}.${IMAGE_EXTENSIONS[newFile.type]}`
        const { error: uploadError } = await supabase.storage
          .from('post-images')
          .upload(uploadedPath, newFile, {
            contentType: newFile.type,
            cacheControl: '31536000',
          })
        if (uploadError) throw uploadError
        nextImagePath = uploadedPath
        nextVideoPath = null
      } else if (newFile && newFileKind === 'video') {
        uploadedPath = `${uploaderId}/${crypto.randomUUID()}.${VIDEO_EXTENSIONS[newFile.type]}`
        const { error: uploadError } = await supabase.storage
          .from('post-videos')
          .upload(uploadedPath, newFile, {
            contentType: newFile.type,
            cacheControl: '31536000',
          })
        if (uploadError) throw uploadError
        nextVideoPath = uploadedPath
        nextImagePath = null
      } else if (removeMedia) {
        nextImagePath = null
        nextVideoPath = null
      }

      const { error: updateError } = await supabase
        .from('posts')
        .update({ content: value.trim() || null, image_path: nextImagePath, video_path: nextVideoPath })
        .eq('id', postId)
      if (updateError) throw updateError

      if (imagePath && nextImagePath !== imagePath) {
        await supabase.storage.from('post-images').remove([imagePath])
      }
      if (videoPath && nextVideoPath !== videoPath) {
        await supabase.storage.from('post-videos').remove([videoPath])
      }

      setOpen(false)
      resetMediaState()
      router.refresh()
    } catch {
      if (uploadedPath) {
        const bucket = newFileKind === 'video' ? 'post-videos' : 'post-images'
        await supabase.storage.from(bucket).remove([uploadedPath])
      }
      setError(t('editError'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const showsCurrentMedia = !!currentUrl && !removeMedia && !newFile
  const displayedKind = newFile ? newFileKind : currentKind
  const displayedUrl = newPreviewUrl ?? (showsCurrentMedia ? currentUrl : null)

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label={t('edit')}
        onClick={() => setOpen(true)}
      >
        <Pencil className="size-4" />
      </Button>

      <Dialog
        open={open}
        onOpenChange={(next) => {
          setOpen(next)
          if (!next) {
            setValue(content ?? '')
            resetMediaState()
            setError(null)
          }
        }}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{t('editTitle')}</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Textarea
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={t('editPlaceholder')}
              maxLength={3000}
              rows={5}
              autoFocus
            />

            {displayedUrl && (
              <div className="relative">
                {displayedKind === 'video' ? (
                  // eslint-disable-next-line jsx-a11y/media-has-caption
                  <video src={displayedUrl} controls className="max-h-72 w-full rounded-lg" />
                ) : (
                  <NextImage
                    src={displayedUrl}
                    alt={t('previewAlt')}
                    width={800}
                    height={600}
                    unoptimized
                    className="max-h-72 w-full rounded-lg object-contain"
                  />
                )}
                <Button
                  type="button"
                  size="icon-sm"
                  variant="secondary"
                  aria-label={displayedKind === 'video' ? t('removeVideo') : t('removePhoto')}
                  className="absolute top-2 right-2"
                  onClick={() => {
                    if (newFile) {
                      resetMediaState()
                    } else {
                      setRemoveMedia(true)
                    }
                  }}
                >
                  <X />
                </Button>
              </div>
            )}

            <input
              ref={imageInput}
              type="file"
              accept={Object.keys(IMAGE_EXTENSIONS).join(',')}
              className="hidden"
              onChange={handleImageChange}
            />
            <input
              ref={videoInput}
              type="file"
              accept={Object.keys(VIDEO_EXTENSIONS).join(',')}
              className="hidden"
              onChange={handleVideoChange}
            />

            <div className="flex gap-1">
              {(!displayedUrl || displayedKind === 'image') && (
                <Button
                  type="button"
                  variant="ghost"
                  className="w-fit"
                  onClick={() => imageInput.current?.click()}
                >
                  <ImageIcon className="size-5 text-blue-800" />
                  {displayedUrl ? t('replacePhoto') : t('addPhoto')}
                </Button>
              )}
              {(!displayedUrl || displayedKind === 'video') && (
                <Button
                  type="button"
                  variant="ghost"
                  className="w-fit"
                  onClick={() => videoInput.current?.click()}
                >
                  <VideoIcon className="size-5 text-green-800" />
                  {displayedUrl ? t('replaceVideo') : t('addVideo')}
                </Button>
              )}
            </div>

            {error && <p className="text-base text-red-500">{error}</p>}

            <Button type="submit" disabled={isSubmitting} className="w-fit">
              {isSubmitting ? t('editSaving') : t('editSave')}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
