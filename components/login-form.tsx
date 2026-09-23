'use client'

import { useLocale, useTranslations } from 'next-intl'
import { useState } from 'react'

import { AuthCard } from '@/components/auth-card'
import { GoogleIcon } from '@/components/brand-icons'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { getPathname, Link, useRouter } from '@/i18n/navigation'
import { safeNextPath } from '@/lib/safe-next-path'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'

export function LoginForm({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  const t = useTranslations('Auth')
  const locale = useLocale()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
      // Update this route to redirect to an authenticated route. The user already has an active session.
      const next = new URLSearchParams(window.location.search).get('next')
      router.push(safeNextPath(next, '/protected'))
      router.refresh()
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : t('genericError'))
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    const supabase = createClient()
    setIsGoogleLoading(true)
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
      setIsGoogleLoading(false)
    }
  }

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <AuthCard title={t('login.title')} description={t('login.description')}>
        <Button
          type="button"
          className="mt-8 w-full gap-3"
          disabled={isGoogleLoading}
          onClick={handleGoogleLogin}
        >
          <GoogleIcon className="size-4" />
          {t('google')}
        </Button>

        <div className="my-7 flex w-full items-center justify-center gap-2 overflow-hidden text-xs text-foreground">
          <span className="h-px flex-1 bg-border" />
          {t('or')}
          <span className="h-px flex-1 bg-border" />
        </div>

        <form className="w-full" onSubmit={handleLogin}>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">{t('email')}</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">{t('password')}</Label>
                <Link
                  href="/auth/forgot-password"
                  className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                >
                  {t('login.forgotPassword')}
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? t('login.submitting') : t('login.submit')}
            </Button>
          </div>
        </form>

        <p className="mt-5 text-center text-sm">
          {t('login.noAccount')}{' '}
          <Link href="/auth/sign-up" className="underline underline-offset-4">
            {t('login.signUpLink')}
          </Link>
        </p>
      </AuthCard>
    </div>
  )
}
