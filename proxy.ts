import createMiddleware from 'next-intl/middleware'
import { type NextRequest } from 'next/server'
import { routing } from '@/i18n/routing'
import { updateSession } from '@/lib/supabase/middleware'

const handleI18n = createMiddleware(routing)

export async function proxy(request: NextRequest) {
  const sessionResponse = await updateSession(request)

  // Unauthenticated redirect, or the locale-less /auth/confirm route handler.
  const isRedirect = sessionResponse.status >= 300 && sessionResponse.status < 400
  if (isRedirect || request.nextUrl.pathname.startsWith('/auth/confirm')) {
    return sessionResponse
  }

  const response = handleI18n(request)
  sessionResponse.cookies
    .getAll()
    .forEach((cookie) => response.cookies.set(cookie))
  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
