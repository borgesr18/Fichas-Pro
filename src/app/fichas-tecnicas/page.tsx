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
  const [, setShowForm] = useState(false)

  useEffect(() => {
    fetchFichas()
  }, [])

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
                        <button className="flex-1 inline-flex justify-center items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                          Editar
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
