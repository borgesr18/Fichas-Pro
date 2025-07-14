import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    console.log('API fornecedores GET: Starting authentication check...', new Date().toISOString())
    const supabase = await createServerSupabaseClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    console.log('API fornecedores GET: Auth check result:', { 
      user: user ? { id: user.id, email: user.email } : null, 
      authError: authError?.message 
    })

    if (authError || !user) {
      console.log('API fornecedores GET: Unauthorized access attempt')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const fornecedores = await prisma.fornecedor.findMany({
      where: {
        userId: user.id
      },
      orderBy: {
        nome: 'asc'
      }
    })

    return NextResponse.json(fornecedores)
  } catch (error) {
    console.error('Erro ao buscar fornecedores:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('API fornecedores POST: Starting authentication check...', new Date().toISOString())
    const supabase = await createServerSupabaseClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    console.log('API fornecedores POST: Auth check result:', { 
      user: user ? { id: user.id, email: user.email } : null, 
      authError: authError?.message 
    })

    if (authError || !user) {
      console.log('API fornecedores POST: Unauthorized access attempt')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { nome, contato, telefone, email, endereco } = body

    if (!nome) {
      return NextResponse.json(
        { error: 'Nome é obrigatório' },
        { status: 400 }
      )
    }

    const fornecedor = await prisma.fornecedor.create({
      data: {
        nome,
        contato,
        telefone,
        email,
        endereco,
        userId: user.id
      }
    })

    return NextResponse.json(fornecedor, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar fornecedor:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
