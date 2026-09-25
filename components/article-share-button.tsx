'use client'

import { Check, Share2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

import { Button } from '@/components/ui/button'

type ArticleShareButtonProps = {
  path: string
}

export const ArticleShareButton = ({ path }: ArticleShareButtonProps) => {
  const t = useTranslations('Articles')
  const [copied, setCopied] = useState(false)

  const handleShare = async () => {
    const url = `${window.location.origin}${path}`
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard access can fail (permissions, insecure context); nothing to fall back to here.
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className="shrink-0 gap-2 rounded-full"
      onClick={handleShare}
    >
      {copied ? <Check className="size-3.5" /> : <Share2 className="size-3.5" />}
      {copied ? t('linkCopied') : t('share')}
    </Button>
  )
}
