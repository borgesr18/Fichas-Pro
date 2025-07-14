'use client'

import React, { useState } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'

export default function ConfiguracoesPage() {
  const [activeTab, setActiveTab] = useState('categorias-receitas')

  const tabs = [
    { id: 'categorias-receitas', name: 'Categorias de Receitas' },
    { id: 'categorias-insumos', name: 'Categorias de Insumos' },
    { id: 'unidades-medida', name: 'Unidades de Medida' },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Configurações</h1>
          <p className="mt-1 text-sm text-gray-600">
            Gerencie as configurações básicas do sistema
          </p>
        </div>

        <div className="bg-white shadow rounded-lg">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`${
                    activeTab === tab.id
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm`}
                >
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'categorias-receitas' && <CategoriasReceitas />}
            {activeTab === 'categorias-insumos' && <CategoriasInsumos />}
            {activeTab === 'unidades-medida' && <UnidadesMedida />}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

function CategoriasReceitas() {
  const [nome, setNome] = useState('')
  const [descricao, setDescricao] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      console.log('Criar categoria de receita:', { nome, descricao })
      setNome('')
      setDescricao('')
    } catch (error) {
      console.error('Erro ao criar categoria:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="nome" className="block text-sm font-medium text-gray-700">
            Nome da Categoria
          </label>
          <input
            type="text"
            id="nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </div>
        <div>
          <label htmlFor="descricao" className="block text-sm font-medium text-gray-700">
            Descrição
          </label>
          <textarea
            id="descricao"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            rows={3}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {loading ? 'Salvando...' : 'Adicionar Categoria'}
        </button>
      </form>

      <div className="mt-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Categorias Existentes</h3>
        <div className="bg-gray-50 rounded-md p-4">
          <p className="text-sm text-gray-500">Nenhuma categoria cadastrada ainda.</p>
        </div>
      </div>
    </div>
  )
}

function CategoriasInsumos() {
  return (
    <div className="space-y-6">
      <p className="text-sm text-gray-500">Configuração de categorias de insumos em desenvolvimento...</p>
    </div>
  )
}

function UnidadesMedida() {
  return (
    <div className="space-y-6">
      <p className="text-sm text-gray-500">Configuração de unidades de medida em desenvolvimento...</p>
    </div>
  )
}
