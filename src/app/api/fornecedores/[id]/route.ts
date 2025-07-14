import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { prisma } from '@/lib/prisma'

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    console.log('API fornecedores PUT: Starting authentication check...', new Date().toISOString())
    const supabase = await createServerSupabaseClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    console.log('API fornecedores PUT: Auth check result:', { 
      user: user ? { id: user.id, email: user.email } : null, 
      authError: authError?.message 
    })

    if (authError || !user) {
      console.log('API fornecedores PUT: Unauthorized access attempt')
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

    const fornecedor = await prisma.fornecedor.update({
      where: {
        id: params.id,
        userId: user.id
      },
      data: {
        nome,
        contato,
        telefone,
        email,
        endereco
      }
    })

    return NextResponse.json(fornecedor)
  } catch (error) {
    console.error('Erro ao atualizar fornecedor:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    console.log('API fornecedores DELETE: Starting authentication check...', new Date().toISOString())
    const supabase = await createServerSupabaseClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    console.log('API fornecedores DELETE: Auth check result:', { 
      user: user ? { id: user.id, email: user.email } : null, 
      authError: authError?.message 
    })

    if (authError || !user) {
      console.log('API fornecedores DELETE: Unauthorized access attempt')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await prisma.fornecedor.delete({
      where: {
        id: params.id,
        userId: user.id
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao excluir fornecedor:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
