'use client'

import React, { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'
import { Mail, Lock, ArrowRight, ChefHat, Sparkles, Shield } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setError(error.message)
      } else {
        router.push('/dashboard')
      }
    } catch {
      setError('Erro inesperado. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background-primary relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-success/5 rounded-full blur-2xl transform -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      {/* Animated background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:20px_20px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>

      <div className="relative z-10 min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full animate-fade-in-up">
          {/* Logo e Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-primary rounded-3xl flex items-center justify-center shadow-glow-primary animate-glow">
                  <ChefHat className="h-10 w-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-success rounded-full border-2 border-background-primary animate-pulse flex items-center justify-center">
                  <Sparkles className="h-3 w-3 text-white" />
                </div>
              </div>
            </div>
            <h1 className="text-4xl font-bold text-text-primary mb-3 gradient-text">
              Fichas Pro
            </h1>
            <h2 className="text-xl font-semibold text-text-primary mb-2">
              Entrar na sua conta
            </h2>
            <p className="text-text-muted">
              Sistema de Gestão Culinária Profissional
            </p>
          </div>

          {/* Form Card */}
          <div className="glass-card p-8 border border-border-primary">
            <form className="space-y-6" onSubmit={handleLogin}>
              {/* Email Input */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-3">
                  Email
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-text-muted group-focus-within:text-primary transition-colors duration-200" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="input-modern pl-12 h-12 text-text-primary placeholder-text-muted focus:border-primary focus:ring-2 focus:ring-primary/20"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-text-primary mb-3">
                  Senha
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-text-muted group-focus-within:text-primary transition-colors duration-200" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    className="input-modern pl-12 pr-12 h-12 text-text-primary placeholder-text-muted focus:border-primary focus:ring-2 focus:ring-primary/20"
                    placeholder="Sua senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-4 flex items-center hover:bg-background-surface rounded-r-xl transition-colors duration-200"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5 text-text-muted hover:text-text-primary transition-colors duration-200" />
                    ) : (
                      <EyeIcon className="h-5 w-5 text-text-muted hover:text-text-primary transition-colors duration-200" />
                    )}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="glass-card bg-error/10 border-error/30 p-4 animate-fade-in-down">
                  <div className="flex items-center space-x-3">
                    <Shield className="h-5 w-5 text-error flex-shrink-0" />
                    <p className="text-error text-sm font-medium">{error}</p>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full h-12 flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span className="font-semibold">Entrando...</span>
                  </>
                ) : (
                  <>
                    <span className="font-semibold">Entrar no Sistema</span>
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
                  </>
                )}
              </button>

              {/* Additional Options */}
              <div className="flex items-center justify-between pt-2">
                <Link
                  href="/auth/forgot-password"
                  className="text-sm text-text-muted hover:text-primary transition-colors duration-200"
                >
                  Esqueceu a senha?
                </Link>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                  <span className="text-xs text-text-muted">Seguro</span>
                </div>
              </div>
            </form>
          </div>

          {/* Register Link */}
          <div className="text-center mt-8">
            <div className="glass-card p-6 border border-border-secondary">
              <p className="text-text-muted mb-4">
                Não tem uma conta ainda?
              </p>
              <Link
                href="/auth/register"
                className="btn-secondary w-full flex items-center justify-center space-x-2 group"
              >
                <span>Criar Nova Conta</span>
                <Sparkles className="h-4 w-4 group-hover:rotate-12 transition-transform duration-200" />
              </Link>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-8">
            <div className="flex items-center justify-center space-x-4 text-xs text-text-muted">
              <div className="flex items-center space-x-2">
                <div className="w-1 h-1 bg-primary rounded-full"></div>
                <span>© 2024 Fichas Pro</span>
              </div>
              <div className="w-px h-4 bg-border-primary"></div>
              <div className="flex items-center space-x-2">
                <Shield className="h-3 w-3" />
                <span>Sistema Profissional</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

