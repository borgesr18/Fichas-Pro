'use client'

import React, { useState, useEffect } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'

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
  updatedAt: Date
}

export default function FichasTecnicasPage() {
  const [fichas, setFichas] = useState<FichaTecnica[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingFicha, setEditingFicha] = useState<FichaTecnica | null>(null)
  const [categorias, setCategorias] = useState<Array<{id: string, nome: string}>>([])
  const [insumos, setInsumos] = useState<Array<{id: string, nome: string, unidade: {nome: string, abreviacao: string}}>>([])
  const [formData, setFormData] = useState({
    nome: '',
    categoriaId: '',
    tempoPreparo: '',
    temperaturaForno: '',
    modoPreparo: '',
    pesoFinal: '',
    observacoes: '',
    nivelDificuldade: 'BASICO'
  })
  const [ingredientes, setIngredientes] = useState<Array<{insumoId: string, quantidade: string, porcentagemPadeiro: string}>>([])
  const [error, setError] = useState('')

  useEffect(() => {
    fetchFichas()
    fetchDependencies()
  }, [])

  const fetchDependencies = async () => {
    try {
      const [categoriasRes, insumosRes] = await Promise.all([
        fetch('/api/categorias-receitas'),
        fetch('/api/insumos')
      ])

      if (categoriasRes.ok) {
        const categoriasData = await categoriasRes.json()
        setCategorias(categoriasData)
      }

      if (insumosRes.ok) {
        const insumosData = await insumosRes.json()
        setInsumos(insumosData)
      }
    } catch (error) {
      console.error('Erro ao carregar dependências:', error)
    }
  }

  const fetchFichas = async () => {
    try {
      console.log('Fichas Técnicas: Fetching data from API...', new Date().toISOString())
      const response = await fetch('/api/fichas-tecnicas')
      
      console.log('Fichas Técnicas: API response:', { 
        status: response.status, 
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries())
      })
      
      if (response.ok) {
        const data = await response.json()
        console.log('Fichas Técnicas: Data loaded successfully:', { count: data.length })
        setFichas(data)
      } else {
        const errorData = await response.text()
        console.error('Fichas Técnicas: API error:', { status: response.status, error: errorData })
        
        if (response.status === 401) {
          console.error('Fichas Técnicas: Authentication failed - user may need to login again')
        }
      }
    } catch (error) {
      console.error('Fichas Técnicas: Network error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const url = editingFicha ? `/api/fichas-tecnicas/${editingFicha.id}` : '/api/fichas-tecnicas'
      const method = editingFicha ? 'PUT' : 'POST'

      const payload = {
        ...formData,
        ingredientes: ingredientes.filter(ing => ing.insumoId && ing.quantidade)
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        await fetchFichas()
        setShowForm(false)
        setEditingFicha(null)
        setFormData({
          nome: '',
          categoriaId: '',
          tempoPreparo: '',
          temperaturaForno: '',
          modoPreparo: '',
          pesoFinal: '',
          observacoes: '',
          nivelDificuldade: 'BASICO'
        })
        setIngredientes([])
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Erro ao salvar ficha técnica')
        console.error('Erro ao salvar ficha técnica:', errorData)
      }
    } catch (error) {
      setError('Erro de conexão')
      console.error('Erro ao salvar ficha técnica:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (ficha: FichaTecnica) => {
    setEditingFicha(ficha)
    setFormData({
      nome: ficha.nome,
      categoriaId: ficha.categoria.id,
      tempoPreparo: ficha.tempoPreparo?.toString() || '',
      temperaturaForno: ficha.temperaturaForno?.toString() || '',
      modoPreparo: ficha.modoPreparo,
      pesoFinal: ficha.pesoFinal?.toString() || '',
      observacoes: ficha.observacoesTecnicas || '',
      nivelDificuldade: ficha.nivelDificuldade
    })
    setIngredientes(ficha.ingredientes.map(ing => ({
      insumoId: ing.insumo.id,
      quantidade: ing.quantidade.toString(),
      porcentagemPadeiro: ing.porcentagemPadeiro?.toString() || ''
    })))
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta ficha técnica?')) {
      try {
        const response = await fetch(`/api/fichas-tecnicas/${id}`, {
          method: 'DELETE',
        })

        if (response.ok) {
          await fetchFichas()
        } else {
          const errorData = await response.json()
          setError(errorData.error || 'Erro ao excluir ficha técnica')
        }
      } catch (error) {
        setError('Erro de conexão')
        console.error('Erro ao excluir ficha técnica:', error)
      }
    }
  }

  const addIngrediente = () => {
    setIngredientes([...ingredientes, { insumoId: '', quantidade: '', porcentagemPadeiro: '' }])
  }

  const removeIngrediente = (index: number) => {
    setIngredientes(ingredientes.filter((_, i) => i !== index))
  }

  const updateIngrediente = (index: number, field: string, value: string) => {
    const updated = [...ingredientes]
    updated[index] = { ...updated[index], [field]: value }
    setIngredientes(updated)
  }

  const handlePrint = (ficha: FichaTecnica) => {
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Ficha Técnica - ${ficha.nome}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px; }
            .ingredients { margin-bottom: 30px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            .instructions { margin-bottom: 20px; }
            @media print { body { margin: 0; } }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${ficha.nome}</h1>
            <p>Categoria: ${ficha.categoria.nome} | Versão: ${ficha.versao}</p>
          </div>
          
          <div class="info-grid">
            <div>
              <strong>Tempo de Preparo:</strong> ${ficha.tempoPreparo || 'N/A'} min<br>
              <strong>Temperatura do Forno:</strong> ${ficha.temperaturaForno || 'N/A'}°C<br>
              <strong>Nível de Dificuldade:</strong> ${ficha.nivelDificuldade}
            </div>
            <div>
              <strong>Peso Final:</strong> ${ficha.pesoFinal || 'N/A'}g<br>
              <strong>Data de Criação:</strong> ${new Date(ficha.createdAt).toLocaleDateString('pt-BR')}
            </div>
          </div>

          <div class="ingredients">
            <h3>Ingredientes</h3>
            <table>
              <thead>
                <tr>
                  <th>Ingrediente</th>
                  <th>Quantidade</th>
                  <th>Unidade</th>
                  <th>% Padeiro</th>
                </tr>
              </thead>
              <tbody>
                ${ficha.ingredientes.map(ing => `
                  <tr>
                    <td>${ing.insumo.nome}</td>
                    <td>${ing.quantidade}</td>
                    <td>${ing.insumo.unidade.abreviacao}</td>
                    <td>${ing.porcentagemPadeiro || '-'}%</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          <div class="instructions">
            <h3>Modo de Preparo</h3>
            <p>${ficha.modoPreparo.replace(/\n/g, '<br>')}</p>
          </div>

          ${ficha.observacoesTecnicas ? `
            <div class="observations">
              <h3>Observações Técnicas</h3>
              <p>${ficha.observacoesTecnicas.replace(/\n/g, '<br>')}</p>
            </div>
          ` : ''}
        </body>
        </html>
      `)
      printWindow.document.close()
      printWindow.print()
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
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Nova Ficha Técnica
          </button>
        </div>

        {showForm && (
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {editingFicha ? 'Editar Ficha Técnica' : 'Nova Ficha Técnica'}
            </h3>
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
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
                  <label htmlFor="tempoPreparo" className="block text-sm font-medium text-gray-700">
                    Tempo de Preparo (min)
                  </label>
                  <input
                    type="number"
                    id="tempoPreparo"
                    value={formData.tempoPreparo}
                    onChange={(e) => setFormData({ ...formData, tempoPreparo: e.target.value })}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="temperaturaForno" className="block text-sm font-medium text-gray-700">
                    Temperatura do Forno (°C)
                  </label>
                  <input
                    type="number"
                    id="temperaturaForno"
                    value={formData.temperaturaForno}
                    onChange={(e) => setFormData({ ...formData, temperaturaForno: e.target.value })}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="pesoFinal" className="block text-sm font-medium text-gray-700">
                    Peso Final (g)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    id="pesoFinal"
                    value={formData.pesoFinal}
                    onChange={(e) => setFormData({ ...formData, pesoFinal: e.target.value })}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="nivelDificuldade" className="block text-sm font-medium text-gray-700">
                    Nível de Dificuldade
                  </label>
                  <select
                    id="nivelDificuldade"
                    value={formData.nivelDificuldade}
                    onChange={(e) => setFormData({ ...formData, nivelDificuldade: e.target.value })}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value="BASICO">Básico</option>
                    <option value="INTERMEDIARIO">Intermediário</option>
                    <option value="AVANCADO">Avançado</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label htmlFor="modoPreparo" className="block text-sm font-medium text-gray-700">
                  Modo de Preparo *
                </label>
                <textarea
                  id="modoPreparo"
                  value={formData.modoPreparo}
                  onChange={(e) => setFormData({ ...formData, modoPreparo: e.target.value })}
                  rows={4}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                />
              </div>

              <div>
                <label htmlFor="observacoes" className="block text-sm font-medium text-gray-700">
                  Observações
                </label>
                <textarea
                  id="observacoes"
                  value={formData.observacoes}
                  onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                  rows={3}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-md font-medium text-gray-900">Ingredientes</h4>
                  <button
                    type="button"
                    onClick={addIngrediente}
                    className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-indigo-100 hover:bg-indigo-200"
                  >
                    Adicionar Ingrediente
                  </button>
                </div>
                
                {ingredientes.map((ingrediente, index) => (
                  <div key={index} className="grid grid-cols-1 gap-4 sm:grid-cols-4 mb-4 p-4 border border-gray-200 rounded-md">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Insumo
                      </label>
                      <select
                        value={ingrediente.insumoId}
                        onChange={(e) => updateIngrediente(index, 'insumoId', e.target.value)}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      >
                        <option value="">Selecione um insumo</option>
                        {insumos.map((insumo) => (
                          <option key={insumo.id} value={insumo.id}>
                            {insumo.nome} ({insumo.unidade.abreviacao})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Quantidade
                      </label>
                      <input
                        type="number"
                        step="0.001"
                        value={ingrediente.quantidade}
                        onChange={(e) => updateIngrediente(index, 'quantidade', e.target.value)}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        % Padeiro
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={ingrediente.porcentagemPadeiro}
                        onChange={(e) => updateIngrediente(index, 'porcentagemPadeiro', e.target.value)}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
                    <div className="flex items-end">
                      <button
                        type="button"
                        onClick={() => removeIngrediente(index)}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-red-600 bg-red-100 hover:bg-red-200"
                      >
                        Remover
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false)
                    setEditingFicha(null)
                    setError('')
                    setFormData({
                      nome: '',
                      categoriaId: '',
                      tempoPreparo: '',
                      temperaturaForno: '',
                      modoPreparo: '',
                      pesoFinal: '',
                      observacoes: '',
                      nivelDificuldade: 'BASICO'
                    })
                    setIngredientes([])
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
                          onClick={() => handlePrint(ficha)}
                          className="flex-1 inline-flex justify-center items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          Imprimir
                        </button>
                        <button 
                          onClick={() => handleEdit(ficha)}
                          className="flex-1 inline-flex justify-center items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          Editar
                        </button>
                        <button 
                          onClick={() => handleDelete(ficha.id)}
                          className="flex-1 inline-flex justify-center items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          Excluir
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
