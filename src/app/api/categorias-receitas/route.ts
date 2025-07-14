import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    console.log('API categorias-receitas GET: Starting authentication check...', new Date().toISOString())
    const supabase = await createServerSupabaseClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    console.log('API categorias-receitas GET: Auth check result:', { 
      user: user ? { id: user.id, email: user.email } : null, 
      authError: authError?.message 
    })

    if (authError || !user) {
      console.log('API categorias-receitas GET: Unauthorized access attempt')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const categorias = await prisma.categoriaReceita.findMany({
      where: {
        userId: user.id
      },
      orderBy: {
        nome: 'asc'
      }
    })

    return NextResponse.json(categorias)
  } catch (error) {
    console.error('Erro ao buscar categorias de receitas:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('API categorias-receitas POST: Starting authentication check...', new Date().toISOString())
    const supabase = await createServerSupabaseClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    console.log('API categorias-receitas POST: Auth check result:', { 
      user: user ? { id: user.id, email: user.email } : null, 
      authError: authError?.message 
    })

    if (authError || !user) {
      console.log('API categorias-receitas POST: Unauthorized access attempt')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { nome, descricao } = body

    if (!nome) {
      return NextResponse.json(
        { error: 'Nome é obrigatório' },
        { status: 400 }
      )
    }

    const categoria = await prisma.categoriaReceita.create({
      data: {
        nome,
        descricao,
        userId: user.id
      }
    })

    return NextResponse.json(categoria, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar categoria de receita:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
