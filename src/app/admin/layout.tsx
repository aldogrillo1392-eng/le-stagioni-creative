'use client'

import React, { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  LayoutDashboard, Package, PlusCircle, BarChart2,
  Settings, LogOut, ChevronRight, Tag
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { href: '/admin/dashboard',      icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/catalogo',       icon: Package,         label: 'Catalogo' },
  { href: '/admin/nuovo-articolo', icon: PlusCircle,      label: 'Nuovo articolo' },
  { href: '/admin/statistiche',    icon: BarChart2,       label: 'Statistiche' },
  { href: '/admin/impostazioni',   icon: Settings,        label: 'Impostazioni' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth()
  const router   = useRouter()
  const pathname = usePathname()
  const isLogin  = pathname === '/admin' && !pathname.includes('/dashboard')

  useEffect(() => {
    if (!loading && !user && !isLogin) {
      router.replace('/admin')
    }
  }, [user, loading, router, isLogin])

  // Show login page without sidebar
  if (isLogin || (!user && !loading)) {
    return <>{children}</>
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-teal-500 border-t-transparent animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* ── Sidebar ──────────────────────────────────────────────────────── */}
      <aside className="w-60 shrink-0 bg-white border-r border-gray-100 flex flex-col shadow-sm" aria-label="Menu amministratore">
        <div className="p-5 border-b border-gray-100">
          <p className="font-display text-lg text-gray-900">Le Stagioni</p>
          <p className="text-xs text-teal-600 font-medium">Area Admin</p>
        </div>

        <nav className="flex-1 p-3 space-y-0.5">
          {NAV_ITEMS.map(item => {
            const active = pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors',
                  active
                    ? 'bg-teal-50 text-teal-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                )}
                aria-current={active ? 'page' : undefined}
              >
                <item.icon size={18} className={active ? 'text-teal-600' : 'text-gray-400'} />
                {item.label}
                {active && <ChevronRight size={14} className="ml-auto text-teal-400" />}
              </Link>
            )
          })}
        </nav>

        <div className="p-3 border-t border-gray-100">
          <div className="px-3 py-2 mb-1">
            <p className="text-xs text-gray-400 truncate">{user?.email}</p>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
          >
            <LogOut size={18} />
            Esci
          </button>
        </div>
      </aside>

      {/* ── Main content ─────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  )
}
