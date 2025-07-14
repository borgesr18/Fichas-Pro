import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
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
    const supabase = await createServerSupabaseClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
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
