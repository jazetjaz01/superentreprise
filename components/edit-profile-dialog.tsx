'use client'

import { Pencil } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useRef, useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { UserAvatar } from '@/components/user-avatar'
import { useRouter } from '@/i18n/navigation'
import { createClient } from '@/lib/supabase/client'

const MAX_AVATAR_BYTES = 2 * 1024 * 1024
const IMAGE_EXTENSIONS: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
}

type EditProfileDialogProps = {
  userId: string
  fullName: string
  headline: string | null
  about: string | null
  avatarUrl: string | null
  className?: string
}

export const EditProfileDialog = ({
  userId,
  fullName,
  headline,
  about,
  avatarUrl,
  className,
}: EditProfileDialogProps) => {
  const t = useTranslations('ProfilePage.edit')
  const router = useRouter()
  const fileInput = useRef<HTMLInputElement>(null)
  const [open, setOpen] = useState(false)
  const [name, setName] = useState(fullName)
  const [headlineValue, setHeadlineValue] = useState(headline ?? '')
  const [aboutValue, setAboutValue] = useState(about ?? '')
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    e.target.value = ''
    if (!selected) return

    if (!(selected.type in IMAGE_EXTENSIONS)) {
      setError(t('fileType'))
      return
    }
    if (selected.size > MAX_AVATAR_BYTES) {
      setError(t('fileTooLarge'))
      return
    }

    setError(null)
    setFile(selected)
    setPreviewUrl(URL.createObjectURL(selected))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsSubmitting(true)
    setError(null)

    try {
      let newAvatarUrl: string | undefined

      if (file) {
        const path = `${userId}/avatar`
        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(path, file, {
            contentType: file.type,
            upsert: true,
            cacheControl: '0',
          })
        if (uploadError) throw uploadError

        const { data } = supabase.storage.from('avatars').getPublicUrl(path)
        newAvatarUrl = `${data.publicUrl}?v=${Date.now()}`
      }

      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          full_name: name.trim(),
          headline: headlineValue.trim() || null,
          about: aboutValue.trim() || null,
          ...(newAvatarUrl ? { avatar_url: newAvatarUrl } : {}),
        })
        .eq('id', userId)
      if (updateError) throw updateError

      setOpen(false)
      router.refresh()
    } catch {
      setError(t('error'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Button
        variant="outline"
        size="icon-sm"
        className={className}
        aria-label={t('trigger')}
        onClick={() => setOpen(true)}
      >
        <Pencil className="size-3.5" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t('title')}</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col items-center gap-2">
              <button
                type="button"
                onClick={() => fileInput.current?.click()}
                className="rounded-full"
                aria-label={t('changePhoto')}
              >
                <UserAvatar
                  name={name}
                  avatarUrl={previewUrl ?? avatarUrl}
                  size={80}
                />
              </button>
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
                size="sm"
                onClick={() => fileInput.current?.click()}
              >
                {t('changePhoto')}
              </Button>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="full-name">{t('fullName')}</Label>
              <Input
                id="full-name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="headline">{t('headline')}</Label>
              <Input
                id="headline"
                value={headlineValue}
                onChange={(e) => setHeadlineValue(e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="about">{t('about')}</Label>
              <Textarea
                id="about"
                rows={4}
                maxLength={2000}
                value={aboutValue}
                onChange={(e) => setAboutValue(e.target.value)}
              />
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? t('saving') : t('save')}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
