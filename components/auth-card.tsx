import { Logo } from '@/components/logo'
import { cn } from '@/lib/utils'

type AuthCardProps = {
  title: React.ReactNode
  description?: React.ReactNode
  className?: string
  children: React.ReactNode
}

export function AuthCard({ title, description, className, children }: AuthCardProps) {
  return (
    <div
      className={cn(
        'relative w-full overflow-hidden rounded-xl border bg-linear-to-b from-muted/50 to-card px-8 py-8 shadow-lg/5 dark:from-transparent dark:shadow-xl',
        className
      )}
    >
      <div
        className="absolute inset-0 -top-px -left-px z-0"
        style={{
          backgroundImage: `
        linear-gradient(to right, color-mix(in srgb, var(--card-foreground) 8%, transparent) 1px, transparent 1px),
        linear-gradient(to bottom, color-mix(in srgb, var(--card-foreground) 8%, transparent) 1px, transparent 1px)
      `,
          backgroundSize: '20px 20px',
          backgroundPosition: '0 0, 0 0',
          maskImage: `
        repeating-linear-gradient(
              to right,
              black 0px,
              black 3px,
              transparent 3px,
              transparent 8px
            ),
            repeating-linear-gradient(
              to bottom,
              black 0px,
              black 3px,
              transparent 3px,
              transparent 8px
            ),
            radial-gradient(ellipse 70% 50% at 50% 0%, #000 60%, transparent 100%)
      `,
          WebkitMaskImage: `
 repeating-linear-gradient(
              to right,
              black 0px,
              black 3px,
              transparent 3px,
              transparent 8px
            ),
            repeating-linear-gradient(
              to bottom,
              black 0px,
              black 3px,
              transparent 3px,
              transparent 8px
            ),
            radial-gradient(ellipse 70% 50% at 50% 0%, #000 60%, transparent 100%)
      `,
          maskComposite: 'intersect',
          WebkitMaskComposite: 'source-in',
        }}
      />

      <div className="relative isolate flex flex-col items-center">
        <Logo />
        <h1 className="mt-4 text-xl font-medium">{title}</h1>
        {description && (
          <p className="mt-1 text-center text-sm text-muted-foreground">
            {description}
          </p>
        )}
        {children}
      </div>
    </div>
  )
}
