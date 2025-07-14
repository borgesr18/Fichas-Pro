import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createServerSupabaseClient() {
  const cookieStore = await cookies()
  
  console.log('Server Supabase Client: Creating client with cookies...', {
    timestamp: new Date().toISOString(),
    cookieCount: cookieStore.getAll().length,
    cookieNames: cookieStore.getAll().map(c => c.name)
  })

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          const value = cookieStore.get(name)?.value
          console.log('Server Supabase Client: Cookie get:', { name, hasValue: !!value })
          return value
        },
        set(name: string, value: string, options: Record<string, unknown>) {
          console.log('Server Supabase Client: Cookie set:', { name, hasValue: !!value })
          cookieStore.set(name, value, options)
        },
        remove(name: string, options: Record<string, unknown>) {
          console.log('Server Supabase Client: Cookie remove:', { name })
          cookieStore.set(name, '', { ...options, maxAge: 0 })
        },
      },
    }
  )
}
