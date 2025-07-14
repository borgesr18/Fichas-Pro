'use client'

import React, { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { User } from '@supabase/supabase-js'
import Sidebar from './Sidebar'
import Header from './Header'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      console.log('DashboardLayout: Getting user...')
      const { data: { user }, error } = await supabase.auth.getUser()
      console.log('DashboardLayout: User data:', { user, error })
      
      setUser(user)
      setLoading(false)
      
      if (!user) {
        console.log('DashboardLayout: No user found, redirecting to login')
        router.push('/auth/login')
      } else {
        console.log('DashboardLayout: User authenticated:', user.email)
      }
    }

    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('DashboardLayout: Auth state change:', event, session?.user?.email)
        if (event === 'SIGNED_OUT' || !session) {
          setUser(null)
          router.push('/auth/login')
        } else {
          setUser(session.user)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [router, supabase.auth])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (!user) {
    router.push('/auth/login')
    return null
  }

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      <Sidebar 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen}
      />
      
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <Header 
          user={user}
          onLogout={handleLogout}
          onMenuClick={() => setSidebarOpen(true)}
        />
        
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
