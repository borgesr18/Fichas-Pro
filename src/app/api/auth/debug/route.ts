import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function GET() {
  try {
    console.log('Debug API: Starting authentication check...')
    
    const supabase = await createServerSupabaseClient()
    console.log('Debug API: Supabase client created')
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    console.log('Debug API: Auth result:', { 
      user: user ? { id: user.id, email: user.email } : null, 
      authError: authError?.message 
    })

    const response = {
      timestamp: new Date().toISOString(),
      authenticated: !!user,
      user: user ? {
        id: user.id,
        email: user.email,
        created_at: user.created_at,
        email_confirmed_at: user.email_confirmed_at
      } : null,
      error: authError?.message || null,
      supabase_url: process.env.NEXT_PUBLIC_SUPABASE_URL,
      has_anon_key: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    }

    console.log('Debug API: Response:', response)
    return NextResponse.json(response)
  } catch (error) {
    console.error('Debug API: Unexpected error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
      authenticated: false,
      user: null
    }, { status: 500 })
  }
}
