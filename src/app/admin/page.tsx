'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Lock, Mail, AlertCircle } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/lib/utils'

export default function AdminLoginPage() {
  const { user, loading, login, sendReset, error, clearError } = useAuth()
  const router = useRouter()

  const [email,       setEmail]       = useState('')
  const [password,    setPassword]    = useState('')
  const [showPwd,     setShowPwd]     = useState(false)
  const [submitting,  setSubmitting]  = useState(false)
  const [resetMode,   setResetMode]   = useState(false)
  const [resetSent,   setResetSent]   = useState(false)
  const [attempts,    setAttempts]    = useState(0)

  // Redirect if already logged in
  useEffect(() => {
    if (user && !loading) router.replace('/admin/catalogo')
  }, [user, loading, router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (attempts >= 5) return
    clearError()
    setSubmitting(true)
    try {
      await login(email, password)
      router.replace('/admin/dashboard')
    } catch {
      setAttempts(a => a + 1)
    } finally {
      setSubmitting(false)
    }
  }

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await sendReset(email)
      setResetSent(true)
    } catch {
      /* error shown via context */
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return null

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-500 rounded-2xl shadow-brand mb-4">
            <Lock className="text-white" size={28} />
          </div>
          <h1 className="font-display text-2xl text-gray-900">Area riservata</h1>
          <p className="text-sm text-gray-500 mt-1">Le Stagioni Creative</p>
        </div>

        <div className="bg-white rounded-3xl shadow-card p-6 space-y-4">
          {/* Error */}
          {error && (
            <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-2xl p-3 text-sm text-red-700">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              {error}
            </div>
          )}

          {/* Rate limiting warning */}
          {attempts >= 5 && (
            <div className="bg-orange-50 border border-orange-200 rounded-2xl p-3 text-sm text-orange-700">
              Troppi tentativi. Attendi qualche minuto o usa il recupero password.
            </div>
          )}

          {resetSent ? (
            <div className="text-center py-4 space-y-3">
              <div className="text-4xl">📧</div>
              <p className="text-gray-700 font-medium">Email inviata!</p>
              <p className="text-sm text-gray-500">Controlla la tua casella ({email}) per il link di recupero.</p>
              <button
                onClick={() => { setResetMode(false); setResetSent(false) }}
                className="text-sm text-teal-600 hover:text-teal-700 font-medium"
              >
                Torna al login
              </button>
            </div>
          ) : resetMode ? (
            <form onSubmit={handleReset} className="space-y-4">
              <div>
                <label htmlFor="reset-email" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    id="reset-email"
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full h-10 pl-9 pr-4 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
                    placeholder="tuaemail@esempio.it"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full h-10 bg-teal-500 hover:bg-teal-600 text-white rounded-2xl font-medium text-sm transition-colors disabled:opacity-50"
              >
                {submitting ? 'Invio…' : 'Invia link di recupero'}
              </button>
              <button
                type="button"
                onClick={() => setResetMode(false)}
                className="w-full text-center text-sm text-gray-500 hover:text-gray-700"
              >
                ← Torna al login
              </button>
            </form>
          ) : (
            <form onSubmit={handleLogin} className="space-y-4">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    id="email"
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    disabled={attempts >= 5}
                    className="w-full h-10 pl-9 pr-4 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 disabled:opacity-50"
                    placeholder="tuaemail@esempio.it"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    id="password"
                    type={showPwd ? 'text' : 'password'}
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    disabled={attempts >= 5}
                    className="w-full h-10 pl-9 pr-10 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 disabled:opacity-50"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    aria-label={showPwd ? 'Nascondi password' : 'Mostra password'}
                  >
                    {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting || attempts >= 5}
                className="w-full h-10 bg-teal-500 hover:bg-teal-600 text-white rounded-2xl font-medium text-sm transition-colors disabled:opacity-50"
              >
                {submitting ? 'Accesso…' : 'Accedi'}
              </button>

              <button
                type="button"
                onClick={() => setResetMode(true)}
                className="w-full text-center text-sm text-teal-600 hover:text-teal-700"
              >
                Password dimenticata?
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
