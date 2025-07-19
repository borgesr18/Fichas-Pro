'use client'

import React from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { ArrowRight, FileText, Package, Truck } from 'lucide-react'
import Link from 'next/link'

const StatCard = ({ icon, title, value, color }: { icon: React.ReactNode, title: string, value: string | number, color: string }) => (
  <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-secondary-200">
    <div className="p-5">
      <div className="flex items-center">
        <div className={`flex-shrink-0 w-12 h-12 ${color} rounded-md flex items-center justify-center`}>
          {icon}
        </div>
        <div className="ml-5 w-0 flex-1">
          <dl>
            <dt className="text-sm font-medium text-secondary-500 truncate">
              {title}
            </dt>
            <dd className="text-2xl font-bold text-secondary-900">{value}</dd>
          </dl>
        </div>
      </div>
    </div>
  </div>
)

const QuickActionButton = ({ href, children }: { href: string, children: React.ReactNode }) => (
  <Link href={href}>
    <a className="group flex items-center justify-between p-4 bg-white rounded-lg shadow-sm hover:bg-secondary-50 transition-all border border-secondary-200 hover:border-primary-300">
      <span className="font-semibold text-secondary-800">{children}</span>
      <ArrowRight className="h-5 w-5 text-secondary-400 group-hover:text-primary-600 transition-colors" />
    </a>
  </Link>
)

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900">Dashboard</h1>
          <p className="mt-1 text-secondary-600">
            Bem-vindo ao seu painel de gestão de fichas técnicas.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard icon={<FileText className="h-6 w-6 text-white" />} title="Fichas Técnicas" value={0} color="bg-primary-500" />
          <StatCard icon={<Package className="h-6 w-6 text-white" />} title="Insumos" value={0} color="bg-success-500" />
          <StatCard icon={<Truck className="h-6 w-6 text-white" />} title="Fornecedores" value={0} color="bg-orange-500" />
        </div>

        <div className="space-y-4">
            <h2 className="text-xl font-bold text-secondary-800">Ações Rápidas</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <QuickActionButton href="/fichas-tecnicas/novo">
                Nova Ficha Técnica
              </QuickActionButton>
              <QuickActionButton href="/insumos/novo">
                Cadastrar Insumo
              </QuickActionButton>
              <QuickActionButton href="/fornecedores/novo">
                Novo Fornecedor
              </QuickActionButton>
            </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
