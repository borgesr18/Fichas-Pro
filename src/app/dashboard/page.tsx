'use client'

import React from 'react'
import { 
  ChartBarIcon, 
  DocumentTextIcon, 
  CubeIcon,
  TruckIcon,
  PlusIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  EyeIcon,
  PrinterIcon,
  ClockIcon
} from '@heroicons/react/24/outline'
import { 
  ChefHat, 
  TrendingUp, 
  DollarSign, 
  Package, 
  Users, 
  Activity,
  Calendar,
  Star,
  Zap,
  Target
} from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

const stats = [
  {
    name: 'Fichas Técnicas',
    value: '24',
    change: '+12%',
    changeType: 'positive',
    icon: ChefHat,
    gradient: 'from-blue-500 to-purple-600',
    description: 'Receitas cadastradas'
  },
  {
    name: 'Insumos Ativos',
    value: '156',
    change: '+8%',
    changeType: 'positive',
    icon: Package,
    gradient: 'from-green-500 to-emerald-600',
    description: 'Produtos em estoque'
  },
  {
    name: 'Fornecedores',
    value: '12',
    change: '+2',
    changeType: 'positive',
    icon: Users,
    gradient: 'from-purple-500 to-pink-600',
    description: 'Parceiros ativos'
  },
  {
    name: 'Custo Médio',
    value: 'R$ 45,80',
    change: '-5%',
    changeType: 'positive',
    icon: DollarSign,
    gradient: 'from-orange-500 to-red-500',
    description: 'Por porção'
  },
]

const quickActions = [
  {
    name: 'Nova Ficha Técnica',
    description: 'Criar uma nova receita',
    href: '/fichas-tecnicas/nova',
    icon: ChefHat,
    gradient: 'from-blue-500 to-purple-600',
    color: 'text-blue-400'
  },
  {
    name: 'Cadastrar Insumo',
    description: 'Adicionar novo produto',
    href: '/insumos/novo',
    icon: Package,
    gradient: 'from-green-500 to-emerald-600',
    color: 'text-green-400'
  },
  {
    name: 'Novo Fornecedor',
    description: 'Registrar parceiro',
    href: '/fornecedores/novo',
    icon: Users,
    gradient: 'from-purple-500 to-pink-600',
    color: 'text-purple-400'
  },
  {
    name: 'Imprimir Fichas',
    description: 'Gerar relatórios',
    href: '/impressao',
    icon: PrinterIcon,
    gradient: 'from-cyan-500 to-blue-600',
    color: 'text-cyan-400'
  },
]

const recentActivity = [
  {
    id: 1,
    type: 'ficha',
    title: 'Bolo de Chocolate Premium',
    description: 'Ficha técnica criada',
    time: '2 minutos atrás',
    icon: ChefHat,
    color: 'text-blue-400',
    bg: 'bg-blue-500/10'
  },
  {
    id: 2,
    type: 'insumo',
    title: 'Farinha de Trigo Especial',
    description: 'Insumo atualizado',
    time: '15 minutos atrás',
    icon: Package,
    color: 'text-green-400',
    bg: 'bg-green-500/10'
  },
  {
    id: 3,
    type: 'fornecedor',
    title: 'Distribuidora São Paulo',
    description: 'Novo fornecedor cadastrado',
    time: '1 hora atrás',
    icon: Users,
    color: 'text-purple-400',
    bg: 'bg-purple-500/10'
  },
  {
    id: 4,
    type: 'impressao',
    title: 'Relatório Mensal',
    description: 'Fichas impressas com sucesso',
    time: '2 horas atrás',
    icon: PrinterIcon,
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10'
  },
]

export default function Dashboard() {
  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary mb-2">
            Dashboard
          </h1>
          <p className="text-text-muted">
            Bem-vindo ao sistema de gestão culinária
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-3">
          <div className="flex items-center space-x-2 text-sm text-text-muted">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
            <span>Sistema Online</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-text-muted">
            <Calendar className="h-4 w-4" />
            <span>{new Date().toLocaleDateString('pt-BR')}</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <div
            key={stat.name}
            className="modern-card group cursor-pointer"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-text-muted mb-1">
                  {stat.name}
                </p>
                <p className="text-2xl font-bold text-text-primary mb-1">
                  {stat.value}
                </p>
                <p className="text-xs text-text-muted">
                  {stat.description}
                </p>
              </div>
              <div className={cn(
                'w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br',
                stat.gradient,
                'shadow-lg group-hover:scale-110 transition-transform duration-200'
              )}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
            
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {stat.changeType === 'positive' ? (
                  <ArrowTrendingUpIcon className="h-4 w-4 text-success" />
                ) : (
                  <ArrowTrendingDownIcon className="h-4 w-4 text-error" />
                )}
                <span className={cn(
                  'text-sm font-medium',
                  stat.changeType === 'positive' ? 'text-success' : 'text-error'
                )}>
                  {stat.change}
                </span>
              </div>
              <div className="w-16 h-1 bg-background-surface rounded-full overflow-hidden">
                <div className={cn(
                  'h-full bg-gradient-to-r rounded-full',
                  stat.gradient
                )} style={{ width: '70%' }}></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-text-primary">Ações Rápidas</h2>
          <div className="w-12 h-1 bg-primary rounded-full"></div>
        </div>
        
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action, index) => (
            <Link
              key={action.name}
              href={action.href}
              className="modern-card group hover:scale-105 transition-all duration-300"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className={cn(
                  'w-16 h-16 rounded-2xl flex items-center justify-center bg-gradient-to-br',
                  action.gradient,
                  'shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300'
                )}>
                  <action.icon className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-text-primary mb-1">
                    {action.name}
                  </h3>
                  <p className="text-sm text-text-muted">
                    {action.description}
                  </p>
                </div>
                <div className="flex items-center space-x-2 text-primary group-hover:text-primary/80 transition-colors duration-200">
                  <span className="text-sm font-medium">Acessar</span>
                  <PlusIcon className="h-4 w-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Activity Feed */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-text-primary">Atividade Recente</h2>
            <div className="w-12 h-1 bg-orange-500 rounded-full"></div>
          </div>
          
          <div className="modern-card p-6">
            <div className="space-y-6">
              {recentActivity.map((activity, index) => (
                <div
                  key={activity.id}
                  className="flex items-start space-x-4 p-4 rounded-xl hover:bg-background-surface transition-colors duration-200 group"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className={cn(
                    'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0',
                    activity.bg
                  )}>
                    <activity.icon className={cn('h-5 w-5', activity.color)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-primary group-hover:text-primary transition-colors duration-200">
                      {activity.title}
                    </p>
                    <p className="text-sm text-text-muted mt-1">
                      {activity.description}
                    </p>
                    <div className="flex items-center space-x-2 mt-2">
                      <ClockIcon className="h-3 w-3 text-text-muted" />
                      <span className="text-xs text-text-muted">
                        {activity.time}
                      </span>
                    </div>
                  </div>
                  <EyeIcon className="h-4 w-4 text-text-muted opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                </div>
              ))}
            </div>
            
            <div className="mt-6 pt-4 border-t border-border-primary">
              <Link
                href="/atividades"
                className="flex items-center justify-center space-x-2 text-primary hover:text-primary/80 transition-colors duration-200"
              >
                <span className="text-sm font-medium">Ver todas as atividades</span>
                <Activity className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-text-primary">Performance</h3>
              <Target className="h-5 w-5 text-primary" />
            </div>
            <div className="modern-card p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-muted">Fichas Criadas</span>
                <span className="text-lg font-bold text-text-primary">24</span>
              </div>
              <div className="w-full bg-background-surface rounded-full h-2">
                <div className="bg-gradient-primary h-2 rounded-full" style={{ width: '75%' }}></div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-muted">Insumos Cadastrados</span>
                <span className="text-lg font-bold text-text-primary">156</span>
              </div>
              <div className="w-full bg-background-surface rounded-full h-2">
                <div className="bg-gradient-success h-2 rounded-full" style={{ width: '90%' }}></div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-muted">Eficiência</span>
                <span className="text-lg font-bold text-success">94%</span>
              </div>
              <div className="w-full bg-background-surface rounded-full h-2">
                <div className="bg-gradient-warning h-2 rounded-full" style={{ width: '94%' }}></div>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-text-primary">Sistema</h3>
              <Zap className="h-5 w-5 text-warning" />
            </div>
            <div className="modern-card p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-muted">Status</span>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-success">Online</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-muted">Última Sync</span>
                <span className="text-sm text-text-primary">Agora</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-muted">Backup</span>
                <span className="text-sm text-success">Ativo</span>
              </div>
              
              <div className="pt-4 border-t border-border-primary">
                <div className="flex items-center space-x-2 text-primary">
                  <Star className="h-4 w-4" />
                  <span className="text-sm font-medium">Sistema Premium</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

