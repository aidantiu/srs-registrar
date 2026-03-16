import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// Routes that don't require authentication
const PUBLIC_ROUTES = ['/login']

// Routes that authenticated users shouldn't access (redirect to dashboard)
const AUTH_ROUTES = ['/login']

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANT: Do not add logic between createServerClient and getUser()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let hasActiveProfile = false

  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('id, is_active')
      .eq('id', user.id)
      .maybeSingle()

    hasActiveProfile = Boolean(profile?.is_active)
  }

  const pathname = request.nextUrl.pathname
  const isAuthenticated = Boolean(user && hasActiveProfile)

  // If user is NOT authenticated and tries to access a protected route
  if (!isAuthenticated && !PUBLIC_ROUTES.some((route) => pathname.startsWith(route))) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // If user IS authenticated and tries to access auth routes (login)
  if (isAuthenticated && AUTH_ROUTES.some((route) => pathname.startsWith(route))) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
