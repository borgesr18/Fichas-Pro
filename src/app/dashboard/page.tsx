'use client'

import React, { useState, useEffect } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'

export default function DashboardPage() {
  const [fichasCount, setFichasCount] = useState(0)
  const [insumosCount, setInsumosCount] = useState(0)
  const [fornecedoresCount, setFornecedoresCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      console.log('Dashboard: Fetching data from APIs...', new Date().toISOString())
      
      const [fichasResponse, insumosResponse, fornecedoresResponse] = await Promise.all([
        fetch('/api/fichas-tecnicas'),
        fetch('/api/insumos'),
        fetch('/api/fornecedores')
      ])

      console.log('Dashboard: API responses:', {
        fichas: { status: fichasResponse.status, statusText: fichasResponse.statusText },
        insumos: { status: insumosResponse.status, statusText: insumosResponse.statusText },
        fornecedores: { status: fornecedoresResponse.status, statusText: fornecedoresResponse.statusText }
      })

      if (fichasResponse.ok) {
        const fichasData = await fichasResponse.json()
        console.log('Dashboard: Fichas data loaded:', { count: fichasData.length })
        setFichasCount(fichasData.length)
      } else {
        console.error('Dashboard: Fichas API error:', { status: fichasResponse.status })
        if (fichasResponse.status === 401) {
          console.error('Dashboard: Authentication failed for fichas - user may need to login again')
        }
      }

      if (insumosResponse.ok) {
        const insumosData = await insumosResponse.json()
        console.log('Dashboard: Insumos data loaded:', { count: insumosData.length })
        setInsumosCount(insumosData.length)
      } else {
        console.error('Dashboard: Insumos API error:', { status: insumosResponse.status })
        if (insumosResponse.status === 401) {
          console.error('Dashboard: Authentication failed for insumos - user may need to login again')
        }
      }

      if (fornecedoresResponse.ok) {
        const fornecedoresData = await fornecedoresResponse.json()
        console.log('Dashboard: Fornecedores data loaded:', { count: fornecedoresData.length })
        setFornecedoresCount(fornecedoresData.length)
      } else {
        console.error('Dashboard: Fornecedores API error:', { status: fornecedoresResponse.status })
        if (fornecedoresResponse.status === 401) {
          console.error('Dashboard: Authentication failed for fornecedores - user may need to login again')
        }
      }

    } catch (error) {
      console.error('Dashboard: Network error:', error)
    } finally {
      setLoading(false)
    }
  }
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-600">
            Bem-vindo ao Sistema de Gestão de Fichas Técnicas
          </p>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-2 text-sm text-gray-600">Carregando dados do dashboard...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-indigo-500 rounded-md flex items-center justify-center">
                      <span className="text-white text-sm font-medium">FT</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Fichas Técnicas
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">{fichasCount}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                      <span className="text-white text-sm font-medium">IN</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Insumos
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">{insumosCount}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                      <span className="text-white text-sm font-medium">FO</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Fornecedores
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">{fornecedoresCount}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Ações Rápidas
            </h3>
            <div className="mt-5">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Nova Ficha Técnica
                </button>
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Cadastrar Insumo
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
