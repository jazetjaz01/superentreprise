'use client'

import { Pencil } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { useRef, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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

type CompanyEditTabProps = {
  companySlug: string
  companyId: string
  name: string
  tagline: string | null
  industry: string | null
  companySize: string | null
  website: string | null
  about: string | null
  logoUrl: string | null
  bannerUrl: string | null
}

export const CompanyEditTab = ({
  companySlug,
  companyId,
  name,
  tagline,
  industry,
  companySize,
  website,
  about,
  logoUrl,
  bannerUrl,
}: CompanyEditTabProps) => {
  const t = useTranslations('Company.edit')
  const router = useRouter()
  const logoInput = useRef<HTMLInputElement>(null)
  const bannerInput = useRef<HTMLInputElement>(null)
  const [nameValue, setNameValue] = useState(name)
  const [taglineValue, setTaglineValue] = useState(tagline ?? '')
  const [industryValue, setIndustryValue] = useState(industry ?? '')
  const [companySizeValue, setCompanySizeValue] = useState(companySize ?? '')
  const [websiteValue, setWebsiteValue] = useState(website ?? '')
  const [aboutValue, setAboutValue] = useState(about ?? '')
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [bannerFile, setBannerFile] = useState<File | null>(null)
  const [bannerPreview, setBannerPreview] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleImageChange =
    (setFile: (file: File) => void, setPreview: (url: string) => void) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
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
      setFile(selected)
      setPreview(URL.createObjectURL(selected))
    }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsSubmitting(true)
    setError(null)

    try {
      let newLogoUrl: string | undefined
      let newBannerUrl: string | undefined

      if (logoFile) {
        const path = `${companyId}/logo.${IMAGE_EXTENSIONS[logoFile.type]}`
        const { error: uploadError } = await supabase.storage
          .from('company-logos')
          .upload(path, logoFile, { contentType: logoFile.type, upsert: true, cacheControl: '0' })
        if (uploadError) throw uploadError
        newLogoUrl = `${supabase.storage.from('company-logos').getPublicUrl(path).data.publicUrl}?v=${Date.now()}`
      }

      if (bannerFile) {
        const path = `${companyId}/banner.${IMAGE_EXTENSIONS[bannerFile.type]}`
        const { error: uploadError } = await supabase.storage
          .from('company-banners')
          .upload(path, bannerFile, {
            contentType: bannerFile.type,
            upsert: true,
            cacheControl: '0',
          })
        if (uploadError) throw uploadError
        newBannerUrl = `${supabase.storage.from('company-banners').getPublicUrl(path).data.publicUrl}?v=${Date.now()}`
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
          ...(newBannerUrl ? { banner_url: newBannerUrl } : {}),
        })
        .eq('id', companyId)
      if (updateError) throw updateError

      router.push(`/company/${companySlug}?view=admin`)
      router.refresh()
    } catch {
      setError(t('error'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardContent className="p-[27.6px]">
          <h1 className="font-heading text-2xl font-medium">{t('title')}</h1>
          <p className="text-ink-600 mt-1 text-base">{t('subtitle')}</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-[27.6px]">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div>
              <h2 className="font-heading text-xl font-medium">{t('sectionTitle')}</h2>
              <p className="text-ink-600 mt-1 text-base">{t('requiredHint')}</p>
            </div>

            <div className="flex flex-wrap items-start gap-6">
              <div>
                <Label>{t('logo')}</Label>
                <div className="relative mt-2">
                  <button
                    type="button"
                    onClick={() => logoInput.current?.click()}
                    aria-label={t('changeLogo')}
                    className="border-border bg-secondary flex size-24 items-center justify-center overflow-hidden rounded-full border"
                  >
                    {logoPreview ?? logoUrl ? (
                      <Image
                        src={(logoPreview ?? logoUrl) as string}
                        alt=""
                        width={96}
                        height={96}
                        unoptimized
                        className="size-full object-cover"
                      />
                    ) : (
                      <span className="font-heading text-ink-600 text-2xl">
                        {nameValue.trim().charAt(0).toUpperCase() || '?'}
                      </span>
                    )}
                  </button>
                  <Button
                    type="button"
                    size="icon-sm"
                    variant="secondary"
                    className="absolute right-0 bottom-0 rounded-full"
                    aria-label={t('changeLogo')}
                    onClick={() => logoInput.current?.click()}
                  >
                    <Pencil className="size-3.5" />
                  </Button>
                  <input
                    ref={logoInput}
                    type="file"
                    accept={Object.keys(IMAGE_EXTENSIONS).join(',')}
                    className="hidden"
                    onChange={handleImageChange(setLogoFile, setLogoPreview)}
                  />
                </div>
              </div>

              <div className="min-w-0 flex-1">
                <Label>{t('banner')}</Label>
                <div className="relative mt-2">
                  <button
                    type="button"
                    onClick={() => bannerInput.current?.click()}
                    aria-label={t('changeBanner')}
                    className="border-border bg-secondary block h-24 w-full overflow-hidden rounded-md border"
                  >
                    {bannerPreview ?? bannerUrl ? (
                      <Image
                        src={(bannerPreview ?? bannerUrl) as string}
                        alt=""
                        width={640}
                        height={120}
                        unoptimized
                        className="size-full object-cover"
                      />
                    ) : null}
                  </button>
                  <Button
                    type="button"
                    size="icon-sm"
                    variant="secondary"
                    className="absolute right-2 bottom-2 rounded-full"
                    aria-label={t('changeBanner')}
                    onClick={() => bannerInput.current?.click()}
                  >
                    <Pencil className="size-3.5" />
                  </Button>
                  <input
                    ref={bannerInput}
                    type="file"
                    accept={Object.keys(IMAGE_EXTENSIONS).join(',')}
                    className="hidden"
                    onChange={handleImageChange(setBannerFile, setBannerPreview)}
                  />
                </div>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-company-name">{t('name')}*</Label>
              <Input
                id="edit-company-name"
                required
                maxLength={200}
                value={nameValue}
                onChange={(e) => setNameValue(e.target.value)}
              />
              <p className="text-ink-600 text-right text-base">{nameValue.length}/200</p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-company-tagline">{t('tagline')}</Label>
              <Textarea
                id="edit-company-tagline"
                rows={2}
                maxLength={200}
                value={taglineValue}
                onChange={(e) => setTaglineValue(e.target.value)}
              />
              <p className="text-ink-600 text-right text-base">{taglineValue.length}/200</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
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

            {error && <p className="text-base text-red-500">{error}</p>}

            <div>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? t('saving') : t('save')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
