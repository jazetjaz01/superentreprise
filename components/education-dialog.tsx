'use client'

import { Pencil, Plus } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

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

type Education = {
  id: string
  school: string
  degree: string | null
  start_date: string | null
  end_date: string | null
  description: string | null
}

type EducationDialogProps = {
  profileId: string
  education?: Education
}

export const EducationDialog = ({ profileId, education }: EducationDialogProps) => {
  const t = useTranslations('ProfilePage.education')
  const router = useRouter()
  const isEdit = !!education
  const [open, setOpen] = useState(false)
  const [school, setSchool] = useState(education?.school ?? '')
  const [degree, setDegree] = useState(education?.degree ?? '')
  const [startDate, setStartDate] = useState(education?.start_date?.slice(0, 7) ?? '')
  const [endDate, setEndDate] = useState(education?.end_date?.slice(0, 7) ?? '')
  const [description, setDescription] = useState(education?.description ?? '')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsSubmitting(true)
    setError(null)

    const payload = {
      school: school.trim(),
      degree: degree.trim() || null,
      start_date: startDate ? `${startDate}-01` : null,
      end_date: endDate ? `${endDate}-01` : null,
      description: description.trim() || null,
    }

    try {
      const { error } = isEdit
        ? await supabase.from('educations').update(payload).eq('id', education.id)
        : await supabase.from('educations').insert({ profile_id: profileId, ...payload })
      if (error) throw error

      setOpen(false)
      router.refresh()
    } catch {
      setError(t('error'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!education) return
    const supabase = createClient()
    setIsSubmitting(true)
    setError(null)

    try {
      const { error } = await supabase.from('educations').delete().eq('id', education.id)
      if (error) throw error
      setOpen(false)
      router.refresh()
    } catch {
      setError(t('error'))
      setIsSubmitting(false)
    }
  }

  return (
    <>
      {isEdit ? (
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={t('edit')}
          onClick={() => setOpen(true)}
        >
          <Pencil className="size-4" />
        </Button>
      ) : (
        <Button variant="outline" size="sm" className="gap-2" onClick={() => setOpen(true)}>
          <Plus className="size-4" />
          {t('add')}
        </Button>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{isEdit ? t('editTitle') : t('addTitle')}</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid gap-2">
              <Label htmlFor="edu-school">{t('school')}</Label>
              <Input
                id="edu-school"
                required
                value={school}
                onChange={(e) => setSchool(e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edu-degree">{t('degree')}</Label>
              <Input
                id="edu-degree"
                value={degree}
                onChange={(e) => setDegree(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edu-start">{t('startDate')}</Label>
                <Input
                  id="edu-start"
                  type="month"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edu-end">{t('endDate')}</Label>
                <Input
                  id="edu-end"
                  type="month"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edu-description">{t('description')}</Label>
              <Textarea
                id="edu-description"
                rows={3}
                maxLength={2000}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <div className="flex items-center justify-between gap-2">
              {isEdit ? (
                <Button
                  type="button"
                  variant="ghost"
                  className="text-red-500 hover:text-red-500"
                  disabled={isSubmitting}
                  onClick={handleDelete}
                >
                  {t('delete')}
                </Button>
              ) : (
                <span />
              )}
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? t('saving') : t('save')}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
