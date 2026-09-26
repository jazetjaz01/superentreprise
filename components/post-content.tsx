'use client'

import { useTranslations } from 'next-intl'
import { useState } from 'react'

const WORD_LIMIT = 30

type PostContentProps = {
  content: string
}

export const PostContent = ({ content }: PostContentProps) => {
  const t = useTranslations('Feed')
  const [expanded, setExpanded] = useState(false)

  const words = content.split(/\s+/)
  const isTruncatable = words.length > WORD_LIMIT
  const truncated = words.slice(0, WORD_LIMIT).join(' ')

  return (
    <p className="wrap-break-word font-normal whitespace-pre-wrap">
      {expanded || !isTruncatable ? content : `${truncated}… `}
      {isTruncatable && !expanded && (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="font-semibold text-muted-foreground hover:underline"
        >
          {t('seeMore')}
        </button>
      )}
    </p>
  )
}
