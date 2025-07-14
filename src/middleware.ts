import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          const value = request.cookies.get(name)?.value
          console.log('Middleware: Cookie get:', { name, hasValue: !!value })
          return value
        },
        set(name: string, value: string, options: Record<string, unknown>) {
          console.log('Middleware: Cookie set:', { name, hasValue: !!value })
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: Record<string, unknown>) {
          console.log('Middleware: Cookie remove:', { name })
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  const {
    data: { user },
    error: authError
  } = await supabase.auth.getUser()

  console.log('Middleware: Processing request:', {
    path: request.nextUrl.pathname,
    timestamp: new Date().toISOString(),
    cookies: request.cookies.getAll().map(c => ({ name: c.name, hasValue: !!c.value }))
  })

  console.log('Middleware: Auth check result:', {
    path: request.nextUrl.pathname,
    user: user ? { id: user.id, email: user.email } : null,
    authError: authError?.message,
    timestamp: new Date().toISOString()
  })

  if (request.nextUrl.pathname.startsWith('/dashboard') || 
      request.nextUrl.pathname.startsWith('/fornecedores') ||
      request.nextUrl.pathname.startsWith('/insumos') ||
      request.nextUrl.pathname.startsWith('/fichas-tecnicas') ||
      request.nextUrl.pathname.startsWith('/configuracoes')) {
    
    if (!user) {
      console.log('Middleware: Redirecting to login - no authenticated user for protected route')
      return NextResponse.redirect(new URL('/auth/login', request.url))
    } else {
      console.log('Middleware: Access granted to protected route:', request.nextUrl.pathname)
    }
  }

  if (request.nextUrl.pathname.startsWith('/auth') && user) {
    console.log('Middleware: Redirecting to dashboard - user already authenticated')
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
