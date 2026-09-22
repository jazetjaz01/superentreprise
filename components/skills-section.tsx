'use client'

import { X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useRouter } from '@/i18n/navigation'
import { createClient } from '@/lib/supabase/client'

type Skill = {
  id: string
  name: string
}

type SkillsSectionProps = {
  profileId: string
  isOwnProfile: boolean
  skills: Skill[]
}

export const SkillsSection = ({ profileId, isOwnProfile, skills }: SkillsSectionProps) => {
  const t = useTranslations('ProfilePage.skills')
  const router = useRouter()
  const [name, setName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (skills.length === 0 && !isOwnProfile) return null

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return

    const supabase = createClient()
    setIsSubmitting(true)
    setError(null)

    try {
      const { error } = await supabase.from('skills').insert({ profile_id: profileId, name: trimmed })
      if (error) throw error
      setName('')
      router.refresh()
    } catch {
      setError(t('error'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRemove = async (id: string) => {
    const supabase = createClient()
    setError(null)

    try {
      const { error } = await supabase.from('skills').delete().eq('id', id)
      if (error) throw error
      router.refresh()
    } catch {
      setError(t('error'))
    }
  }

  return (
    <Card className="mt-4">
      <CardContent>
        <h2 className="text-lg font-semibold">{t('sectionTitle')}</h2>

        {skills.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">{t('empty')}</p>
        ) : (
          <ul className="mt-3 flex flex-wrap gap-2">
            {skills.map((skill) => (
              <li
                key={skill.id}
                className="flex items-center gap-1 rounded-full border px-3 py-1 text-sm"
              >
                {skill.name}
                {isOwnProfile && (
                  <button
                    type="button"
                    aria-label={t('remove', { name: skill.name })}
                    onClick={() => handleRemove(skill.id)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X className="size-3.5" />
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}

        {isOwnProfile && (
          <form onSubmit={handleAdd} className="mt-4 flex gap-2">
            <Input
              value={name}
              maxLength={100}
              placeholder={t('addPlaceholder')}
              onChange={(e) => setName(e.target.value)}
            />
            <Button type="submit" disabled={isSubmitting || !name.trim()}>
              {t('add')}
            </Button>
          </form>
        )}
        {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
      </CardContent>
    </Card>
  )
}
