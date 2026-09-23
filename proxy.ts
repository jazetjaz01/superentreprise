import createMiddleware from 'next-intl/middleware'
import { NextResponse, type NextRequest } from 'next/server'
import { routing } from '@/i18n/routing'
import { updateSession } from '@/lib/supabase/middleware'

const handleI18n = createMiddleware(routing)

// Known bots, crawlers and scraping tools. Matched against the User-Agent
// header, case-insensitively. Blocking these also disables link previews on
// the platforms whose crawlers are listed here (e.g. Facebook, LinkedIn).
const BOT_USER_AGENT = new RegExp(
  [
    'bot',
    'crawl',
    'spider',
    'slurp',
    'facebookexternalhit',
    'meta-externalagent',
    'whatsapp',
    'telegram',
    'discordbot',
    'skypeuripreview',
    'python-requests',
    'curl/',
    'wget/',
    'scrapy',
    'headlesschrome',
    'phantomjs',
    'node-fetch',
    'axios/',
    'go-http-client',
    'httrack',
    'libwww-perl',
    'semrush',
    'ahrefs',
    'mj12bot',
    'dotbot',
    'petalbot',
    'bytespider',
    'ccbot',
    'gptbot',
    'chatgpt-user',
    'perplexitybot',
    'anthropic',
    'claude-web',
  ].join('|'),
  'i'
)

// Search engine crawlers kept out of the block above so the site stays indexable.
const ALLOWED_SEARCH_BOT_USER_AGENT =
  /googlebot|google-inspectiontool|adsbot-google|mediapartners-google|apis-google|storebot-google|bingbot|adidxbot|bingpreview/i

export async function proxy(request: NextRequest) {
  const userAgent = request.headers.get('user-agent')
  if (
    userAgent &&
    BOT_USER_AGENT.test(userAgent) &&
    !ALLOWED_SEARCH_BOT_USER_AGENT.test(userAgent)
  ) {
    return new NextResponse('Forbidden', { status: 403 })
  }

  const sessionResponse = await updateSession(request)

  // Unauthenticated redirect, or one of the locale-less auth route handlers.
  const { pathname } = request.nextUrl
  const isRedirect = sessionResponse.status >= 300 && sessionResponse.status < 400
  const isAuthRouteHandler =
    pathname.startsWith('/auth/confirm') || pathname.startsWith('/auth/oauth')
  if (isRedirect || isAuthRouteHandler) {
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
