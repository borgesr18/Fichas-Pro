import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    console.log('API unidades GET: Starting authentication check...', new Date().toISOString())
    const supabase = await createServerSupabaseClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    console.log('API unidades GET: Auth check result:', { 
      user: user ? { id: user.id, email: user.email } : null, 
      authError: authError?.message 
    })

    if (authError || !user) {
      console.log('API unidades GET: Unauthorized access attempt')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const unidades = await prisma.unidadeMedida.findMany({
      orderBy: {
        nome: 'asc'
      }
    })

    return NextResponse.json(unidades)
  } catch (error) {
    console.error('Erro ao buscar unidades de medida:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('API unidades POST: Starting authentication check...', new Date().toISOString())
    const supabase = await createServerSupabaseClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    console.log('API unidades POST: Auth check result:', { 
      user: user ? { id: user.id, email: user.email } : null, 
      authError: authError?.message 
    })

    if (authError || !user) {
      console.log('API unidades POST: Unauthorized access attempt')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { nome, abreviacao, tipo } = body

    if (!nome || !abreviacao) {
      return NextResponse.json(
        { error: 'Nome e abreviação são obrigatórios' },
        { status: 400 }
      )
    }

    const unidade = await prisma.unidadeMedida.create({
      data: {
        nome,
        abreviacao,
        tipo: tipo || 'UNIDADE'
      }
    })

    return NextResponse.json(unidade, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar unidade de medida:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
