import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          if (typeof document !== 'undefined') {
            const value = document.cookie
              .split('; ')
              .find(row => row.startsWith(`${name}=`))
              ?.split('=')[1]
            console.log('Client Supabase: Cookie get:', { name, hasValue: !!value })
            return value
          }
          return undefined
        },
        set(name: string, value: string, options: Record<string, unknown>) {
          if (typeof document !== 'undefined') {
            console.log('Client Supabase: Cookie set:', { name, hasValue: !!value })
            let cookieString = `${name}=${value}`
            
            if (options.maxAge) cookieString += `; Max-Age=${options.maxAge}`
            if (options.expires) cookieString += `; Expires=${options.expires}`
            if (options.path) cookieString += `; Path=${options.path}`
            if (options.domain) cookieString += `; Domain=${options.domain}`
            if (options.secure) cookieString += `; Secure`
            if (options.httpOnly) cookieString += `; HttpOnly`
            if (options.sameSite) cookieString += `; SameSite=${options.sameSite}`
            
            document.cookie = cookieString
          }
        },
        remove(name: string, options: Record<string, unknown>) {
          if (typeof document !== 'undefined') {
            console.log('Client Supabase: Cookie remove:', { name })
            let cookieString = `${name}=; Max-Age=0`
            if (options.path) cookieString += `; Path=${options.path}`
            if (options.domain) cookieString += `; Domain=${options.domain}`
            document.cookie = cookieString
          }
        },
      },
    }
  )
}
