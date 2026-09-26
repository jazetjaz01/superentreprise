'use client'

import { useTranslations } from 'next-intl'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { UserAvatar } from '@/components/user-avatar'
import { Link } from '@/i18n/navigation'
import { createClient } from '@/lib/supabase/client'

export type FollowerProfile = {
  id: string
  slug: string
  full_name: string | null
  avatar_url: string | null
  headline: string | null
}

type FollowersManagerProps = {
  profileId: string
  followers: FollowerProfile[]
  anonymousLabel: string
}

export const FollowersManager = ({ profileId, followers, anonymousLabel }: FollowersManagerProps) => {
  const t = useTranslations('ProfilePage.follow')
  const [open, setOpen] = useState(false)
  const [list, setList] = useState(followers)
  const [removingId, setRemovingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleRemove = async (followerId: string) => {
    const supabase = createClient()
    setRemovingId(followerId)
    setError(null)

    try {
      const { error: deleteError } = await supabase
        .from('follows')
        .delete()
        .eq('follower_id', followerId)
        .eq('followee_id', profileId)
      if (deleteError) throw deleteError

      setList((current) => current.filter((follower) => follower.id !== followerId))
    } catch {
      setError(t('error'))
    } finally {
      setRemovingId(null)
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-sm font-semibold text-foreground hover:underline"
      >
        {t('followersCount', { count: followers.length })}
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t('followersDialogTitle')}</DialogTitle>
          </DialogHeader>

          {list.length === 0 ? (
            <p className="text-sm text-muted-foreground">{t('noFollowers')}</p>
          ) : (
            <ul className="flex flex-col gap-3">
              {list.map((follower) => {
                const name = follower.full_name ?? anonymousLabel
                return (
                  <li key={follower.id} className="flex items-center gap-3">
                    <Link href={`/profile/${follower.slug}`} className="flex flex-1 items-center gap-3 min-w-0">
                      <UserAvatar name={name} avatarUrl={follower.avatar_url} size={40} />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold hover:underline">{name}</p>
                        {follower.headline && (
                          <p className="truncate text-xs text-muted-foreground">{follower.headline}</p>
                        )}
                      </div>
                    </Link>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={removingId === follower.id}
                      onClick={() => handleRemove(follower.id)}
                    >
                      {t('removeFollower')}
                    </Button>
                  </li>
                )
              })}
            </ul>
          )}

          {error && <p className="text-sm text-red-500">{error}</p>}
        </DialogContent>
      </Dialog>
    </>
  )
}
