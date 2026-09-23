import { getFormatter, getTranslations } from 'next-intl/server'

import { EducationDialog } from '@/components/education-dialog'
import { Card, CardContent } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/server'

type EducationSectionProps = {
  profileId: string
  isOwnProfile: boolean
}

export const EducationSection = async ({ profileId, isOwnProfile }: EducationSectionProps) => {
  const t = await getTranslations('ProfilePage.education')
  const format = await getFormatter()
  const supabase = await createClient()

  const { data: educations } = await supabase
    .from('educations')
    .select('id, school, degree, start_date, end_date, description')
    .eq('profile_id', profileId)
    .order('start_date', { ascending: false, nullsFirst: false })

  const items = educations ?? []
  if (items.length === 0 && !isOwnProfile) return null

  const formatMonth = (date: string) =>
    format.dateTime(new Date(`${date}T00:00:00`), { month: 'long', year: 'numeric' })

  return (
    <Card className="mt-4">
      <CardContent>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">{t('sectionTitle')}</h2>
          {isOwnProfile && <EducationDialog profileId={profileId} />}
        </div>

        {items.length === 0 ? (
          <p className="mt-3 text-sm text-foreground">{t('empty')}</p>
        ) : (
          <ul className="mt-4 flex flex-col gap-5">
            {items.map((education) => (
              <li key={education.id} className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-medium">{education.school}</p>
                  {education.degree && (
                    <p className="text-sm text-foreground">{education.degree}</p>
                  )}
                  {(education.start_date || education.end_date) && (
                    <p className="text-xs text-foreground">
                      {education.start_date ? formatMonth(education.start_date) : ''}
                      {education.start_date && education.end_date ? ' – ' : ''}
                      {education.end_date ? formatMonth(education.end_date) : ''}
                    </p>
                  )}
                  {education.description && (
                    <p className="mt-1 whitespace-pre-wrap text-sm text-foreground">
                      {education.description}
                    </p>
                  )}
                </div>
                {isOwnProfile && <EducationDialog profileId={profileId} education={education} />}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
