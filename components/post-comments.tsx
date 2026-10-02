'use client'

import { MessageCircle, Trash2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { UserAvatar } from '@/components/user-avatar'
import { Link, useRouter } from '@/i18n/navigation'
import { createClient } from '@/lib/supabase/client'

export type PostComment = {
  id: string
  author_id: string
  content: string
  created_at: string
  profiles: { slug: string; full_name: string | null; avatar_url: string | null } | null
}

type PostCommentsProps = {
  postId: string
  postAuthorId: string
  viewerId: string
  viewerName: string
  viewerAvatarUrl: string | null
  initialComments: PostComment[]
  anonymousLabel: string
  className?: string
}

export const PostComments = ({
  postId,
  postAuthorId,
  viewerId,
  viewerName,
  viewerAvatarUrl,
  initialComments,
  anonymousLabel,
  className,
}: PostCommentsProps) => {
  const t = useTranslations('Feed')
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [comments, setComments] = useState(initialComments)
  const [value, setValue] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const content = value.trim()
    if (!content) return

    const supabase = createClient()
    setIsSubmitting(true)
    setError(null)

    try {
      const { data, error: insertError } = await supabase
        .from('post_comments')
        .insert({ post_id: postId, author_id: viewerId, content })
        .select('id, author_id, content, created_at')
        .single()
      if (insertError) throw insertError

      setComments((current) => [
        ...current,
        {
          ...data,
          profiles: { slug: '', full_name: viewerName, avatar_url: viewerAvatarUrl },
        },
      ])
      setValue('')
      router.refresh()
    } catch {
      setError(t('commentError'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (commentId: string) => {
    const supabase = createClient()
    const { error: deleteError } = await supabase
      .from('post_comments')
      .delete()
      .eq('id', commentId)
    if (deleteError) return

    setComments((current) => current.filter((comment) => comment.id !== commentId))
    router.refresh()
  }

  return (
    <div className={className}>
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="flex cursor-pointer items-center gap-1.5 rounded-md px-2 py-1.5 text-base font-medium text-ink-800 transition-colors hover:bg-primary/10"
      >
        <MessageCircle className="size-4" strokeWidth={1.5} />
        {t('comment')}
      </button>

      {open && (
        <div className="mt-3 flex flex-col gap-3">
          {comments.map((comment) => {
            const name = comment.profiles?.full_name ?? anonymousLabel
            const canDelete = comment.author_id === viewerId || postAuthorId === viewerId

            return (
              <div key={comment.id} className="flex items-start gap-2">
                {comment.profiles?.slug ? (
                  <Link href={`/profile/${comment.profiles.slug}`}>
                    <UserAvatar name={name} avatarUrl={comment.profiles.avatar_url} size={32} />
                  </Link>
                ) : (
                  <UserAvatar name={name} avatarUrl={comment.profiles?.avatar_url} size={32} />
                )}
                <div className="min-w-0 flex-1 rounded-md border border-border bg-secondary px-3 py-2">
                  <div className="flex items-center justify-between gap-2">
                    {comment.profiles?.slug ? (
                      <Link
                        href={`/profile/${comment.profiles.slug}`}
                        className="font-heading text-sm font-medium hover:underline"
                      >
                        {name}
                      </Link>
                    ) : (
                      <span className="font-heading text-sm font-medium">{name}</span>
                    )}
                    {canDelete && (
                      <button
                        type="button"
                        aria-label={t('deleteComment')}
                        onClick={() => handleDelete(comment.id)}
                        className="shrink-0 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    )}
                  </div>
                  <p className="wrap-break-word text-base whitespace-pre-wrap">
                    {comment.content}
                  </p>
                </div>
              </div>
            )
          })}

          <form onSubmit={handleSubmit} className="flex items-start gap-2">
            <UserAvatar name={viewerName} avatarUrl={viewerAvatarUrl} size={32} />
            <div className="flex-1">
              <Textarea
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={t('commentPlaceholder')}
                maxLength={3000}
                rows={1}
                className="min-h-9 resize-none py-2"
              />
              {error && <p className="mt-1 text-base text-red-500">{error}</p>}
              {value.trim() && (
                <Button type="submit" size="sm" disabled={isSubmitting} className="mt-2">
                  {isSubmitting ? t('commentSending') : t('commentSend')}
                </Button>
              )}
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
