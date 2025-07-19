'use client'

import React, { useState, useEffect } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import Link from 'next/link'
import ConfirmationModal from '@/components/common/ConfirmationModal'
import { toast } from 'sonner'

interface Fornecedor {
  id: string
  nome: string
  contato?: string
  telefone?: string
  email?: string
}

export default function FornecedoresPage() {
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [fornecedorToDelete, setFornecedorToDelete] = useState<string | null>(null)

  useEffect(() => {
    fetchFornecedores()
  }, [])

  const fetchFornecedores = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/fornecedores')
      if (response.ok) {
        const data = await response.json()
        setFornecedores(data)
      } else {
        toast.error('Falha ao carregar fornecedores.')
      }
    } catch {
      toast.error('Erro ao conectar com o servidor.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!fornecedorToDelete) return

    try {
      const response = await fetch(`/api/fornecedores/${fornecedorToDelete}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success('Fornecedor excluído com sucesso!')
        await fetchFornecedores()
      } else {
        const errorData = await response.json()
        toast.error(`Falha ao excluir fornecedor: ${errorData.message}`)
      }
    } catch {
      toast.error('Erro ao conectar com o servidor.')
    } finally {
      setFornecedorToDelete(null)
    }
  }

  const openConfirmationModal = (id: string) => {
    setFornecedorToDelete(id)
    setIsModalOpen(true)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Fornecedores</h1>
            <p className="mt-1 text-sm text-gray-600">
              Gerencie os fornecedores de insumos
            </p>
          </div>
          <Link href="/fornecedores/novo">
            <a className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Novo Fornecedor
            </a>
          </Link>
        </div>

        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Lista de Fornecedores
            </h3>
            {isLoading ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
              </div>
            ) : fornecedores.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">
                Nenhum fornecedor cadastrado ainda.
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
                        Contato
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Telefone
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {fornecedores.map((fornecedor) => (
                      <tr key={fornecedor.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {fornecedor.nome}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {fornecedor.contato || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {fornecedor.telefone || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {fornecedor.email || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <Link href={`/fornecedores/${fornecedor.id}/editar`}>
                            <a className="text-indigo-600 hover:text-indigo-900 mr-4">
                              Editar
                            </a>
                          </Link>
                          <button
                            onClick={() => openConfirmationModal(fornecedor.id)}
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
      <ConfirmationModal
        open={isModalOpen}
        setOpen={setIsModalOpen}
        onConfirm={handleDelete}
        title="Confirmar Exclusão"
        message="Tem certeza que deseja excluir este fornecedor? Esta ação não pode ser desfeita."
      />
    </DashboardLayout>
  )
}
