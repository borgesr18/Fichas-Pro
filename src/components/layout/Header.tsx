'use client'

import React from 'react'
import { Bars3Icon, BellIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { User } from '@supabase/supabase-js'
import { ChevronDownIcon, LogOutIcon, UserIcon } from 'lucide-react'

interface HeaderProps {
  user: User
  onLogout: () => void
  onMenuClick: () => void
}

export default function Header({ user, onLogout, onMenuClick }: HeaderProps) {
  const userName = user.user_metadata?.nome || user.email?.split('@')[0] || 'Usuário'
  const userInitials = userName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)

  return (
    <div className="relative z-10 flex-shrink-0 flex h-18 bg-white border-b border-secondary-200 header-shadow">
      {/* Mobile menu button */}
      <button
        type="button"
        className="px-4 border-r border-secondary-200 text-secondary-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 md:hidden hover:bg-secondary-50 transition-colors"
        onClick={onMenuClick}
      >
        <span className="sr-only">Abrir sidebar</span>
        <Bars3Icon className="h-6 w-6" aria-hidden="true" />
      </button>
      
      {/* Header content */}
      <div className="flex-1 px-6 flex justify-between items-center">
        {/* Search bar */}
        <div className="flex-1 max-w-lg">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-secondary-400" aria-hidden="true" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2.5 border border-secondary-300 rounded-button bg-secondary-50 text-secondary-900 placeholder-secondary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:bg-white transition-all duration-200"
              placeholder="Buscar fichas, insumos, fornecedores..."
            />
          </div>
        </div>

        {/* Right side */}
        <div className="ml-6 flex items-center space-x-4">
          {/* Notifications */}
          <button
            type="button"
            className="relative p-2 text-secondary-400 hover:text-secondary-600 hover:bg-secondary-100 rounded-lg transition-colors duration-200"
          >
            <span className="sr-only">Ver notificações</span>
            <BellIcon className="h-6 w-6" aria-hidden="true" />
            {/* Notification badge */}
            <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-primary-500 ring-2 ring-white" />
          </button>

          {/* User menu */}
          <div className="relative flex items-center">
            <div className="flex items-center space-x-3 bg-secondary-50 rounded-xl px-3 py-2 hover:bg-secondary-100 transition-colors duration-200 cursor-pointer group">
              {/* Avatar */}
              <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center text-white font-bold shadow-md group-hover:shadow-lg transition-shadow duration-200">
                {userInitials}
              </div>
              
              {/* User info */}
              <div className="hidden sm:block text-left">
                <p className="text-sm font-semibold text-secondary-900 truncate max-w-32">
                  {userName}
                </p>
                <p className="text-xs text-secondary-500 truncate max-w-32">
                  {user.email}
                </p>
              </div>
              
              <ChevronDownIcon className="h-4 w-4 text-secondary-400 group-hover:text-secondary-600 transition-colors duration-200" />
            </div>

            {/* Dropdown menu (simplified for now) */}
            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-elegant border border-secondary-200 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div className="px-4 py-2 border-b border-secondary-100">
                <p className="text-sm font-medium text-secondary-900">{userName}</p>
                <p className="text-xs text-secondary-500 truncate">{user.email}</p>
              </div>
              
              <button className="w-full text-left px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50 flex items-center space-x-2 transition-colors duration-200">
                <UserIcon className="h-4 w-4" />
                <span>Perfil</span>
              </button>
              
              <button 
                onClick={onLogout}
                className="w-full text-left px-4 py-2 text-sm text-danger-600 hover:bg-danger-50 flex items-center space-x-2 transition-colors duration-200"
              >
                <LogOutIcon className="h-4 w-4" />
                <span>Sair</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
