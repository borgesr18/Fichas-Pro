'use client'

import React, { useState, useEffect } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import Link from 'next/link'

interface Insumo {
  id: string
  nome: string
  categoria: {
    id: string
    nome: string
  }
  unidade: {
    id: string
    nome: string
    abreviacao: string
  }
  precoPorUnidade: number
  estoqueAtual: number
  estoqueMinimo: number
  condicaoArmazenamento: string
}

export default function InsumosPage() {
  const [insumos, setInsumos] = useState<Insumo[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchInsumos()
  }, [])

  const fetchInsumos = async () => {
    try {
      const response = await fetch('/api/insumos')
      if (response.ok) {
        const data = await response.json()
        setInsumos(data)
      }
    } catch (error) {
      console.error('Erro ao buscar insumos:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este insumo?')) {
      try {
        const response = await fetch(`/api/insumos/${id}`, {
          method: 'DELETE',
        })

        if (response.ok) {
          await fetchInsumos()
        }
      } catch (error) {
        console.error('Erro ao excluir insumo:', error)
      }
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Insumos</h1>
            <p className="mt-1 text-sm text-gray-600">
              Gerencie os insumos utilizados nas receitas
            </p>
          </div>
          <Link href="/insumos/novo">
            <a className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Novo Insumo
            </a>
          </Link>
        </div>

        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Lista de Insumos
            </h3>
            {loading ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
              </div>
            ) : insumos.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">
                Nenhum insumo cadastrado ainda.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nome
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Categoria
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Estoque
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Preço/Unidade
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Condição
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {insumos.map((insumo) => (
                      <tr key={insumo.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {insumo.nome}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {insumo.categoria.nome}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            insumo.estoqueAtual <= insumo.estoqueMinimo 
                              ? 'bg-red-100 text-red-800' 
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {insumo.estoqueAtual} {insumo.unidade.abreviacao}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          R$ {insumo.precoPorUnidade.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {insumo.condicaoArmazenamento}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <Link href={`/insumos/${insumo.id}/editar`}>
                            <a className="text-indigo-600 hover:text-indigo-900 mr-4">
                              Editar
                            </a>
                          </Link>
                          <button
                            onClick={() => handleDelete(insumo.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Excluir
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
