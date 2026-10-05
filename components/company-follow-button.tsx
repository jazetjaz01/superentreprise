'use client'

import { Plus } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { useRouter } from '@/i18n/navigation'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'

type CompanyFollowButtonProps = {
  viewerId: string
  companyId: string
  initialIsFollowing: boolean
  variant?: 'button' | 'text'
  className?: string
  onFollowChange?: (isFollowing: boolean) => void
}

export const CompanyFollowButton = ({
  viewerId,
  companyId,
  initialIsFollowing,
  variant = 'button',
  className,
  onFollowChange,
}: CompanyFollowButtonProps) => {
  const t = useTranslations('Company.follow')
  const router = useRouter()
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing)
  const [isHovering, setIsHovering] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleClick = async () => {
    const supabase = createClient()
    setIsSubmitting(true)
    setError(null)

    try {
      if (isFollowing) {
        const { error: deleteError } = await supabase
          .from('company_follows')
          .delete()
          .eq('follower_id', viewerId)
          .eq('company_id', companyId)
        if (deleteError) throw deleteError
        setIsFollowing(false)
        onFollowChange?.(false)
      } else {
        const { error: insertError } = await supabase
          .from('company_follows')
          .insert({ follower_id: viewerId, company_id: companyId })
        if (insertError && insertError.code !== '23505') throw insertError
        setIsFollowing(true)
        onFollowChange?.(true)
      }
      router.refresh()
    } catch {
      setError(t('error'))
    } finally {
      setIsSubmitting(false)
      setIsHovering(false)
    }
  }

  if (variant === 'text') {
    return (
      <div className={cn('flex flex-col items-end gap-1', className)}>
        <button
          type="button"
          disabled={isSubmitting}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          onClick={handleClick}
          className="flex cursor-pointer items-center gap-1 rounded-md px-2 py-1 text-base font-medium text-green-800 transition-colors hover:bg-green-700/10 disabled:opacity-45"
        >
          {isFollowing ? (
            isHovering ? t('unfollow') : t('following')
          ) : (
            <>
              <Plus className="size-5" strokeWidth={2} />
              {t('follow')}
            </>
          )}
        </button>
        {error && <p className="text-base text-red-500">{error}</p>}
      </div>
    )
  }

  return (
    <div className={cn('flex flex-col items-end gap-1', className)}>
      <Button
        type="button"
        variant={isFollowing ? 'outline' : 'default'}
        disabled={isSubmitting}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onClick={handleClick}
      >
        {isFollowing ? (isHovering ? t('unfollow') : t('following')) : t('follow')}
      </Button>
      {error && <p className="text-base text-red-500">{error}</p>}
    </div>
  )
}
