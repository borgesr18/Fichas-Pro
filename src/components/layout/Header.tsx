'use client'

import React, { Fragment, useState } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { 
  Bars3Icon
} from '@heroicons/react/24/outline'
import { Search, Bell, Settings, LogOut, User, Zap, Crown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface HeaderProps {
  setSidebarOpen: (open: boolean) => void
}

export default function Header({ setSidebarOpen }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [notifications] = useState([
    { id: 1, title: 'Nova ficha técnica criada', time: '2 min atrás', type: 'success' },
    { id: 2, title: 'Estoque baixo: Farinha de Trigo', time: '15 min atrás', type: 'warning' },
    { id: 3, title: 'Relatório mensal disponível', time: '1 hora atrás', type: 'info' },
  ])

  return (
    <div className="sticky top-0 z-40 flex h-20 shrink-0 items-center gap-x-4 glass-card border-b border-border-primary px-4 shadow-glass sm:gap-x-6 sm:px-6 lg:px-8">
      {/* Mobile menu button */}
      <button
        type="button"
        className="-m-2.5 p-2.5 text-text-secondary hover:text-text-primary md:hidden transition-colors duration-200"
        onClick={() => setSidebarOpen(true)}
      >
        <Bars3Icon className="h-6 w-6" />
      </button>

      {/* Separator */}
      <div className="h-6 w-px bg-border-primary md:hidden" />

      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        {/* Search */}
        <div className="relative flex flex-1 items-center">
          <div className="relative w-full max-w-lg">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
              <Search className="h-5 w-5 text-text-muted" />
            </div>
            <input
              type="search"
              placeholder="Buscar fichas, insumos, fornecedores..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full rounded-xl border-0 bg-background-surface/50 backdrop-blur-sm py-3 pl-12 pr-4 text-text-primary placeholder:text-text-muted focus:ring-2 focus:ring-primary focus:ring-offset-0 focus:ring-offset-transparent sm:text-sm transition-all duration-200"
            />
            {searchQuery && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-background-surface/90 backdrop-blur-xl border border-border-primary rounded-xl shadow-glass p-2 space-y-1">
                <div className="px-3 py-2 text-xs text-text-muted">Resultados da busca</div>
                <div className="px-3 py-2 hover:bg-background-surface-light rounded-lg cursor-pointer transition-colors duration-200">
                  <div className="text-sm text-text-primary">Ficha: Bolo de Chocolate</div>
                  <div className="text-xs text-text-muted">Fichas Técnicas</div>
                </div>
                <div className="px-3 py-2 hover:bg-background-surface-light rounded-lg cursor-pointer transition-colors duration-200">
                  <div className="text-sm text-text-primary">Farinha de Trigo</div>
                  <div className="text-xs text-text-muted">Insumos</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          {/* Quick Stats */}
          <div className="hidden lg:flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
              <span className="text-sm text-text-muted">Sistema Online</span>
            </div>
            <div className="flex items-center space-x-2">
              <Zap className="h-4 w-4 text-warning" />
              <span className="text-sm text-text-muted">12 Fichas Ativas</span>
            </div>
          </div>

          {/* Notifications */}
          <Menu as="div" className="relative">
            <Menu.Button className="relative p-2 text-text-secondary hover:text-text-primary transition-colors duration-200 group">
              <Bell className="h-6 w-6 group-hover:animate-pulse" />
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 bg-error text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                  {notifications.length}
                </span>
              )}
            </Menu.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 z-10 mt-2 w-80 origin-top-right glass-card border border-border-primary rounded-xl shadow-glass focus:outline-none">
                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-text-primary">Notificações</h3>
                    <span className="text-xs text-text-muted bg-primary/20 px-2 py-1 rounded-full">
                      {notifications.length} novas
                    </span>
                  </div>
                  <div className="space-y-3">
                    {notifications.map((notification) => (
                      <Menu.Item key={notification.id}>
                        {({ active }) => (
                          <div className={cn(
                            'p-3 rounded-lg cursor-pointer transition-colors duration-200',
                            active ? 'bg-background-surface-light' : 'hover:bg-background-surface'
                          )}>
                            <div className="flex items-start space-x-3">
                              <div className={cn(
                                'w-2 h-2 rounded-full mt-2 flex-shrink-0',
                                notification.type === 'success' ? 'bg-success' :
                                notification.type === 'warning' ? 'bg-warning' : 'bg-info'
                              )}></div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-text-primary font-medium">
                                  {notification.title}
                                </p>
                                <p className="text-xs text-text-muted mt-1">
                                  {notification.time}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </Menu.Item>
                    ))}
                  </div>
                  <div className="mt-4 pt-3 border-t border-border-primary">
                    <button className="w-full text-center text-sm text-primary hover:text-primary/80 transition-colors duration-200">
                      Ver todas as notificações
                    </button>
                  </div>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>

          {/* Separator */}
          <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-border-primary" />

          {/* Profile dropdown */}
          <Menu as="div" className="relative">
            <Menu.Button className="flex items-center space-x-3 p-2 rounded-xl hover:bg-background-surface transition-colors duration-200 group">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center shadow-glow-primary">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-success rounded-full border-2 border-background-primary"></div>
              </div>
              <div className="hidden lg:block text-left">
                <div className="flex items-center space-x-2">
                  <p className="text-sm font-medium text-text-primary">Admin User</p>
                  <Crown className="h-4 w-4 text-warning" />
                </div>
                <p className="text-xs text-text-muted">Administrador</p>
              </div>
            </Menu.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right glass-card border border-border-primary rounded-xl shadow-glass focus:outline-none">
                <div className="p-2">
                  {/* Profile Header */}
                  <div className="px-3 py-3 border-b border-border-primary mb-2">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-text-primary">Admin User</p>
                        <p className="text-xs text-text-muted">admin@fichas.pro</p>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <Menu.Item>
                    {({ active }) => (
                      <a
                        href="/profile"
                        className={cn(
                          'group flex items-center px-3 py-2 text-sm rounded-lg transition-colors duration-200',
                          active ? 'bg-background-surface-light text-text-primary' : 'text-text-secondary hover:text-text-primary'
                        )}
                      >
                        <User className="mr-3 h-4 w-4" />
                        Meu Perfil
                      </a>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <a
                        href="/configuracoes"
                        className={cn(
                          'group flex items-center px-3 py-2 text-sm rounded-lg transition-colors duration-200',
                          active ? 'bg-background-surface-light text-text-primary' : 'text-text-secondary hover:text-text-primary'
                        )}
                      >
                        <Settings className="mr-3 h-4 w-4" />
                        Configurações
                      </a>
                    )}
                  </Menu.Item>
                  
                  <div className="my-2 border-t border-border-primary"></div>
                  
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        className={cn(
                          'group flex w-full items-center px-3 py-2 text-sm rounded-lg transition-colors duration-200',
                          active ? 'bg-error/10 text-error' : 'text-text-secondary hover:text-error hover:bg-error/5'
                        )}
                      >
                        <LogOut className="mr-3 h-4 w-4" />
                        Sair
                      </button>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </div>
    </div>
  )
}

