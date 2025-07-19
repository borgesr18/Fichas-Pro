'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import DashboardLayout from '@/components/layout/DashboardLayout'
import Link from 'next/link'
import { toast } from 'sonner'

interface Fornecedor {
  id: string
  nome: string
  contato?: string
  telefone?: string
  email?: string
  endereco?: string
}

export default function EditarFornecedorPage() {
  const [formData, setFormData] = useState({
    nome: '',
    contato: '',
    telefone: '',
    email: '',
    endereco: ''
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { id } = useParams()

  const fetchFornecedor = useCallback(async () => {
    try {
      const response = await fetch(`/api/fornecedores/${id}`)
      if (response.ok) {
        const data: Fornecedor = await response.json()
        setFormData({
          nome: data.nome,
          contato: data.contato || '',
          telefone: data.telefone || '',
          email: data.email || '',
          endereco: data.endereco || ''
        })
      } else {
        toast.error('Fornecedor não encontrado.')
        router.push('/fornecedores')
      }
    } catch {
      toast.error('Erro ao buscar dados do fornecedor.')
    } finally {
      setIsLoading(false)
    }
  }, [id, router])

  useEffect(() => {
    if (id) {
      fetchFornecedor()
    }
  }, [id, fetchFornecedor])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    const promise = new Promise(async (resolve, reject) => {
      try {
        const response = await fetch(`/api/fornecedores/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        })

        if (response.ok) {
          router.push('/fornecedores')
          resolve(response)
        } else {
          reject(new Error('Falha ao atualizar fornecedor'))
        }
      } catch (error) {
        reject(error)
      } finally {
        setIsSubmitting(false)
      }
    })

    toast.promise(promise, {
      loading: 'Atualizando fornecedor...',
      success: 'Fornecedor atualizado com sucesso!',
      error: 'Erro ao atualizar fornecedor.',
    })
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Editar Fornecedor</h1>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="nome" className="block text-sm font-medium text-gray-700">
                  Nome *
                </label>
                <input
                  type="text"
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                />
              </div>
              <div>
                <label htmlFor="contato" className="block text-sm font-medium text-gray-700">
                  Contato
                </label>
                <input
                  type="text"
                  id="contato"
                  value={formData.contato}
                  onChange={(e) => setFormData({ ...formData, contato: e.target.value })}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="telefone" className="block text-sm font-medium text-gray-700">
                  Telefone
                </label>
                <input
                  type="tel"
                  id="telefone"
                  value={formData.telefone}
                  onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>
            <div>
              <label htmlFor="endereco" className="block text-sm font-medium text-gray-700">
                Endereço
              </label>
              <textarea
                id="endereco"
                value={formData.endereco}
                onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
                rows={3}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div className="flex justify-end space-x-3">
              <Link href="/fornecedores">
                <a className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  Cancelar
                </a>
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  )
}
