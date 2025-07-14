import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { prisma } from '@/lib/prisma'

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    console.log('API fichas-tecnicas PUT: Starting authentication check...', new Date().toISOString())
    const supabase = await createServerSupabaseClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    console.log('API fichas-tecnicas PUT: Auth check result:', { 
      user: user ? { id: user.id, email: user.email } : null, 
      authError: authError?.message 
    })

    if (authError || !user) {
      console.log('API fichas-tecnicas PUT: Unauthorized access attempt')
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
      observacoes, 
      nivelDificuldade,
      ingredientes 
    } = body

    if (!nome || !categoriaId || !modoPreparo) {
      return NextResponse.json(
        { error: 'Nome, categoria e modo de preparo são obrigatórios' },
        { status: 400 }
      )
    }

    await prisma.fichaTecnica.update({
      where: {
        id: id,
        userId: user.id
      },
      data: {
        nome,
        categoriaId,
        tempoPreparo: tempoPreparo ? parseInt(tempoPreparo) : null,
        temperaturaForno: temperaturaForno ? parseInt(temperaturaForno) : null,
        modoPreparo,
        pesoFinal: pesoFinal ? parseFloat(pesoFinal) : undefined,
        observacoes,
        nivelDificuldade,
        versao: {
          increment: 1
        }
      }
    })

    if (ingredientes && Array.isArray(ingredientes)) {
      await prisma.ingredienteFicha.deleteMany({
        where: {
          fichaId: id
        }
      })

      for (const ingrediente of ingredientes) {
        await prisma.ingredienteFicha.create({
          data: {
            fichaId: id,
            insumoId: String(ingrediente.insumoId),
            quantidade: parseFloat(ingrediente.quantidade),
            unidadeId: String(ingrediente.unidadeId),
            porcentagemPadeiro: ingrediente.porcentagemPadeiro ? parseFloat(ingrediente.porcentagemPadeiro) : null
          }
        })
      }
    }

    const fichaCompleta = await prisma.fichaTecnica.findUnique({
      where: { id: id },
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

    return NextResponse.json(fichaCompleta)
  } catch (error) {
    console.error('Erro ao atualizar ficha técnica:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    console.log('API fichas-tecnicas DELETE: Starting authentication check...', new Date().toISOString())
    const supabase = await createServerSupabaseClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    console.log('API fichas-tecnicas DELETE: Auth check result:', { 
      user: user ? { id: user.id, email: user.email } : null, 
      authError: authError?.message 
    })

    if (authError || !user) {
      console.log('API fichas-tecnicas DELETE: Unauthorized access attempt')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await prisma.ingredienteFicha.deleteMany({
      where: {
        fichaId: id
      }
    })

    await prisma.fichaTecnica.delete({
      where: {
        id: id,
        userId: user.id
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao excluir ficha técnica:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
