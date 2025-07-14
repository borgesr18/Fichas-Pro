import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const insumos = await prisma.insumo.findMany({
      where: {
        userId: user.id
      },
      include: {
        categoria: true,
        unidade: true,
        fornecedor: true
      },
      orderBy: {
        nome: 'asc'
      }
    })

    return NextResponse.json(insumos)
  } catch (error) {
    console.error('Erro ao buscar insumos:', error)
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

    if (!nome || !categoriaId || !unidadeId || precoPorUnidade === undefined) {
      return NextResponse.json(
        { error: 'Campos obrigatórios: nome, categoria, unidade e preço' },
        { status: 400 }
      )
    }

    const insumo = await prisma.insumo.create({
      data: {
        nome,
        categoriaId,
        unidadeId,
        precoPorUnidade: parseFloat(precoPorUnidade),
        fornecedorId,
        estoqueAtual: parseFloat(estoqueAtual) || 0,
        estoqueMinimo: parseFloat(estoqueMinimo) || 0,
        condicaoArmazenamento,
        dataCompra: dataCompra ? new Date(dataCompra) : null,
        userId: user.id
      },
      include: {
        categoria: true,
        unidade: true,
        fornecedor: true
      }
    })

    return NextResponse.json(insumo, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar insumo:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
