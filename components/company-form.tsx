'use client'

import { Camera } from 'lucide-react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
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

type CompanyFormProps = {
  userId: string
}

export const CompanyForm = ({ userId }: CompanyFormProps) => {
  const t = useTranslations('Company.create')
  const router = useRouter()
  const logoInput = useRef<HTMLInputElement>(null)
  const bannerInput = useRef<HTMLInputElement>(null)

  const [name, setName] = useState('')
  const [tagline, setTagline] = useState('')
  const [industry, setIndustry] = useState('')
  const [companySize, setCompanySize] = useState('')
  const [website, setWebsite] = useState('')
  const [about, setAbout] = useState('')
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
      const { data: company, error: insertError } = await supabase
        .from('companies')
        .insert({
          name: name.trim(),
          tagline: tagline.trim() || null,
          industry: industry.trim() || null,
          company_size: companySize.trim() || null,
          website: website.trim() || null,
          about: about.trim() || null,
          created_by: userId,
        })
        .select('id, slug')
        .single()
      if (insertError) throw insertError

      const { error: adminError } = await supabase
        .from('company_admins')
        .insert({ company_id: company.id, admin_id: userId })
      if (adminError) throw adminError

      let logoUrl: string | undefined
      let bannerUrl: string | undefined

      if (logoFile) {
        const path = `${company.id}/logo.${IMAGE_EXTENSIONS[logoFile.type]}`
        const { error: uploadError } = await supabase.storage
          .from('company-logos')
          .upload(path, logoFile, { contentType: logoFile.type, upsert: true })
        if (uploadError) throw uploadError
        logoUrl = supabase.storage.from('company-logos').getPublicUrl(path).data.publicUrl
      }

      if (bannerFile) {
        const path = `${company.id}/banner.${IMAGE_EXTENSIONS[bannerFile.type]}`
        const { error: uploadError } = await supabase.storage
          .from('company-banners')
          .upload(path, bannerFile, { contentType: bannerFile.type, upsert: true })
        if (uploadError) throw uploadError
        bannerUrl = supabase.storage.from('company-banners').getPublicUrl(path).data.publicUrl
      }

      if (logoUrl || bannerUrl) {
        const { error: updateError } = await supabase
          .from('companies')
          .update({
            ...(logoUrl ? { logo_url: logoUrl } : {}),
            ...(bannerUrl ? { banner_url: bannerUrl } : {}),
          })
          .eq('id', company.id)
        if (updateError) throw updateError
      }

      router.push(`/company/${company.slug}`)
    } catch {
      setError(t('error'))
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full flex-1 bg-secondary">
      <div className="mx-auto w-full max-w-2xl px-4 py-8 sm:px-6">
        <h1 className="font-heading text-2xl font-medium">{t('pageTitle')}</h1>

        <form onSubmit={handleSubmit} className="mt-4">
          <Card className="overflow-hidden pt-0">
            <div className="relative h-37.5 w-full bg-secondary">
              {bannerPreview && (
                <Image src={bannerPreview} alt="" fill unoptimized className="object-cover" />
              )}
              <input
                ref={bannerInput}
                type="file"
                accept={Object.keys(IMAGE_EXTENSIONS).join(',')}
                className="hidden"
                onChange={handleImageChange(setBannerFile, setBannerPreview)}
              />
              <Button
                type="button"
                variant="secondary"
                size="icon-sm"
                className="absolute top-3 right-3 rounded-full"
                aria-label={t('changeBanner')}
                onClick={() => bannerInput.current?.click()}
              >
                <Camera className="size-3.5" />
              </Button>
            </div>

            <CardContent className="relative p-[27.6px]">
              <div className="-mt-15 flex items-end gap-3">
                <div className="relative rounded-full border border-primary bg-background p-1.5">
                  <div className="flex size-30 items-center justify-center overflow-hidden rounded-full bg-secondary">
                    {logoPreview ? (
                      <Image
                        src={logoPreview}
                        alt=""
                        width={120}
                        height={120}
                        unoptimized
                        className="size-full object-cover"
                      />
                    ) : (
                      <span className="font-heading text-3xl text-ink-600">
                        {name.trim().charAt(0).toUpperCase() || '?'}
                      </span>
                    )}
                  </div>
                  <input
                    ref={logoInput}
                    type="file"
                    accept={Object.keys(IMAGE_EXTENSIONS).join(',')}
                    className="hidden"
                    onChange={handleImageChange(setLogoFile, setLogoPreview)}
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    size="icon-sm"
                    className="absolute right-0 bottom-0 rounded-full"
                    aria-label={t('changeLogo')}
                    onClick={() => logoInput.current?.click()}
                  >
                    <Camera className="size-3.5" />
                  </Button>
                </div>
              </div>

              <div className="mt-6 grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="company-name">{t('name')}</Label>
                  <Input
                    id="company-name"
                    required
                    maxLength={200}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="company-tagline">{t('tagline')}</Label>
                  <Input
                    id="company-tagline"
                    maxLength={200}
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="company-industry">{t('industry')}</Label>
                    <Input
                      id="company-industry"
                      maxLength={100}
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="company-size">{t('companySize')}</Label>
                    <Input
                      id="company-size"
                      maxLength={50}
                      placeholder={t('companySizePlaceholder')}
                      value={companySize}
                      onChange={(e) => setCompanySize(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="company-website">{t('website')}</Label>
                  <Input
                    id="company-website"
                    type="url"
                    maxLength={300}
                    placeholder="https://"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="company-about">{t('about')}</Label>
                  <Textarea
                    id="company-about"
                    rows={4}
                    maxLength={5000}
                    value={about}
                    onChange={(e) => setAbout(e.target.value)}
                  />
                </div>
              </div>

              {error && <p className="mt-4 text-base text-red-500">{error}</p>}

              <Button type="submit" className="mt-6 w-full" disabled={isSubmitting || !name.trim()}>
                {isSubmitting ? t('submitting') : t('submit')}
              </Button>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  )
}
