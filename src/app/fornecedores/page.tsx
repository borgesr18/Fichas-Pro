'use client'

import React, { useState, useEffect } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import Link from 'next/link'
import ConfirmationModal from '@/components/common/ConfirmationModal'
import { toast } from 'sonner'
import { Plus, Edit, Trash2 } from 'lucide-react'

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
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-secondary-900">Fornecedores</h1>
            <p className="mt-1 text-secondary-600">
              Gerencie seus fornecedores de insumos.
            </p>
          </div>
          <Link href="/fornecedores/novo">
            <a className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
              <Plus className="h-5 w-5 mr-2" />
              Novo Fornecedor
            </a>
          </Link>
        </div>

        <div className="bg-white shadow-sm rounded-lg border border-secondary-200">
          <div className="p-6">
            {isLoading ? (
              <div className="text-center py-10">
                <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-primary-600 mx-auto"></div>
              </div>
            ) : fornecedores.length === 0 ? (
              <div className="text-center py-10">
                <h3 className="text-lg font-medium text-secondary-900">Nenhum fornecedor encontrado</h3>
                <p className="text-sm text-secondary-500 mt-1">Comece cadastrando um novo fornecedor.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-secondary-200">
                  <thead className="bg-secondary-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-secondary-500 uppercase tracking-wider">
                        Nome
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-secondary-500 uppercase tracking-wider">
                        Contato
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-secondary-500 uppercase tracking-wider">
                        Telefone
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-secondary-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-semibold text-secondary-500 uppercase tracking-wider">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-secondary-200">
                    {fornecedores.map((fornecedor) => (
                      <tr key={fornecedor.id} className="hover:bg-secondary-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-secondary-900">
                          {fornecedor.nome}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-600">
                          {fornecedor.contato || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-600">
                          {fornecedor.telefone || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-600">
                          {fornecedor.email || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right space-x-2">
                          <Link href={`/fornecedores/${fornecedor.id}/editar`}>
                            <a className="text-primary-600 hover:text-primary-800 p-2 rounded-md hover:bg-primary-100">
                              <Edit className="h-4 w-4" />
                            </a>
                          </Link>
                          <button
                            onClick={() => openConfirmationModal(fornecedor.id)}
                            className="text-danger-600 hover:text-danger-800 p-2 rounded-md hover:bg-danger-100"
                          >
                            <Trash2 className="h-4 w-4" />
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
