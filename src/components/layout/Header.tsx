'use client'

import React from 'react'
import { Bars3Icon } from '@heroicons/react/24/outline'
import { User } from '@supabase/supabase-js'
import { ChevronDownIcon } from 'lucide-react'

interface HeaderProps {
  user: User
  onLogout: () => void
  onMenuClick: () => void
}

export default function Header({ user, onLogout, onMenuClick }: HeaderProps) {
  return (
    <div className="relative z-10 flex-shrink-0 flex h-16 bg-white border-b border-secondary-200">
      <button
        type="button"
        className="px-4 border-r border-secondary-200 text-secondary-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 md:hidden"
        onClick={onMenuClick}
      >
        <span className="sr-only">Abrir sidebar</span>
        <Bars3Icon className="h-6 w-6" aria-hidden="true" />
      </button>
      
      <div className="flex-1 px-4 flex justify-end">
        <div className="ml-4 flex items-center md:ml-6">
          <div className="relative ml-3">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-white font-bold">
                  {user.user_metadata?.nome?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase()}
                </div>
                <span className="text-sm text-secondary-700 font-medium">
                  {user.user_metadata?.nome || user.email}
                </span>
                <ChevronDownIcon className="h-4 w-4 text-secondary-400" />
              </div>
              <button
                onClick={onLogout}
                className="text-sm text-secondary-700 hover:text-primary-600 transition-colors"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
