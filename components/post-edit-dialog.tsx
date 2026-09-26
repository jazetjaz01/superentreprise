'use client'

import { Pencil } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

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

type PostEditDialogProps = {
  postId: string
  content: string | null
}

export const PostEditDialog = ({ postId, content }: PostEditDialogProps) => {
  const t = useTranslations('Feed')
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState(content ?? '')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsSubmitting(true)
    setError(null)

    try {
      const { error: updateError } = await supabase
        .from('posts')
        .update({ content: value.trim() || null })
        .eq('id', postId)
      if (updateError) throw updateError

      setOpen(false)
      router.refresh()
    } catch {
      setError(t('editError'))
    } finally {
      setIsSubmitting(false)
    }
  }

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

      <Dialog open={open} onOpenChange={setOpen}>
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

            {error && <p className="text-sm text-red-500">{error}</p>}

            <Button type="submit" disabled={isSubmitting} className="w-fit">
              {isSubmitting ? t('editSaving') : t('editSave')}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
