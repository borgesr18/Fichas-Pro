'use client'

import React from 'react'
import { Bars3Icon } from '@heroicons/react/24/outline'
import { User } from '@supabase/supabase-js'

interface HeaderProps {
  user: User
  onLogout: () => void
  onMenuClick: () => void
}

export default function Header({ user, onLogout, onMenuClick }: HeaderProps) {
  return (
    <div className="relative z-10 flex-shrink-0 flex h-16 bg-white shadow">
      <button
        type="button"
        className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden"
        onClick={onMenuClick}
      >
        <span className="sr-only">Abrir sidebar</span>
        <Bars3Icon className="h-6 w-6" aria-hidden="true" />
      </button>
      
      <div className="flex-1 px-4 flex justify-between">
        <div className="flex-1 flex">
          <div className="w-full flex md:ml-0">
            <div className="relative w-full text-gray-400 focus-within:text-gray-600">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <h1 className="text-lg font-semibold text-gray-900">
                  Sistema de Gestão de Fichas Técnicas
                </h1>
              </div>
            </div>
          </div>
        </div>
        
        <div className="ml-4 flex items-center md:ml-6">
          <div className="relative ml-3">
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                Olá, {user.user_metadata?.nome || user.email}
              </span>
              <button
                onClick={onLogout}
                className="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <span className="sr-only">Sair</span>
                <span className="text-sm text-gray-700 hover:text-gray-900">
                  Sair
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
