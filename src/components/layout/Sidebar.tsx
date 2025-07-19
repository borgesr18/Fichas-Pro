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
  PrinterIcon,
  ChefHatIcon
} from '@heroicons/react/24/outline'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Fichas Técnicas', href: '/fichas-tecnicas', icon: ChefHatIcon },
  { name: 'Insumos', href: '/insumos', icon: CubeIcon },
  { name: 'Fornecedores', href: '/fornecedores', icon: TruckIcon },
  { name: 'Estoque', href: '/estoque', icon: ChartBarIcon },
  { name: 'Impressão', href: '/impressao', icon: PrinterIcon },
  { name: 'Configurações', href: '/configuracoes', icon: CogIcon },
]

interface SidebarProps {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
}

export default function Sidebar({ sidebarOpen, setSidebarOpen }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  const handleLinkClick = (href: string) => {
    if (pathname !== href) {
      router.push(href)
    }
    setSidebarOpen(false)
  }

  const sidebarContent = (
    <div className="flex-1 flex flex-col pt-6 pb-4 overflow-y-auto">
      {/* Logo e Título */}
      <div className="flex items-center flex-shrink-0 px-6 mb-8">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-lg">
            <ChefHatIcon className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-white text-xl font-bold">
              Fichas Pro
            </h1>
            <p className="text-secondary-400 text-xs font-medium">
              Gestão Culinária
            </p>
          </div>
        </div>
      </div>

      {/* Navegação */}
      <nav className="flex-1 px-4 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname.startsWith(item.href)
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={(e) => {
                e.preventDefault()
                handleLinkClick(item.href)
              }}
              className={cn(
                'sidebar-item group relative',
                isActive
                  ? 'sidebar-item-active'
                  : 'sidebar-item-inactive'
              )}
            >
              <div className="flex items-center">
                <item.icon
                  className={cn(
                    "mr-3 flex-shrink-0 h-5 w-5 transition-colors duration-200",
                    isActive 
                      ? "text-white" 
                      : "text-secondary-400 group-hover:text-white"
                  )}
                  aria-hidden="true"
                />
                <span className="font-medium">{item.name}</span>
              </div>
              
              {/* Indicador ativo */}
              {isActive && (
                <div className="absolute right-3 w-2 h-2 bg-white rounded-full shadow-sm" />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Footer da Sidebar */}
      <div className="px-4 pt-4 border-t border-secondary-800">
        <div className="bg-secondary-800/50 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <DocumentTextIcon className="h-4 w-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                Sistema Ativo
              </p>
              <p className="text-xs text-secondary-400">
                Versão 2.0
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile sidebar */}
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog as="div" className="relative z-40 md:hidden" onClose={setSidebarOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-secondary-900/75 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 flex z-40">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative flex-1 flex flex-col max-w-xs w-full bg-gradient-to-b from-secondary-900 to-secondary-800 shadow-elegant">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute top-0 right-0 -mr-12 pt-2">
                    <button
                      type="button"
                      className="ml-1 flex items-center justify-center h-10 w-10 rounded-full bg-secondary-800/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 hover:bg-secondary-700/80 transition-colors"
                      onClick={() => setSidebarOpen(false)}
                    >
                      <span className="sr-only">Fechar sidebar</span>
                      <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
                    </button>
                  </div>
                </Transition.Child>
                {sidebarContent}
              </Dialog.Panel>
            </Transition.Child>
            <div className="flex-shrink-0 w-14" aria-hidden="true">
            </div>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-30">
        <div className="flex-1 flex flex-col min-h-0 bg-gradient-to-b from-secondary-900 to-secondary-800 shadow-elegant">
          {sidebarContent}
        </div>
      </div>
    </>
  )
}
