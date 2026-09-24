'use client'

import { X } from 'lucide-react'
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

const MAX_COVER_BYTES = 5 * 1024 * 1024
const IMAGE_EXTENSIONS: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
}

type ExistingArticle = {
  id: string
  slug: string
  title: string
  content: string
  coverImagePath: string | null
}

type ArticleFormProps = {
  userId: string
  article?: ExistingArticle
}

export const ArticleForm = ({ userId, article }: ArticleFormProps) => {
  const t = useTranslations('Articles.write')
  const router = useRouter()
  const isEdit = !!article
  const fileInput = useRef<HTMLInputElement>(null)
  const [title, setTitle] = useState(article?.title ?? '')
  const [content, setContent] = useState(article?.content ?? '')
  const [file, setFile] = useState<File | null>(null)
  const [coverRemoved, setCoverRemoved] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const existingCoverUrl =
    !coverRemoved && article?.coverImagePath
      ? createClient().storage.from('article-covers').getPublicUrl(article.coverImagePath)
          .data.publicUrl
      : null
  const shownCoverUrl = previewUrl ?? existingCoverUrl

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    e.target.value = ''
    if (!selected) return

    if (!(selected.type in IMAGE_EXTENSIONS)) {
      setError(t('fileType'))
      return
    }
    if (selected.size > MAX_COVER_BYTES) {
      setError(t('fileTooLarge'))
      return
    }

    setError(null)
    setFile(selected)
    setCoverRemoved(false)
    setPreviewUrl(URL.createObjectURL(selected))
  }

  const handleRemoveCover = () => {
    setFile(null)
    setPreviewUrl(null)
    setCoverRemoved(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsSubmitting(true)
    setError(null)

    let newCoverPath: string | null = null
    try {
      if (file) {
        newCoverPath = `${userId}/${crypto.randomUUID()}.${IMAGE_EXTENSIONS[file.type]}`
        const { error: uploadError } = await supabase.storage
          .from('article-covers')
          .upload(newCoverPath, file, { contentType: file.type, cacheControl: '31536000' })
        if (uploadError) throw uploadError
      }

      if (isEdit) {
        const coverImagePath = newCoverPath ?? (coverRemoved ? null : article.coverImagePath)

        const { error: updateError } = await supabase
          .from('articles')
          .update({
            title: title.trim(),
            content: content.trim(),
            cover_image_path: coverImagePath,
          })
          .eq('id', article.id)
        if (updateError) throw updateError

        const oldCoverPath = article.coverImagePath
        if (oldCoverPath && oldCoverPath !== coverImagePath) {
          await supabase.storage.from('article-covers').remove([oldCoverPath])
        }

        router.push(`/articles/${article.slug}`)
      } else {
        const { data, error: insertError } = await supabase
          .from('articles')
          .insert({
            author_id: userId,
            title: title.trim(),
            content: content.trim(),
            cover_image_path: newCoverPath,
          })
          .select('slug')
          .single()
        if (insertError) throw insertError

        router.push(`/articles/${data.slug}`)
      }
    } catch {
      if (newCoverPath) {
        await supabase.storage.from('article-covers').remove([newCoverPath])
      }
      setError(t('error'))
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="grid gap-2">
            <Label htmlFor="article-title">{t('titleLabel')}</Label>
            <Input
              id="article-title"
              required
              maxLength={200}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t('titlePlaceholder')}
              className="text-lg font-semibold"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="article-cover">{t('cover')}</Label>
            {shownCoverUrl ? (
              <div className="relative">
                <Image
                  src={shownCoverUrl}
                  alt=""
                  width={1200}
                  height={600}
                  unoptimized
                  className="max-h-72 w-full rounded-lg object-cover"
                />
                <Button
                  type="button"
                  size="icon-sm"
                  variant="secondary"
                  aria-label={t('removeCover')}
                  className="absolute top-2 right-2"
                  onClick={handleRemoveCover}
                >
                  <X />
                </Button>
              </div>
            ) : (
              <Button
                type="button"
                variant="outline"
                className="w-fit"
                onClick={() => fileInput.current?.click()}
              >
                {t('addCover')}
              </Button>
            )}
            <input
              ref={fileInput}
              id="article-cover"
              type="file"
              accept={Object.keys(IMAGE_EXTENSIONS).join(',')}
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="article-content">{t('contentLabel')}</Label>
            <Textarea
              id="article-content"
              required
              rows={16}
              maxLength={50000}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={t('contentPlaceholder')}
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <Button type="submit" disabled={isSubmitting} className="w-fit">
            {isSubmitting
              ? t('publishing')
              : isEdit
                ? t('save')
                : t('publish')}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
