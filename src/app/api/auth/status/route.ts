import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function GET() {
  try {
    console.log('Auth status API: Starting check...')
    
    const supabase = await createServerSupabaseClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    console.log('Auth status API: Result:', { 
      user: user ? { id: user.id, email: user.email } : null, 
      authError: authError?.message 
    })

    return NextResponse.json({
      authenticated: !!user,
      user: user ? {
        id: user.id,
        email: user.email,
        created_at: user.created_at
      } : null,
      error: authError?.message || null
    })
  } catch (error) {
    console.error('Auth status API error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      authenticated: false,
      user: null
    }, { status: 500 })
  }
}
