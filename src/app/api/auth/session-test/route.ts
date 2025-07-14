import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function GET() {
  try {
    console.log('Session Test API: Starting comprehensive session check...', new Date().toISOString())
    
    const supabase = await createServerSupabaseClient()
    console.log('Session Test API: Supabase client created')
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    console.log('Session Test API: Auth result:', { 
      user: user ? { id: user.id, email: user.email, created_at: user.created_at } : null, 
      authError: authError?.message 
    })

    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    console.log('Session Test API: Session result:', {
      session: session ? { 
        user: session.user?.email,
        expires_at: session.expires_at,
        access_token: session.access_token?.substring(0, 20) + '...'
      } : null,
      sessionError: sessionError?.message
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
      session: session ? {
        expires_at: session.expires_at,
        token_type: session.token_type,
        user_email: session.user?.email
      } : null,
      errors: {
        auth: authError?.message || null,
        session: sessionError?.message || null
      },
      environment: {
        supabase_url: process.env.NEXT_PUBLIC_SUPABASE_URL,
        has_anon_key: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      }
    }

    console.log('Session Test API: Final response:', response)
    return NextResponse.json(response)
  } catch (error) {
    console.error('Session Test API: Unexpected error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
      authenticated: false,
      user: null,
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
