import { NextResponse } from 'next/server'

export async function GET() {
  try {
    console.log('Test auth API: Environment check')
    console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
    console.log('Has NEXT_PUBLIC_SUPABASE_ANON_KEY:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

    return NextResponse.json({
      message: 'Test auth endpoint working',
      timestamp: new Date().toISOString(),
      env: {
        supabase_url: process.env.NEXT_PUBLIC_SUPABASE_URL,
        has_anon_key: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      }
    })
  } catch (error) {
    console.error('Test auth API error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
