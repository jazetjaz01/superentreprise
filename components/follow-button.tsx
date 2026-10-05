'use client'

import { Plus } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { useRouter } from '@/i18n/navigation'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'

type FollowButtonProps = {
  viewerId: string
  profileId: string
  initialIsFollowing: boolean
  size?: 'default' | 'sm'
  variant?: 'button' | 'text'
  className?: string
}

export const FollowButton = ({
  viewerId,
  profileId,
  initialIsFollowing,
  size = 'default',
  variant = 'button',
  className,
}: FollowButtonProps) => {
  const t = useTranslations('ProfilePage.follow')
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
          .from('follows')
          .delete()
          .eq('follower_id', viewerId)
          .eq('followee_id', profileId)
        if (deleteError) throw deleteError
        setIsFollowing(false)
      } else {
        const { error: insertError } = await supabase
          .from('follows')
          .insert({ follower_id: viewerId, followee_id: profileId })
        // A duplicate-key error means another button for the same author already
        // created the relationship (e.g. a second post from the same author whose
        // local state hadn't caught up yet) — treat it as success, not a failure.
        if (insertError && insertError.code !== '23505') throw insertError
        setIsFollowing(true)
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
        size={size}
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
