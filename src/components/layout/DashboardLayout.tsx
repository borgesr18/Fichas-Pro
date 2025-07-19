'use client'

import { useState, useEffect } from 'react'
import Sidebar from './Sidebar'
import Header from './Header'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading time for smooth transitions
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background-primary flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center animate-pulse">
              <div className="w-8 h-8 bg-white rounded-lg opacity-80"></div>
            </div>
            <div className="absolute inset-0 bg-gradient-primary rounded-2xl animate-ping opacity-20"></div>
          </div>
          <div className="text-center">
            <h2 className="text-xl font-semibold text-text-primary mb-2">Fichas Pro</h2>
            <p className="text-text-muted">Carregando sistema...</p>
          </div>
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background-primary">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main content */}
      <div className="md:pl-80">
        {/* Header */}
        <Header setSidebarOpen={setSidebarOpen} />

        {/* Page content */}
        <main className="relative">
          {/* Background decorative elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
          </div>

          {/* Content wrapper */}
          <div className="relative z-10 px-4 py-8 sm:px-6 lg:px-8">
            <div className="animate-fade-in-up">
              {children}
            </div>
          </div>
        </main>
      </div>

      {/* Global styles for smooth animations */}
      <style jsx global>{`
        .page-transition-enter {
          opacity: 0;
          transform: translateY(20px);
        }
        .page-transition-enter-active {
          opacity: 1;
          transform: translateY(0);
          transition: opacity 300ms ease-out, transform 300ms ease-out;
        }
        .page-transition-exit {
          opacity: 1;
          transform: translateY(0);
        }
        .page-transition-exit-active {
          opacity: 0;
          transform: translateY(-20px);
          transition: opacity 200ms ease-in, transform 200ms ease-in;
        }
      `}</style>
    </div>
  )
}

