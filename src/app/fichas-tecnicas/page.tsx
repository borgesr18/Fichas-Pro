'use client'

import React, { useState, useEffect, useRef } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import Link from 'next/link'
import { useReactToPrint } from 'react-to-print'
import FichaTecnicaPrintView from '@/components/fichas-tecnicas/FichaTecnicaPrintView'

interface FichaTecnica {
  id: string
  nome: string
  categoria: {
    id: string
    nome: string
  }
  tempoPreparo?: number
  temperaturaForno?: number
  modoPreparo: string
  pesoFinal?: number
  observacoesTecnicas?: string
  nivelDificuldade: string
  versao: number
  ingredientes: Array<{
    id: string
    quantidade: number
    porcentagemPadeiro?: number
    insumo: {
      id: string
      nome: string
      unidade: {
        nome: string
        abreviacao: string
      }
    }
  }>
  createdAt: Date
}

export default function FichasTecnicasPage() {
  const [fichas, setFichas] = useState<FichaTecnica[]>([])
  const [loading, setLoading] = useState(true)
  const [fichaToPrint, setFichaToPrint] = useState<FichaTecnica | null>(null)
  const componentRef = useRef<HTMLDivElement>(null)

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    onAfterPrint: () => setFichaToPrint(null),
    documentTitle: fichaToPrint ? `Ficha Tecnica - ${fichaToPrint.nome}` : 'Ficha Tecnica',
  })

  useEffect(() => {
    if (fichaToPrint) {
      handlePrint()
    }
  }, [fichaToPrint, handlePrint])

  useEffect(() => {
    fetchFichas()
  }, [])

  const fetchFichas = async () => {
    try {
      const response = await fetch('/api/fichas-tecnicas')
      if (response.ok) {
        const data = await response.json()
        setFichas(data)
      }
    } catch (error) {
      console.error('Erro ao buscar fichas técnicas:', error)
    } finally {
      setLoading(false)
    }
  }

  const getDifficultyColor = (nivel: string) => {
    switch (nivel) {
      case 'BASICO': return 'bg-green-100 text-green-800'
      case 'INTERMEDIARIO': return 'bg-yellow-100 text-yellow-800'
      case 'AVANCADO': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Fichas Técnicas</h1>
            <p className="mt-1 text-sm text-gray-600">
              Gerencie as fichas técnicas das receitas
            </p>
          </div>
          <Link href="/fichas-tecnicas/novo">
            <a className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Nova Ficha Técnica
            </a>
          </Link>
        </div>

        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Lista de Fichas Técnicas
            </h3>
            {loading ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
              </div>
            ) : fichas.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">
                Nenhuma ficha técnica cadastrada ainda.
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {fichas.map((ficha) => (
                  <div key={ficha.id} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-medium text-gray-900 truncate">
                          {ficha.nome}
                        </h4>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getDifficultyColor(ficha.nivelDificuldade)}`}>
                          {ficha.nivelDificuldade}
                        </span>
                      </div>
                      
                      <div className="space-y-2 text-sm text-gray-600 mb-4">
                        <p><strong>Categoria:</strong> {ficha.categoria.nome}</p>
                        <p><strong>Ingredientes:</strong> {ficha.ingredientes.length}</p>
                        {ficha.tempoPreparo && (
                          <p><strong>Tempo:</strong> {ficha.tempoPreparo} min</p>
                        )}
                        {ficha.pesoFinal && (
                          <p><strong>Peso Final:</strong> {ficha.pesoFinal}g</p>
                        )}
                        <p><strong>Versão:</strong> {ficha.versao}</p>
                      </div>

                      <div className="flex space-x-2">
                        <button
                          onClick={() => setFichaToPrint(ficha)}
                          className="flex-1 inline-flex justify-center items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          Imprimir
                        </button>
                        <Link href={`/fichas-tecnicas/${ficha.id}/editar`}>
                          <a className="flex-1 inline-flex justify-center items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            Editar
                          </a>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="hidden">
        {fichaToPrint && <FichaTecnicaPrintView ficha={fichaToPrint} ref={componentRef} />}
      </div>
    </DashboardLayout>
  )
}
