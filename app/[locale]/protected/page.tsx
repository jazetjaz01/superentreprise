import { getLocale, getTranslations } from 'next-intl/server'

import { LogoutButton } from '@/components/logout-button'
import { redirect } from '@/i18n/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function ProtectedPage() {
  const supabase = await createClient()
  const t = await getTranslations('Protected')

  const { data, error } = await supabase.auth.getClaims()
  if (error || !data?.claims) {
    return redirect({ href: '/auth/login', locale: await getLocale() })
  }

  return (
    <div className="flex h-svh w-full items-center justify-center gap-2">
      <p>{t('hello', { email: data.claims.email ?? '' })}</p>
      <LogoutButton />
    </div>
  )
}
