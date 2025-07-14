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
      console.log('DashboardLayout: Getting user session...', new Date().toISOString())
      
      try {
        const { data: { user }, error } = await supabase.auth.getUser()
        console.log('DashboardLayout: Auth check result:', { 
          user: user ? { id: user.id, email: user.email } : null, 
          error: error?.message,
          timestamp: new Date().toISOString()
        })
        
        setUser(user)
        setLoading(false)
        
        if (!user) {
          console.log('DashboardLayout: No authenticated user - redirecting to login')
          router.push('/auth/login')
        } else {
          console.log('DashboardLayout: User authenticated successfully:', user.email)
          
          setTimeout(async () => {
            try {
              console.log('DashboardLayout: Testing API authentication...')
              const response = await fetch('/api/auth/debug')
              const result = await response.json()
              console.log('DashboardLayout: API auth test result:', result)
            } catch (err) {
              console.error('DashboardLayout: API auth test failed:', err)
            }
          }, 500)
        }
      } catch (err) {
        console.error('DashboardLayout: Error getting user:', err)
        setLoading(false)
        router.push('/auth/login')
      }
    }

    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('DashboardLayout: Auth state change:', { 
          event, 
          user: session?.user?.email,
          timestamp: new Date().toISOString()
        })
        
        if (event === 'SIGNED_OUT' || !session) {
          console.log('DashboardLayout: User signed out - redirecting to login')
          setUser(null)
          router.push('/auth/login')
        } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          console.log('DashboardLayout: User session updated:', session.user.email)
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
      
      <div className="flex flex-col flex-1 md:ml-64 overflow-hidden">
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
