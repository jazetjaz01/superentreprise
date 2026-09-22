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

type Experience = {
  id: string
  title: string
  company: string
  location: string | null
  start_date: string
  end_date: string | null
  description: string | null
}

type ExperienceDialogProps = {
  profileId: string
  experience?: Experience
}

export const ExperienceDialog = ({ profileId, experience }: ExperienceDialogProps) => {
  const t = useTranslations('ProfilePage.experience')
  const router = useRouter()
  const isEdit = !!experience
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState(experience?.title ?? '')
  const [company, setCompany] = useState(experience?.company ?? '')
  const [location, setLocation] = useState(experience?.location ?? '')
  const [startDate, setStartDate] = useState(experience?.start_date.slice(0, 7) ?? '')
  const [endDate, setEndDate] = useState(experience?.end_date?.slice(0, 7) ?? '')
  const [current, setCurrent] = useState(isEdit && !experience?.end_date)
  const [description, setDescription] = useState(experience?.description ?? '')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsSubmitting(true)
    setError(null)

    const payload = {
      title: title.trim(),
      company: company.trim(),
      location: location.trim() || null,
      start_date: `${startDate}-01`,
      end_date: current ? null : endDate ? `${endDate}-01` : null,
      description: description.trim() || null,
    }

    try {
      const { error } = isEdit
        ? await supabase.from('experiences').update(payload).eq('id', experience.id)
        : await supabase.from('experiences').insert({ profile_id: profileId, ...payload })
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
    if (!experience) return
    const supabase = createClient()
    setIsSubmitting(true)
    setError(null)

    try {
      const { error } = await supabase.from('experiences').delete().eq('id', experience.id)
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
              <Label htmlFor="exp-title">{t('titleLabel')}</Label>
              <Input
                id="exp-title"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="exp-company">{t('company')}</Label>
              <Input
                id="exp-company"
                required
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="exp-location">{t('location')}</Label>
              <Input
                id="exp-location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="exp-start">{t('startDate')}</Label>
                <Input
                  id="exp-start"
                  type="month"
                  required
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="exp-end">{t('endDate')}</Label>
                <Input
                  id="exp-end"
                  type="month"
                  disabled={current}
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={current}
                onChange={(e) => {
                  setCurrent(e.target.checked)
                  if (e.target.checked) setEndDate('')
                }}
              />
              {t('current')}
            </label>

            <div className="grid gap-2">
              <Label htmlFor="exp-description">{t('description')}</Label>
              <Textarea
                id="exp-description"
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
