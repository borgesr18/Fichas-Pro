'use client'

import React from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { ArrowRight, FileText, Package, Truck, TrendingUp, Clock, Users } from 'lucide-react'
import { ChefHatIcon, CubeIcon, TruckIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

const StatCard = ({ 
  icon, 
  title, 
  value, 
  change, 
  changeType, 
  color 
}: { 
  icon: React.ReactNode
  title: string
  value: string | number
  change?: string
  changeType?: 'positive' | 'negative' | 'neutral'
  color: string 
}) => (
  <div className="card card-hover p-6 relative overflow-hidden">
    {/* Background decoration */}
    <div className={`absolute top-0 right-0 w-20 h-20 ${color} opacity-10 rounded-full -mr-10 -mt-10`}></div>
    
    <div className="relative">
      <div className="flex items-center justify-between">
        <div className={`flex-shrink-0 w-12 h-12 ${color} rounded-xl flex items-center justify-center shadow-lg`}>
          {icon}
        </div>
        {change && (
          <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
            changeType === 'positive' ? 'bg-success-100 text-success-700' :
            changeType === 'negative' ? 'bg-danger-100 text-danger-700' :
            'bg-secondary-100 text-secondary-700'
          }`}>
            <TrendingUp className="h-3 w-3" />
            <span>{change}</span>
          </div>
        )}
      </div>
      
      <div className="mt-4">
        <h3 className="text-sm font-medium text-secondary-600 mb-1">{title}</h3>
        <p className="text-3xl font-bold text-secondary-900">{value}</p>
      </div>
    </div>
  </div>
)

const QuickActionCard = ({ 
  href, 
  icon, 
  title, 
  description, 
  color 
}: { 
  href: string
  icon: React.ReactNode
  title: string
  description: string
  color: string
}) => (
  <Link href={href}>
    <div className="card card-hover p-6 group cursor-pointer">
      <div className="flex items-start space-x-4">
        <div className={`flex-shrink-0 w-12 h-12 ${color} rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-200`}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-secondary-900 group-hover:text-primary-600 transition-colors duration-200">
            {title}
          </h3>
          <p className="text-sm text-secondary-600 mt-1">
            {description}
          </p>
        </div>
        <ArrowRight className="h-5 w-5 text-secondary-400 group-hover:text-primary-500 group-hover:translate-x-1 transition-all duration-200" />
      </div>
    </div>
  </Link>
)

const RecentActivityItem = ({ 
  icon, 
  title, 
  time, 
  color 
}: { 
  icon: React.ReactNode
  title: string
  time: string
  color: string
}) => (
  <div className="flex items-center space-x-3 p-3 hover:bg-secondary-50 rounded-lg transition-colors duration-200">
    <div className={`flex-shrink-0 w-8 h-8 ${color} rounded-lg flex items-center justify-center`}>
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-medium text-secondary-900 truncate">{title}</p>
      <p className="text-xs text-secondary-500">{time}</p>
    </div>
  </div>
)

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-secondary-900">Dashboard</h1>
            <p className="mt-2 text-secondary-600">
              Bem-vindo ao seu painel de gestão culinária. Aqui você tem uma visão geral do seu negócio.
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <div className="flex items-center space-x-2 text-sm text-secondary-500">
              <Clock className="h-4 w-4" />
              <span>Última atualização: agora</span>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard 
            icon={<ChefHatIcon className="h-6 w-6 text-white" />} 
            title="Fichas Técnicas" 
            value={12} 
            change="+3 este mês"
            changeType="positive"
            color="bg-gradient-primary" 
          />
          <StatCard 
            icon={<CubeIcon className="h-6 w-6 text-white" />} 
            title="Insumos Ativos" 
            value={48} 
            change="+8 novos"
            changeType="positive"
            color="bg-success-500" 
          />
          <StatCard 
            icon={<TruckIcon className="h-6 w-6 text-white" />} 
            title="Fornecedores" 
            value={7} 
            change="2 pendentes"
            changeType="neutral"
            color="bg-info-500" 
          />
          <StatCard 
            icon={<Users className="h-6 w-6 text-white" />} 
            title="Usuários Ativos" 
            value={3} 
            color="bg-warning-500" 
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-secondary-900">Ações Rápidas</h2>
              <div className="w-12 h-1 bg-gradient-primary rounded-full"></div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <QuickActionCard
                href="/fichas-tecnicas/novo"
                icon={<ChefHatIcon className="h-6 w-6 text-white" />}
                title="Nova Ficha Técnica"
                description="Criar uma nova receita com ingredientes e modo de preparo"
                color="bg-gradient-primary"
              />
              <QuickActionCard
                href="/insumos/novo"
                icon={<Package className="h-6 w-6 text-white" />}
                title="Cadastrar Insumo"
                description="Adicionar novo ingrediente ao estoque"
                color="bg-success-500"
              />
              <QuickActionCard
                href="/fornecedores/novo"
                icon={<Truck className="h-6 w-6 text-white" />}
                title="Novo Fornecedor"
                description="Cadastrar fornecedor de ingredientes"
                color="bg-info-500"
              />
              <QuickActionCard
                href="/fichas-tecnicas"
                icon={<FileText className="h-6 w-6 text-white" />}
                title="Ver Todas as Fichas"
                description="Gerenciar suas fichas técnicas existentes"
                color="bg-warning-500"
              />
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-secondary-900">Atividade Recente</h2>
              <div className="w-12 h-1 bg-gradient-primary rounded-full"></div>
            </div>
            
            <div className="card p-6">
              <div className="space-y-1">
                <RecentActivityItem
                  icon={<ChefHatIcon className="h-4 w-4 text-white" />}
                  title="Ficha 'Pão Francês' criada"
                  time="2 horas atrás"
                  color="bg-gradient-primary"
                />
                <RecentActivityItem
                  icon={<Package className="h-4 w-4 text-white" />}
                  title="Estoque de farinha atualizado"
                  time="4 horas atrás"
                  color="bg-success-500"
                />
                <RecentActivityItem
                  icon={<Truck className="h-4 w-4 text-white" />}
                  title="Fornecedor 'Moinho Sul' adicionado"
                  time="1 dia atrás"
                  color="bg-info-500"
                />
                <RecentActivityItem
                  icon={<FileText className="h-4 w-4 text-white" />}
                  title="Relatório mensal gerado"
                  time="2 dias atrás"
                  color="bg-warning-500"
                />
              </div>
              
              <div className="mt-4 pt-4 border-t border-secondary-200">
                <Link href="/atividades" className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center space-x-1 transition-colors duration-200">
                  <span>Ver todas as atividades</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
