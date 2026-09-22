'use client'

import { useTranslations } from 'next-intl'
import { useState } from 'react'

import { AuthCard } from '@/components/auth-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'

export function ForgotPasswordForm({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  const t = useTranslations('Auth')
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      // The url which will be included in the email. This URL needs to be configured in your redirect URLs in the Supabase dashboard at https://supabase.com/dashboard/project/_/auth/url-configuration
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/update-password`,
      })
      if (error) throw error
      setSuccess(true)
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : t('genericError'))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      {success ? (
        <AuthCard
          title={t('forgotPassword.successTitle')}
          description={t('forgotPassword.successDescription')}
        >
          <p className="mt-6 text-center text-sm text-muted-foreground">
            {t('forgotPassword.successBody')}
          </p>
        </AuthCard>
      ) : (
        <AuthCard
          title={t('forgotPassword.title')}
          description={t('forgotPassword.description')}
        >
          <form className="mt-8 w-full" onSubmit={handleForgotPassword}>
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
              {error && <p className="text-sm text-red-500">{error}</p>}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? t('forgotPassword.submitting') : t('forgotPassword.submit')}
              </Button>
            </div>
          </form>

          <p className="mt-5 text-center text-sm">
            {t('forgotPassword.hasAccount')}{' '}
            <Link href="/auth/login" className="underline underline-offset-4">
              {t('forgotPassword.signInLink')}
            </Link>
          </p>
        </AuthCard>
      )}
    </div>
  )
}
