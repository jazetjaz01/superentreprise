import { getFormatter, getTranslations } from 'next-intl/server'

import { ExperienceDialog } from '@/components/experience-dialog'
import { Card, CardContent } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/server'

type ExperienceSectionProps = {
  profileId: string
  isOwnProfile: boolean
}

export const ExperienceSection = async ({ profileId, isOwnProfile }: ExperienceSectionProps) => {
  const t = await getTranslations('ProfilePage.experience')
  const format = await getFormatter()
  const supabase = await createClient()

  const { data: experiences } = await supabase
    .from('experiences')
    .select('id, title, company, location, start_date, end_date, description')
    .eq('profile_id', profileId)
    .order('start_date', { ascending: false })

  const items = experiences ?? []
  if (items.length === 0 && !isOwnProfile) return null

  const formatMonth = (date: string) =>
    format.dateTime(new Date(`${date}T00:00:00`), { month: 'long', year: 'numeric' })

  return (
    <Card className="mt-4">
      <CardContent>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">{t('sectionTitle')}</h2>
          {isOwnProfile && <ExperienceDialog profileId={profileId} />}
        </div>

        {items.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">{t('empty')}</p>
        ) : (
          <ul className="mt-4 flex flex-col gap-5">
            {items.map((experience) => (
              <li key={experience.id} className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-medium">{experience.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {experience.company}
                    {experience.location ? ` · ${experience.location}` : ''}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatMonth(experience.start_date)} –{' '}
                    {experience.end_date ? formatMonth(experience.end_date) : t('present')}
                  </p>
                  {experience.description && (
                    <p className="mt-1 whitespace-pre-wrap text-sm text-foreground/80">
                      {experience.description}
                    </p>
                  )}
                </div>
                {isOwnProfile && (
                  <ExperienceDialog profileId={profileId} experience={experience} />
                )}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
