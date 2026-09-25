'use client'

import TiptapImage from '@tiptap/extension-image'
import TiptapLink from '@tiptap/extension-link'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import {
  Bold,
  Braces,
  Code2,
  ImageIcon,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Minus,
  Quote,
  X,
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { useRef, useState } from 'react'

import { Button } from '@/components/ui/button'
import { UserAvatar } from '@/components/user-avatar'
import { useRouter } from '@/i18n/navigation'
import { createClient } from '@/lib/supabase/client'

const MAX_COVER_BYTES = 5 * 1024 * 1024
const IMAGE_EXTENSIONS: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
}

type ExistingArticle = {
  id: string
  slug: string
  title: string
  content: string
  coverImagePath: string | null
}

type ArticleFormProps = {
  userId: string
  authorName: string
  authorAvatarUrl: string | null
  article?: ExistingArticle
}

export const ArticleForm = ({
  userId,
  authorName,
  authorAvatarUrl,
  article,
}: ArticleFormProps) => {
  const t = useTranslations('Articles.write')
  const router = useRouter()
  const isEdit = !!article
  const fileInput = useRef<HTMLInputElement>(null)
  const inlineImageInput = useRef<HTMLInputElement>(null)
  const [title, setTitle] = useState(article?.title ?? '')
  const [file, setFile] = useState<File | null>(null)
  const [coverRemoved, setCoverRemoved] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      TiptapLink.configure({ openOnClick: false }),
      TiptapImage,
    ],
    content: article?.content ?? '',
    editorProps: {
      attributes: {
        class:
          'prose prose-lg max-w-none focus:outline-none min-h-[50vh] **:text-foreground',
      },
    },
  })

  const existingCoverUrl =
    !coverRemoved && article?.coverImagePath
      ? createClient().storage.from('article-covers').getPublicUrl(article.coverImagePath)
          .data.publicUrl
      : null
  const shownCoverUrl = previewUrl ?? existingCoverUrl

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    e.target.value = ''
    if (!selected) return

    if (!(selected.type in IMAGE_EXTENSIONS)) {
      setError(t('fileType'))
      return
    }
    if (selected.size > MAX_COVER_BYTES) {
      setError(t('fileTooLarge'))
      return
    }

    setError(null)
    setFile(selected)
    setCoverRemoved(false)
    setPreviewUrl(URL.createObjectURL(selected))
  }

  const handleRemoveCover = () => {
    setFile(null)
    setPreviewUrl(null)
    setCoverRemoved(true)
  }

  const handleInlineImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    e.target.value = ''
    if (!selected || !editor) return

    if (!(selected.type in IMAGE_EXTENSIONS)) {
      setError(t('fileType'))
      return
    }
    if (selected.size > MAX_COVER_BYTES) {
      setError(t('fileTooLarge'))
      return
    }

    const supabase = createClient()
    const path = `${userId}/${crypto.randomUUID()}.${IMAGE_EXTENSIONS[selected.type]}`
    const { error: uploadError } = await supabase.storage
      .from('article-covers')
      .upload(path, selected, { contentType: selected.type, cacheControl: '31536000' })
    if (uploadError) {
      setError(t('error'))
      return
    }

    const { data } = supabase.storage.from('article-covers').getPublicUrl(path)
    editor.chain().focus().setImage({ src: data.publicUrl }).run()
  }

  const handleSetLink = () => {
    if (!editor) return
    const previousUrl = editor.getAttributes('link').href as string | undefined
    const url = window.prompt('URL', previousUrl ?? 'https://')
    if (url === null) return
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }

  const handleStyleChange = (value: string) => {
    if (!editor) return
    const chain = editor.chain().focus()
    if (value === 'paragraph') chain.setParagraph().run()
    else if (value === 'h2') chain.setHeading({ level: 2 }).run()
    else if (value === 'h3') chain.setHeading({ level: 3 }).run()
    else if (value === 'blockquote') chain.toggleBlockquote().run()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editor) return
    const content = editor.getHTML()
    const supabase = createClient()
    setIsSubmitting(true)
    setError(null)

    let newCoverPath: string | null = null
    try {
      if (file) {
        newCoverPath = `${userId}/${crypto.randomUUID()}.${IMAGE_EXTENSIONS[file.type]}`
        const { error: uploadError } = await supabase.storage
          .from('article-covers')
          .upload(newCoverPath, file, { contentType: file.type, cacheControl: '31536000' })
        if (uploadError) throw uploadError
      }

      if (isEdit) {
        const coverImagePath = newCoverPath ?? (coverRemoved ? null : article.coverImagePath)

        const { error: updateError } = await supabase
          .from('articles')
          .update({
            title: title.trim(),
            content,
            cover_image_path: coverImagePath,
          })
          .eq('id', article.id)
        if (updateError) throw updateError

        const oldCoverPath = article.coverImagePath
        if (oldCoverPath && oldCoverPath !== coverImagePath) {
          await supabase.storage.from('article-covers').remove([oldCoverPath])
        }

        router.push(`/articles/${article.slug}`)
      } else {
        const { data, error: insertError } = await supabase
          .from('articles')
          .insert({
            author_id: userId,
            title: title.trim(),
            content,
            cover_image_path: newCoverPath,
          })
          .select('slug')
          .single()
        if (insertError) throw insertError

        router.push(`/articles/${data.slug}`)
      }
    } catch {
      if (newCoverPath) {
        await supabase.storage.from('article-covers').remove([newCoverPath])
      }
      setError(t('error'))
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex min-h-screen flex-col bg-muted">
      <div className="sticky top-0 z-10 flex flex-wrap items-center gap-3 border-b bg-white px-4 py-2 sm:px-6">
        <div className="flex items-center gap-2">
          <UserAvatar name={authorName} avatarUrl={authorAvatarUrl} size={40} />
          <div className="leading-tight">
            <p className="text-sm font-semibold">{authorName}</p>
            <p className="text-xs text-muted-foreground">{t('individualArticle')}</p>
          </div>
        </div>

        <div className="flex flex-1 flex-wrap items-center justify-center gap-1">
          <select
            aria-label={t('style')}
            defaultValue=""
            onChange={(e) => {
              handleStyleChange(e.target.value)
              e.target.value = ''
            }}
            className="rounded-md border px-2 py-1.5 text-sm text-foreground"
          >
            <option value="" disabled>
              {t('style')}
            </option>
            <option value="paragraph">{t('styleParagraph')}</option>
            <option value="h2">{t('styleHeading2')}</option>
            <option value="h3">{t('styleHeading3')}</option>
            <option value="blockquote">{t('styleQuote')}</option>
          </select>

          <ToolbarButton
            active={editor?.isActive('bold')}
            label={t('bold')}
            onClick={() => editor?.chain().focus().toggleBold().run()}
          >
            <Bold className="size-4" />
          </ToolbarButton>
          <ToolbarButton
            active={editor?.isActive('italic')}
            label={t('italic')}
            onClick={() => editor?.chain().focus().toggleItalic().run()}
          >
            <Italic className="size-4" />
          </ToolbarButton>
          <ToolbarButton
            active={editor?.isActive('bulletList')}
            label={t('bulletList')}
            onClick={() => editor?.chain().focus().toggleBulletList().run()}
          >
            <List className="size-4" />
          </ToolbarButton>
          <ToolbarButton
            active={editor?.isActive('orderedList')}
            label={t('orderedList')}
            onClick={() => editor?.chain().focus().toggleOrderedList().run()}
          >
            <ListOrdered className="size-4" />
          </ToolbarButton>
          <ToolbarButton
            active={editor?.isActive('blockquote')}
            label={t('styleQuote')}
            onClick={() => editor?.chain().focus().toggleBlockquote().run()}
          >
            <Quote className="size-4" />
          </ToolbarButton>
          <ToolbarButton
            active={editor?.isActive('code')}
            label={t('inlineCode')}
            onClick={() => editor?.chain().focus().toggleCode().run()}
          >
            <Braces className="size-4" />
          </ToolbarButton>
          <ToolbarButton
            label={t('divider')}
            onClick={() => editor?.chain().focus().setHorizontalRule().run()}
          >
            <Minus className="size-4" />
          </ToolbarButton>
          <ToolbarButton active={editor?.isActive('link')} label={t('link')} onClick={handleSetLink}>
            <LinkIcon className="size-4" />
          </ToolbarButton>
          <ToolbarButton
            active={editor?.isActive('codeBlock')}
            label={t('codeBlock')}
            onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
          >
            <Code2 className="size-4" />
          </ToolbarButton>
          <ToolbarButton
            label={t('insertImage')}
            onClick={() => inlineImageInput.current?.click()}
          >
            <ImageIcon className="size-4" />
          </ToolbarButton>
          <input
            ref={inlineImageInput}
            type="file"
            accept={Object.keys(IMAGE_EXTENSIONS).join(',')}
            className="hidden"
            onChange={handleInlineImageChange}
          />
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="rounded-full bg-sky-600 px-6 text-white hover:bg-sky-700"
        >
          {isSubmitting ? t('publishing') : isEdit ? t('save') : t('publish')}
        </Button>
      </div>

      <div className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:px-6">
        {shownCoverUrl ? (
          <div className="relative">
            <Image
              src={shownCoverUrl}
              alt=""
              width={1200}
              height={600}
              unoptimized
              className="max-h-96 w-full rounded-lg object-cover"
            />
            <Button
              type="button"
              size="icon-sm"
              variant="secondary"
              aria-label={t('removeCover')}
              className="absolute top-2 right-2"
              onClick={handleRemoveCover}
            >
              <X />
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-4 rounded-lg border bg-muted/40 px-6 py-16 text-center">
            <ImageIcon className="size-10 text-muted-foreground" />
            <p className="text-foreground">{t('coverPrompt')}</p>
            <Button type="button" variant="outline" onClick={() => fileInput.current?.click()}>
              {t('addCover')}
            </Button>
          </div>
        )}
        <input
          ref={fileInput}
          type="file"
          accept={Object.keys(IMAGE_EXTENSIONS).join(',')}
          className="hidden"
          onChange={handleFileChange}
        />

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          maxLength={200}
          placeholder={t('titlePlaceholder')}
          className="mt-6 w-full border-0 text-4xl font-bold text-foreground outline-none placeholder:text-muted-foreground"
        />

        <div className="mt-6">
          <EditorContent editor={editor} />
        </div>

        {error && <p className="mt-4 text-sm text-red-500">{error}</p>}
      </div>
    </form>
  )
}

type ToolbarButtonProps = {
  children: React.ReactNode
  label: string
  active?: boolean
  onClick: () => void
}

const ToolbarButton = ({ children, label, active, onClick }: ToolbarButtonProps) => (
  <Button
    type="button"
    variant="ghost"
    size="icon-sm"
    aria-label={label}
    aria-pressed={active}
    data-active={active}
    className="data-[active=true]:bg-muted data-[active=true]:text-foreground"
    onMouseDown={(e) => e.preventDefault()}
    onClick={onClick}
  >
    {children}
  </Button>
)
