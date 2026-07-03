'use client'

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import type { User } from 'firebase/auth'
import { onAuthChange, signIn, signOut, resetPassword } from '@/lib/firebase/auth'

interface AuthState {
  user:    User | null
  loading: boolean
  error:   string | null
}

interface AuthActions {
  login:          (email: string, password: string) => Promise<void>
  logout:         () => Promise<void>
  sendReset:      (email: string) => Promise<void>
  clearError:     () => void
}

type AuthContextValue = AuthState & AuthActions

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({ user: null, loading: true, error: null })

  useEffect(() => {
    const unsub = onAuthChange(user => {
      setState(prev => ({ ...prev, user, loading: false }))
    })
    return unsub
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    try {
      await signIn(email, password)
    } catch (err: unknown) {
      const msg = mapAuthError(err)
      setState(prev => ({ ...prev, error: msg, loading: false }))
      throw new Error(msg)
    }
  }, [])

  const logout = useCallback(async () => {
    await signOut()
    setState(prev => ({ ...prev, user: null }))
  }, [])

  const sendReset = useCallback(async (email: string) => {
    setState(prev => ({ ...prev, error: null }))
    try {
      await resetPassword(email)
    } catch (err: unknown) {
      const msg = mapAuthError(err)
      setState(prev => ({ ...prev, error: msg }))
      throw new Error(msg)
    }
  }, [])

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }))
  }, [])

  return (
    <AuthContext.Provider value={{ ...state, login, logout, sendReset, clearError }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}

// ─── Map Firebase error codes to human-readable Italian messages ──────────────

function mapAuthError(err: unknown): string {
  const code = (err as { code?: string }).code ?? ''
  const map: Record<string, string> = {
    'auth/invalid-email':         'Email non valida.',
    'auth/user-not-found':        'Utente non trovato.',
    'auth/wrong-password':        'Password errata.',
    'auth/invalid-credential':    'Credenziali non valide.',
    'auth/too-many-requests':     'Troppi tentativi. Riprova tra qualche minuto.',
    'auth/network-request-failed':'Errore di rete. Controlla la connessione.',
    'auth/user-disabled':         'Account disabilitato.',
  }
  return map[code] ?? 'Errore durante l\'accesso. Riprova.'
}
