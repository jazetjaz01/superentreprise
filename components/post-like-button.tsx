'use client'

import { Heart } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

import { useRouter } from '@/i18n/navigation'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'

type PostLikeButtonProps = {
  postId: string
  viewerId: string
  initialIsLiked: boolean
}

export const PostLikeButton = ({ postId, viewerId, initialIsLiked }: PostLikeButtonProps) => {
  const t = useTranslations('Feed')
  const router = useRouter()
  const [isLiked, setIsLiked] = useState(initialIsLiked)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleClick = async () => {
    const supabase = createClient()
    setIsSubmitting(true)

    const wasLiked = isLiked
    setIsLiked(!wasLiked)

    try {
      if (wasLiked) {
        const { error } = await supabase
          .from('post_likes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', viewerId)
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('post_likes')
          .insert({ post_id: postId, user_id: viewerId })
        if (error && error.code !== '23505') throw error
      }
      router.refresh()
    } catch {
      setIsLiked(wasLiked)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <button
      type="button"
      disabled={isSubmitting}
      onClick={handleClick}
      className={cn(
        'flex cursor-pointer items-center gap-1.5 rounded-md px-2 py-1.5 text-sm font-normal transition-colors hover:bg-primary/10 disabled:opacity-45',
        isLiked ? 'text-primary' : 'text-ink-800',
      )}
    >
      <Heart className={cn('size-4', isLiked && 'fill-primary')} strokeWidth={1.5} />
      {t('like')}
    </button>
  )
}
