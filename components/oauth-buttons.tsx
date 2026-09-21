'use client'

import type { Provider } from '@supabase/supabase-js'
import { useLocale, useTranslations } from 'next-intl'
import { useState } from 'react'

import { GoogleIcon, LinkedInIcon } from '@/components/brand-icons'
import { Button } from '@/components/ui/button'
import { getPathname } from '@/i18n/navigation'
import { createClient } from '@/lib/supabase/client'

export function OAuthButtons() {
  const t = useTranslations('Hero')
  const locale = useLocale()
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState<Provider | null>(null)

  const signIn = async (provider: Provider) => {
    const supabase = createClient()
    setPending(provider)
    setError(null)

    try {
      const next = getPathname({ href: '/', locale })
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/oauth?next=${encodeURIComponent(next)}`,
        },
      })
      if (error) throw error
    } catch {
      setError(t('error'))
      setPending(null)
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <Button
        type="button"
        disabled={pending !== null}
        onClick={() => signIn('google')}
        className="h-12 w-full rounded-full bg-blue-600 text-base font-medium text-white hover:bg-blue-700"
      >
        <span className="flex size-8 items-center justify-center rounded-full bg-white">
          <GoogleIcon className="size-5" />
        </span>
        {t('google')}
      </Button>
      <Button
        type="button"
        variant="outline"
        disabled={pending !== null}
        onClick={() => signIn('linkedin_oidc')}
        className="h-12 w-full rounded-full text-base font-medium"
      >
        <LinkedInIcon className="size-6" />
        {t('linkedin')}
      </Button>
      {error && <p className="text-center text-sm text-red-500">{error}</p>}
    </div>
  )
}
