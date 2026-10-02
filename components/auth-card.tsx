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
        'w-full rounded-md border border-border bg-card px-8 py-8',
        className
      )}
    >
      <div className="flex flex-col items-center">
        <Logo />
        <h1 className="font-heading mt-4 text-2xl font-semibold">{title}</h1>
        {description && (
          <p className="mt-1 text-center text-base text-foreground">
            {description}
          </p>
        )}
        {children}
      </div>
    </div>
  )
}
