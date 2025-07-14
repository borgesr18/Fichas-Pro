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

    const fichas = await prisma.fichaTecnica.findMany({
      where: {
        userId: user.id
      },
      include: {
        categoria: true,
        ingredientes: {
          include: {
            insumo: {
              include: {
                unidade: true
              }
            }
          }
        }
      },
      orderBy: {
        nome: 'asc'
      }
    })

    return NextResponse.json(fichas)
  } catch (error) {
    console.error('Erro ao buscar fichas técnicas:', error)
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
      tempoPreparo,
      temperaturaForno,
      modoPreparo,
      pesoFinal,
      observacoesTecnicas,
      nivelDificuldade,
      ingredientes
    } = body

    if (!nome || !categoriaId || !modoPreparo) {
      return NextResponse.json(
        { error: 'Campos obrigatórios: nome, categoria e modo de preparo' },
        { status: 400 }
      )
    }

    const ficha = await prisma.fichaTecnica.create({
      data: {
        nome,
        categoriaId,
        tempoPreparo: tempoPreparo || null,
        temperaturaForno: temperaturaForno || null,
        modoPreparo,
        pesoFinal: pesoFinal ? parseFloat(pesoFinal) : null,
        observacoesTecnicas,
        nivelDificuldade: nivelDificuldade || 'BASICO',
        versao: 1,
        userId: user.id,
        ingredientes: {
          create: ingredientes?.map((ing: any) => ({
            insumoId: ing.insumoId,
            quantidade: parseFloat(ing.quantidade),
            porcentagemPadeiro: parseFloat(ing.porcentagemPadeiro) || null
          })) || []
        }
      },
      include: {
        categoria: true,
        ingredientes: {
          include: {
            insumo: {
              include: {
                unidade: true
              }
            }
          }
        }
      }
    })

    return NextResponse.json(ficha, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar ficha técnica:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
