'use client'

import { Pencil } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
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
import { useRouter } from '@/i18n/navigation'
import { createClient } from '@/lib/supabase/client'

const MAX_LOGO_BYTES = 5 * 1024 * 1024
const IMAGE_EXTENSIONS: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
}

type EditCompanyDialogProps = {
  companyId: string
  name: string
  tagline: string | null
  industry: string | null
  companySize: string | null
  website: string | null
  about: string | null
  logoUrl: string | null
  className?: string
}

export const EditCompanyDialog = ({
  companyId,
  name,
  tagline,
  industry,
  companySize,
  website,
  about,
  logoUrl,
  className,
}: EditCompanyDialogProps) => {
  const t = useTranslations('Company.edit')
  const router = useRouter()
  const fileInput = useRef<HTMLInputElement>(null)
  const [open, setOpen] = useState(false)
  const [nameValue, setNameValue] = useState(name)
  const [taglineValue, setTaglineValue] = useState(tagline ?? '')
  const [industryValue, setIndustryValue] = useState(industry ?? '')
  const [companySizeValue, setCompanySizeValue] = useState(companySize ?? '')
  const [websiteValue, setWebsiteValue] = useState(website ?? '')
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
    if (selected.size > MAX_LOGO_BYTES) {
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
      let newLogoUrl: string | undefined

      if (file) {
        const path = `${companyId}/logo.${IMAGE_EXTENSIONS[file.type]}`
        const { error: uploadError } = await supabase.storage
          .from('company-logos')
          .upload(path, file, {
            contentType: file.type,
            upsert: true,
            cacheControl: '0',
          })
        if (uploadError) throw uploadError

        const { data } = supabase.storage.from('company-logos').getPublicUrl(path)
        newLogoUrl = `${data.publicUrl}?v=${Date.now()}`
      }

      const { error: updateError } = await supabase
        .from('companies')
        .update({
          name: nameValue.trim(),
          tagline: taglineValue.trim() || null,
          industry: industryValue.trim() || null,
          company_size: companySizeValue.trim() || null,
          website: websiteValue.trim() || null,
          about: aboutValue.trim() || null,
          ...(newLogoUrl ? { logo_url: newLogoUrl } : {}),
        })
        .eq('id', companyId)
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
                className="flex size-20 items-center justify-center overflow-hidden rounded-full border border-border bg-secondary"
                aria-label={t('changeLogo')}
              >
                {previewUrl ?? logoUrl ? (
                  <Image
                    src={(previewUrl ?? logoUrl) as string}
                    alt=""
                    width={80}
                    height={80}
                    unoptimized
                    className="size-full object-cover"
                  />
                ) : (
                  <span className="font-heading text-ink-600 text-2xl">
                    {nameValue.trim().charAt(0).toUpperCase() || '?'}
                  </span>
                )}
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
                {t('changeLogo')}
              </Button>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-company-name">{t('name')}</Label>
              <Input
                id="edit-company-name"
                required
                maxLength={200}
                value={nameValue}
                onChange={(e) => setNameValue(e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-company-tagline">{t('tagline')}</Label>
              <Input
                id="edit-company-tagline"
                maxLength={200}
                value={taglineValue}
                onChange={(e) => setTaglineValue(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="grid gap-2">
                <Label htmlFor="edit-company-industry">{t('industry')}</Label>
                <Input
                  id="edit-company-industry"
                  maxLength={100}
                  value={industryValue}
                  onChange={(e) => setIndustryValue(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-company-size">{t('companySize')}</Label>
                <Input
                  id="edit-company-size"
                  maxLength={50}
                  placeholder={t('companySizePlaceholder')}
                  value={companySizeValue}
                  onChange={(e) => setCompanySizeValue(e.target.value)}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-company-website">{t('website')}</Label>
              <Input
                id="edit-company-website"
                type="url"
                maxLength={300}
                placeholder="https://"
                value={websiteValue}
                onChange={(e) => setWebsiteValue(e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-company-about">{t('about')}</Label>
              <Textarea
                id="edit-company-about"
                rows={4}
                maxLength={5000}
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
