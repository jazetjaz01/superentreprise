'use client'

import { Check, Copy } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

type ProfileUrlCardProps = {
  path: string
}

export const ProfileUrlCard = ({ path }: ProfileUrlCardProps) => {
  const t = useTranslations('ProfilePage.publicUrl')
  const [copied, setCopied] = useState(false)
  const [url, setUrl] = useState(path)

  useEffect(() => {
    setUrl(`${window.location.origin}${path}`)
  }, [path])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard access can fail (permissions, insecure context); the link is still visible to copy manually.
    }
  }

  return (
    <Card>
      <CardContent>
        <h2 className="font-semibold">{t('title')}</h2>
        <p className="mt-2 truncate text-sm text-foreground">{url}</p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-3 gap-2"
          onClick={handleCopy}
        >
          {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
          {copied ? t('copied') : t('copy')}
        </Button>
      </CardContent>
    </Card>
  )
}
