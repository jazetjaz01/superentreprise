'use client'

import { ImageIcon, Pencil, X } from 'lucide-react'
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

type PostEditDialogProps = {
  postId: string
  content: string | null
  imagePath: string | null
  imageUrl: string | null
  uploaderId: string
}

export const PostEditDialog = ({
  postId,
  content,
  imagePath,
  imageUrl,
  uploaderId,
}: PostEditDialogProps) => {
  const t = useTranslations('Feed')
  const router = useRouter()
  const fileInput = useRef<HTMLInputElement>(null)
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState(content ?? '')
  const [removeImage, setRemoveImage] = useState(false)
  const [newFile, setNewFile] = useState<File | null>(null)
  const [newPreviewUrl, setNewPreviewUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const resetImageState = () => {
    setRemoveImage(false)
    setNewFile(null)
    setNewPreviewUrl((current) => {
      if (current) URL.revokeObjectURL(current)
      return null
    })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    e.target.value = ''
    if (!selected) return

    if (!(selected.type in IMAGE_EXTENSIONS)) {
      setError(t('fileType'))
      return
    }
    if (selected.size > MAX_IMAGE_BYTES) {
      setError(t('fileTooLarge'))
      return
    }
    setError(null)
    setNewFile(selected)
    setNewPreviewUrl((current) => {
      if (current) URL.revokeObjectURL(current)
      return URL.createObjectURL(selected)
    })
    setRemoveImage(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsSubmitting(true)
    setError(null)

    let uploadedPath: string | null = null
    try {
      let nextImagePath = imagePath

      if (newFile) {
        uploadedPath = `${uploaderId}/${crypto.randomUUID()}.${IMAGE_EXTENSIONS[newFile.type]}`
        const { error: uploadError } = await supabase.storage
          .from('post-images')
          .upload(uploadedPath, newFile, {
            contentType: newFile.type,
            cacheControl: '31536000',
          })
        if (uploadError) throw uploadError
        nextImagePath = uploadedPath
      } else if (removeImage) {
        nextImagePath = null
      }

      const { error: updateError } = await supabase
        .from('posts')
        .update({ content: value.trim() || null, image_path: nextImagePath })
        .eq('id', postId)
      if (updateError) throw updateError

      if (imagePath && nextImagePath !== imagePath) {
        await supabase.storage.from('post-images').remove([imagePath])
      }

      setOpen(false)
      router.refresh()
    } catch {
      if (uploadedPath) {
        await supabase.storage.from('post-images').remove([uploadedPath])
      }
      setError(t('editError'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const showsCurrentImage = !!imageUrl && !removeImage && !newFile

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
            resetImageState()
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

            {(showsCurrentImage || newPreviewUrl) && (
              <div className="relative">
                <NextImage
                  src={newPreviewUrl ?? imageUrl ?? ''}
                  alt={t('previewAlt')}
                  width={800}
                  height={600}
                  unoptimized
                  className="max-h-72 w-full rounded-lg object-contain"
                />
                <Button
                  type="button"
                  size="icon-sm"
                  variant="secondary"
                  aria-label={t('removePhoto')}
                  className="absolute top-2 right-2"
                  onClick={() => {
                    if (newFile) {
                      resetImageState()
                    } else {
                      setRemoveImage(true)
                    }
                  }}
                >
                  <X />
                </Button>
              </div>
            )}

            <input
              ref={fileInput}
              type="file"
              accept={Object.keys(IMAGE_EXTENSIONS).join(',')}
              className="hidden"
              onChange={handleFileChange}
            />
            <Button
              type="button"
              variant="ghost"
              className="w-fit"
              onClick={() => fileInput.current?.click()}
            >
              <ImageIcon className="size-5 text-blue-800" />
              {showsCurrentImage || newPreviewUrl ? t('replacePhoto') : t('addPhoto')}
            </Button>

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
