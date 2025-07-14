'use client'

import React, { useState, useEffect } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'

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
  fornecedor?: {
    id: string
    nome: string
  }
  estoqueAtual: number
  estoqueMinimo: number
  condicaoArmazenamento: string
  dataCompra?: Date
  createdAt: Date
  updatedAt: Date
}

export default function InsumosPage() {
  const [insumos, setInsumos] = useState<Insumo[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingInsumo, setEditingInsumo] = useState<Insumo | null>(null)
  const [categorias, setCategorias] = useState<Array<{id: string, nome: string}>>([])
  const [unidades, setUnidades] = useState<Array<{id: string, nome: string, abreviacao: string}>>([])
  const [fornecedores, setFornecedores] = useState<Array<{id: string, nome: string}>>([])
  const [formData, setFormData] = useState({
    nome: '',
    categoriaId: '',
    unidadeId: '',
    precoPorUnidade: '',
    fornecedorId: '',
    estoqueAtual: '',
    estoqueMinimo: '',
    condicaoArmazenamento: 'AMBIENTE_SECO',
    dataCompra: ''
  })
  const [error, setError] = useState('')

  useEffect(() => {
    fetchInsumos()
    fetchDependencies()
  }, [])

  const fetchDependencies = async () => {
    try {
      const [categoriasRes, unidadesRes, fornecedoresRes] = await Promise.all([
        fetch('/api/categorias-insumos'),
        fetch('/api/unidades'),
        fetch('/api/fornecedores')
      ])

      if (categoriasRes.ok) {
        const categoriasData = await categoriasRes.json()
        setCategorias(categoriasData)
      }

      if (unidadesRes.ok) {
        const unidadesData = await unidadesRes.json()
        setUnidades(unidadesData)
      }

      if (fornecedoresRes.ok) {
        const fornecedoresData = await fornecedoresRes.json()
        setFornecedores(fornecedoresData)
      }
    } catch (error) {
      console.error('Erro ao carregar dependências:', error)
    }
  }

  const fetchInsumos = async () => {
    try {
      console.log('Insumos: Fetching data from API...', new Date().toISOString())
      const response = await fetch('/api/insumos')
      
      console.log('Insumos: API response:', { 
        status: response.status, 
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries())
      })
      
      if (response.ok) {
        const data = await response.json()
        console.log('Insumos: Data loaded successfully:', { count: data.length })
        setInsumos(data)
      } else {
        const errorData = await response.text()
        console.error('Insumos: API error:', { status: response.status, error: errorData })
        
        if (response.status === 401) {
          console.error('Insumos: Authentication failed - user may need to login again')
        }
      }
    } catch (error) {
      console.error('Insumos: Network error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const url = editingInsumo ? `/api/insumos/${editingInsumo.id}` : '/api/insumos'
      const method = editingInsumo ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        await fetchInsumos()
        setShowForm(false)
        setEditingInsumo(null)
        setFormData({
          nome: '',
          categoriaId: '',
          unidadeId: '',
          precoPorUnidade: '',
          fornecedorId: '',
          estoqueAtual: '',
          estoqueMinimo: '',
          condicaoArmazenamento: 'AMBIENTE_SECO',
          dataCompra: ''
        })
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Erro ao salvar insumo')
        console.error('Erro ao salvar insumo:', errorData)
      }
    } catch (error) {
      setError('Erro de conexão')
      console.error('Erro ao salvar insumo:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (insumo: Insumo) => {
    setEditingInsumo(insumo)
    setFormData({
      nome: insumo.nome,
      categoriaId: insumo.categoria.id,
      unidadeId: insumo.unidade.id,
      precoPorUnidade: insumo.precoPorUnidade.toString(),
      fornecedorId: insumo.fornecedor?.id || '',
      estoqueAtual: insumo.estoqueAtual.toString(),
      estoqueMinimo: insumo.estoqueMinimo.toString(),
      condicaoArmazenamento: insumo.condicaoArmazenamento,
      dataCompra: insumo.dataCompra ? new Date(insumo.dataCompra).toISOString().split('T')[0] : ''
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este insumo?')) {
      try {
        const response = await fetch(`/api/insumos/${id}`, {
          method: 'DELETE',
        })

        if (response.ok) {
          await fetchInsumos()
        } else {
          const errorData = await response.json()
          setError(errorData.error || 'Erro ao excluir insumo')
        }
      } catch (error) {
        setError('Erro de conexão')
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
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Novo Insumo
          </button>
        </div>

        {showForm && (
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {editingInsumo ? 'Editar Insumo' : 'Novo Insumo'}
            </h3>
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}
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
                  <label htmlFor="categoriaId" className="block text-sm font-medium text-gray-700">
                    Categoria *
                  </label>
                  <select
                    id="categoriaId"
                    value={formData.categoriaId}
                    onChange={(e) => setFormData({ ...formData, categoriaId: e.target.value })}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    required
                  >
                    <option value="">Selecione uma categoria</option>
                    {categorias.map((categoria) => (
                      <option key={categoria.id} value={categoria.id}>
                        {categoria.nome}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="unidadeId" className="block text-sm font-medium text-gray-700">
                    Unidade *
                  </label>
                  <select
                    id="unidadeId"
                    value={formData.unidadeId}
                    onChange={(e) => setFormData({ ...formData, unidadeId: e.target.value })}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    required
                  >
                    <option value="">Selecione uma unidade</option>
                    {unidades.map((unidade) => (
                      <option key={unidade.id} value={unidade.id}>
                        {unidade.nome} ({unidade.abreviacao})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="precoPorUnidade" className="block text-sm font-medium text-gray-700">
                    Preço por Unidade *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    id="precoPorUnidade"
                    value={formData.precoPorUnidade}
                    onChange={(e) => setFormData({ ...formData, precoPorUnidade: e.target.value })}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="fornecedorId" className="block text-sm font-medium text-gray-700">
                    Fornecedor
                  </label>
                  <select
                    id="fornecedorId"
                    value={formData.fornecedorId}
                    onChange={(e) => setFormData({ ...formData, fornecedorId: e.target.value })}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value="">Selecione um fornecedor</option>
                    {fornecedores.map((fornecedor) => (
                      <option key={fornecedor.id} value={fornecedor.id}>
                        {fornecedor.nome}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="estoqueAtual" className="block text-sm font-medium text-gray-700">
                    Estoque Atual
                  </label>
                  <input
                    type="number"
                    step="0.001"
                    id="estoqueAtual"
                    value={formData.estoqueAtual}
                    onChange={(e) => setFormData({ ...formData, estoqueAtual: e.target.value })}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="estoqueMinimo" className="block text-sm font-medium text-gray-700">
                    Estoque Mínimo
                  </label>
                  <input
                    type="number"
                    step="0.001"
                    id="estoqueMinimo"
                    value={formData.estoqueMinimo}
                    onChange={(e) => setFormData({ ...formData, estoqueMinimo: e.target.value })}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="condicaoArmazenamento" className="block text-sm font-medium text-gray-700">
                    Condição de Armazenamento
                  </label>
                  <select
                    id="condicaoArmazenamento"
                    value={formData.condicaoArmazenamento}
                    onChange={(e) => setFormData({ ...formData, condicaoArmazenamento: e.target.value })}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value="AMBIENTE_SECO">Ambiente Seco</option>
                    <option value="REFRIGERADO">Refrigerado</option>
                    <option value="CONGELADO">Congelado</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="dataCompra" className="block text-sm font-medium text-gray-700">
                    Data de Compra
                  </label>
                  <input
                    type="date"
                    id="dataCompra"
                    value={formData.dataCompra}
                    onChange={(e) => setFormData({ ...formData, dataCompra: e.target.value })}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false)
                    setEditingInsumo(null)
                    setError('')
                    setFormData({
                      nome: '',
                      categoriaId: '',
                      unidadeId: '',
                      precoPorUnidade: '',
                      fornecedorId: '',
                      estoqueAtual: '',
                      estoqueMinimo: '',
                      condicaoArmazenamento: 'AMBIENTE_SECO',
                      dataCompra: ''
                    })
                  }}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {loading ? 'Salvando...' : 'Salvar'}
                </button>
              </div>
            </form>
          </div>
        )}

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
                          {insumo.estoqueAtual} {insumo.unidade.abreviacao}
                          {insumo.estoqueAtual <= insumo.estoqueMinimo && (
                            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              Baixo
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          R$ {insumo.precoPorUnidade.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleEdit(insumo)}
                            className="text-indigo-600 hover:text-indigo-900 mr-4"
                          >
                            Editar
                          </button>
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
