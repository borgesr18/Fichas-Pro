'use client'

import React, { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { 
  XMarkIcon,
  HomeIcon,
  CogIcon,
  TruckIcon,
  CubeIcon,
  ChartBarIcon,
  DocumentTextIcon,
  PrinterIcon
} from '@heroicons/react/24/outline'
import { ChefHat, Sparkles, Users, Activity } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon, gradient: 'from-blue-500 to-purple-600' },
  { name: 'Fichas Técnicas', href: '/fichas-tecnicas', icon: ChefHat, gradient: 'from-orange-500 to-red-500' },
  { name: 'Insumos', href: '/insumos', icon: CubeIcon, gradient: 'from-green-500 to-emerald-600' },
  { name: 'Fornecedores', href: '/fornecedores', icon: TruckIcon, gradient: 'from-purple-500 to-pink-600' },
  { name: 'Estoque', href: '/estoque', icon: ChartBarIcon, gradient: 'from-cyan-500 to-blue-600' },
  { name: 'Impressão', href: '/impressao', icon: PrinterIcon, gradient: 'from-indigo-500 to-purple-600' },
  { name: 'Configurações', href: '/configuracoes', icon: CogIcon, gradient: 'from-gray-500 to-gray-600' },
]

interface SidebarProps {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
}

function DesktopSidebar() {
  const pathname = usePathname()

  return (
    <div className="hidden md:flex md:w-80 md:flex-col md:fixed md:inset-y-0">
      <div className="glass-sidebar flex flex-col flex-grow overflow-y-auto">
        {/* Logo Section */}
        <div className="flex items-center flex-shrink-0 px-8 py-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-glow-primary">
                <ChefHat className="h-7 w-7 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-success rounded-full border-2 border-background-primary animate-pulse"></div>
            </div>
            <div>
              <h1 className="text-xl font-bold gradient-text">
                Fichas Pro
              </h1>
              <p className="text-sm text-text-muted">Gestão Culinária</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-6 pb-4 space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 relative overflow-hidden',
                  isActive
                    ? 'text-white bg-gradient-primary shadow-glow-primary'
                    : 'text-text-secondary hover:text-white hover:bg-background-surface'
                )}
              >
                {/* Hover effect background */}
                <div className={cn(
                  'absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-10 transition-opacity duration-200 rounded-xl',
                  item.gradient
                )}></div>
                
                {/* Icon with gradient background */}
                <div className={cn(
                  'flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center mr-3 transition-all duration-200',
                  isActive 
                    ? 'bg-white/20' 
                    : `bg-gradient-to-br ${item.gradient} opacity-80 group-hover:opacity-100`
                )}>
                  <item.icon className={cn(
                    'h-5 w-5 transition-colors duration-200',
                    isActive ? 'text-white' : 'text-white'
                  )} />
                </div>
                
                <span className="relative z-10">{item.name}</span>
                
                {/* Active indicator */}
                {isActive && (
                  <div className="absolute right-2 w-2 h-2 bg-white rounded-full animate-pulse"></div>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Stats Section */}
        <div className="px-6 py-4">
          <div className="glass-card p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-muted">Sistema Ativo</span>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                <span className="text-xs text-success font-medium">Online</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center">
                <div className="text-lg font-bold text-primary">12</div>
                <div className="text-xs text-text-muted">Fichas</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-success">48</div>
                <div className="text-xs text-text-muted">Insumos</div>
              </div>
            </div>
            
            <div className="flex items-center justify-center space-x-1 pt-2 border-t border-border-primary">
              <Activity className="h-3 w-3 text-primary" />
              <span className="text-xs text-text-muted">Última sync: agora</span>
            </div>
          </div>
        </div>

        {/* User Section */}
        <div className="px-6 py-4 border-t border-border-primary">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
                <Users className="h-5 w-5 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-success rounded-full border-2 border-background-primary"></div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-text-primary truncate">
                Admin User
              </p>
              <p className="text-xs text-text-muted truncate">
                admin@fichas.pro
              </p>
            </div>
            <Sparkles className="h-4 w-4 text-secondary animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  )
}

function MobileSidebar({ sidebarOpen, setSidebarOpen }: SidebarProps) {
  const pathname = usePathname()

  return (
    <Transition.Root show={sidebarOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50 md:hidden" onClose={setSidebarOpen}>
        <Transition.Child
          as={Fragment}
          enter="transition-opacity ease-linear duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity ease-linear duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 flex">
          <Transition.Child
            as={Fragment}
            enter="transition ease-in-out duration-300 transform"
            enterFrom="-translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-x-0"
            leaveTo="-translate-x-full"
          >
            <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
              <Transition.Child
                as={Fragment}
                enter="ease-in-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in-out duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                  <button
                    type="button"
                    className="-m-2.5 p-2.5 text-white hover:text-text-muted transition-colors duration-200"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>
              </Transition.Child>

              <div className="glass-sidebar flex grow flex-col overflow-y-auto px-6 pb-4">
                {/* Mobile Logo */}
                <div className="flex items-center flex-shrink-0 py-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-glow-primary">
                      <ChefHat className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h1 className="text-lg font-bold gradient-text">Fichas Pro</h1>
                      <p className="text-xs text-text-muted">Gestão Culinária</p>
                    </div>
                  </div>
                </div>

                {/* Mobile Navigation */}
                <nav className="flex-1 space-y-2">
                  {navigation.map((item) => {
                    const isActive = pathname === item.href
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setSidebarOpen(false)}
                        className={cn(
                          'group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200',
                          isActive
                            ? 'text-white bg-gradient-primary shadow-glow-primary'
                            : 'text-text-secondary hover:text-white hover:bg-background-surface'
                        )}
                      >
                        <div className={cn(
                          'flex-shrink-0 w-6 h-6 rounded-md flex items-center justify-center mr-3',
                          isActive 
                            ? 'bg-white/20' 
                            : `bg-gradient-to-br ${item.gradient} opacity-80`
                        )}>
                          <item.icon className="h-4 w-4 text-white" />
                        </div>
                        {item.name}
                      </Link>
                    )
                  })}
                </nav>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

export default function Sidebar({ sidebarOpen, setSidebarOpen }: SidebarProps) {
  return (
    <>
      <DesktopSidebar />
      <MobileSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
    </>
  )
}

