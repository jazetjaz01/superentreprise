'use client'

import { useTranslations } from 'next-intl'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { useRouter } from '@/i18n/navigation'
import { createClient } from '@/lib/supabase/client'

type CompanyFollowButtonProps = {
  viewerId: string
  companyId: string
  initialIsFollowing: boolean
}

export const CompanyFollowButton = ({
  viewerId,
  companyId,
  initialIsFollowing,
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
      } else {
        const { error: insertError } = await supabase
          .from('company_follows')
          .insert({ follower_id: viewerId, company_id: companyId })
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

  return (
    <div className="flex flex-col items-end gap-1">
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
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}
