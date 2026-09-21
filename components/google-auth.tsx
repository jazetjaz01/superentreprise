'use client'

import { useLocale, useTranslations } from 'next-intl'
import { useState } from 'react'

import { GoogleIcon } from '@/components/brand-icons'
import { Button } from '@/components/ui/button'
import { getPathname } from '@/i18n/navigation'
import { createClient } from '@/lib/supabase/client'

export function GoogleAuth() {
  const t = useTranslations('Auth')
  const locale = useLocale()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleGoogleLogin = async () => {
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      const next = getPathname({ href: '/protected', locale })
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/oauth?next=${encodeURIComponent(next)}`,
        },
      })
      if (error) throw error
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : t('genericError'))
      setIsLoading(false)
    }
  }

  return (
    <div className="mt-4 flex flex-col gap-4">
      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <span className="h-px flex-1 bg-border" />
        {t('or')}
        <span className="h-px flex-1 bg-border" />
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
      <Button
        type="button"
        variant="outline"
        className="w-full"
        disabled={isLoading}
        onClick={handleGoogleLogin}
      >
        <GoogleIcon className="size-4" />
        {t('google')}
      </Button>
    </div>
  )
}
