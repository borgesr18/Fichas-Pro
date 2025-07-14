import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { prisma } from '@/lib/prisma'

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    console.log('API insumos PUT: Starting authentication check...', new Date().toISOString())
    const supabase = await createServerSupabaseClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    console.log('API insumos PUT: Auth check result:', { 
      user: user ? { id: user.id, email: user.email } : null, 
      authError: authError?.message 
    })

    if (authError || !user) {
      console.log('API insumos PUT: Unauthorized access attempt')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { 
      nome, 
      categoriaId, 
      unidadeId, 
      precoPorUnidade, 
      fornecedorId, 
      estoqueAtual, 
      estoqueMinimo, 
      condicaoArmazenamento, 
      dataCompra 
    } = body

    if (!nome || !categoriaId || !unidadeId || !precoPorUnidade) {
      return NextResponse.json(
        { error: 'Nome, categoria, unidade e preço são obrigatórios' },
        { status: 400 }
      )
    }

    const insumo = await prisma.insumo.update({
      where: {
        id: id,
        userId: user.id
      },
      data: {
        nome,
        categoriaId,
        unidadeId,
        precoPorUnidade: parseFloat(precoPorUnidade),
        fornecedorId: fornecedorId || null,
        estoqueAtual: estoqueAtual ? parseFloat(estoqueAtual) : 0,
        estoqueMinimo: estoqueMinimo ? parseFloat(estoqueMinimo) : 0,
        condicaoArmazenamento,
        dataCompra: dataCompra ? new Date(dataCompra) : null
      },
      include: {
        categoria: true,
        unidade: true,
        fornecedor: true
      }
    })

    return NextResponse.json(insumo)
  } catch (error) {
    console.error('Erro ao atualizar insumo:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    console.log('API insumos DELETE: Starting authentication check...', new Date().toISOString())
    const supabase = await createServerSupabaseClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    console.log('API insumos DELETE: Auth check result:', { 
      user: user ? { id: user.id, email: user.email } : null, 
      authError: authError?.message 
    })

    if (authError || !user) {
      console.log('API insumos DELETE: Unauthorized access attempt')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await prisma.insumo.delete({
      where: {
        id: id,
        userId: user.id
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao excluir insumo:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
