'use client'

import { Camera } from 'lucide-react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { useRef, useState } from 'react'

import { Button } from '@/components/ui/button'
import { useRouter } from '@/i18n/navigation'
import { createClient } from '@/lib/supabase/client'

const MAX_BANNER_BYTES = 5 * 1024 * 1024
const IMAGE_EXTENSIONS: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
}

type ProfileBannerProps = {
  userId: string
  bannerUrl: string | null
  isOwnProfile: boolean
}

export const ProfileBanner = ({ userId, bannerUrl, isOwnProfile }: ProfileBannerProps) => {
  const t = useTranslations('ProfilePage.banner')
  const router = useRouter()
  const fileInput = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    e.target.value = ''
    if (!selected) return

    if (!(selected.type in IMAGE_EXTENSIONS)) {
      setError(t('fileType'))
      return
    }
    if (selected.size > MAX_BANNER_BYTES) {
      setError(t('fileTooLarge'))
      return
    }

    setError(null)
    setPreview(URL.createObjectURL(selected))
    setIsUploading(true)

    try {
      const supabase = createClient()
      const path = `${userId}/banner`
      const { error: uploadError } = await supabase.storage
        .from('banners')
        .upload(path, selected, {
          contentType: selected.type,
          upsert: true,
          cacheControl: '0',
        })
      if (uploadError) throw uploadError

      const { data } = supabase.storage.from('banners').getPublicUrl(path)
      const newBannerUrl = `${data.publicUrl}?v=${Date.now()}`

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ banner_url: newBannerUrl })
        .eq('id', userId)
      if (updateError) throw updateError

      router.refresh()
    } catch {
      setError(t('error'))
      setPreview(null)
    } finally {
      setIsUploading(false)
    }
  }

  const shownUrl = preview ?? bannerUrl

  return (
    <div className="relative h-32 w-full bg-muted sm:h-48">
      {shownUrl && (
        <Image
          src={shownUrl}
          alt=""
          fill
          unoptimized
          className="object-cover"
        />
      )}

      {isOwnProfile && (
        <>
          <input
            ref={fileInput}
            type="file"
            accept={Object.keys(IMAGE_EXTENSIONS).join(',')}
            className="hidden"
            onChange={handleFileChange}
          />
          <Button
            type="button"
            variant="secondary"
            size="icon-sm"
            className="absolute top-3 right-3 rounded-full"
            aria-label={t('trigger')}
            disabled={isUploading}
            onClick={() => fileInput.current?.click()}
          >
            <Camera className="size-3.5" />
          </Button>
        </>
      )}

      {error && (
        <p className="absolute right-3 bottom-2 rounded bg-background/90 px-2 py-1 text-xs text-red-500">
          {error}
        </p>
      )}
    </div>
  )
}
