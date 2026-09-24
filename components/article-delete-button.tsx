'use client'

import { Trash2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { useRouter } from '@/i18n/navigation'
import { createClient } from '@/lib/supabase/client'

type ArticleDeleteButtonProps = {
  articleId: string
  coverImagePath: string | null
}

export const ArticleDeleteButton = ({ articleId, coverImagePath }: ArticleDeleteButtonProps) => {
  const t = useTranslations('Articles')
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDelete = async () => {
    const supabase = createClient()
    setIsDeleting(true)
    setError(null)

    try {
      const { error: deleteError } = await supabase.from('articles').delete().eq('id', articleId)
      if (deleteError) throw deleteError

      if (coverImagePath) {
        await supabase.storage.from('article-covers').remove([coverImagePath])
      }

      router.push('/')
    } catch {
      setError(t('deleteError'))
      setIsDeleting(false)
    }
  }

  return (
    <div className="flex flex-col items-end">
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label={t('delete')}
        disabled={isDeleting}
        onClick={handleDelete}
      >
        <Trash2 className="size-4" />
      </Button>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}
