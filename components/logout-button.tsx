'use client'

import { useTranslations } from 'next-intl'
import type { ComponentProps } from 'react'

import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { useRouter } from '@/i18n/navigation'

export function LogoutButton(props: ComponentProps<typeof Button>) {
  const t = useTranslations('Auth')
  const router = useRouter()

  const logout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/auth/login')
    router.refresh()
  }

  return (
    <Button {...props} onClick={logout}>
      {t('logout')}
    </Button>
  )
}
