'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getAllProducts } from '@/lib/firebase/products'
import { formatPrice, formatDate, CATEGORY_LABELS } from '@/lib/utils'
import {
  Package, ShoppingBag, Eye, PlusCircle,
  TrendingUp, ArrowRight, Star, EyeOff
} from 'lucide-react'
import type { Product } from '@/types'

export default function AdminDashboardPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    getAllProducts().then(setProducts).finally(() => setLoading(false))
  }, [])

  const total     = products.length
  const available = products.filter(p => p.status === 'available').length
  const sold      = products.filter(p => p.status === 'sold').length
  const hidden    = products.filter(p => p.status === 'hidden').length
  const featured  = products.filter(p => p.featured).length
  const totalViews = products.reduce((s, p) => s + p.views, 0)

  const recent  = [...products]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)
  const topView = [...products]
    .sort((a, b) => b.views - a.views)
    .slice(0, 3)

  const KPIS = [
    { label: 'Articoli totali',  value: total,      icon: Package,     color: 'bg-teal-50   text-teal-600'  },
    { label: 'Disponibili',      value: available,  icon: ShoppingBag, color: 'bg-green-50  text-green-600' },
    { label: 'Venduti',          value: sold,       icon: TrendingUp,  color: 'bg-sand-50   text-sand-500'  },
    { label: 'Visualizzazioni',  value: totalViews, icon: Eye,         color: 'bg-purple-50 text-purple-600'},
  ]

  const SHORTCUTS = [
    { href: '/admin/nuovo-articolo', icon: PlusCircle, label: 'Nuovo articolo',   color: 'bg-teal-500 hover:bg-teal-600 text-white' },
    { href: '/admin/catalogo',       icon: Package,    label: 'Gestisci catalogo', color: 'bg-white hover:bg-gray-50 border border-gray-200 text-gray-700' },
    { href: '/admin/statistiche',    icon: TrendingUp, label: 'Statistiche',       color: 'bg-white hover:bg-gray-50 border border-gray-200 text-gray-700' },
    { href: '/admin/impostazioni',   icon: Eye,        label: 'Impostazioni',      color: 'bg-white hover:bg-gray-50 border border-gray-200 text-gray-700' },
  ]

  return (
    <div className="p-6 max-w-6xl space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Bentornata! Ecco un riepilogo del tuo catalogo.
        </p>
      </div>

      {/* Shortcuts */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {SHORTCUTS.map(s => (
          <Link
            key={s.href}
            href={s.href}
            className={`flex flex-col items-center gap-2 p-4 rounded-2xl text-sm font-medium transition-all hover:-translate-y-0.5 shadow-card text-center ${s.color}`}
          >
            <s.icon size={22} />
            {s.label}
          </Link>
        ))}
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {KPIS.map(k => (
          <div key={k.label} className="bg-white rounded-2xl shadow-card p-5">
            <div className={`inline-flex p-2 rounded-xl mb-3 ${k.color}`}>
              <k.icon size={18} />
            </div>
            {loading
              ? <div className="h-8 w-16 bg-gray-100 rounded-lg animate-pulse mb-1" />
              : <p className="text-3xl font-bold text-gray-900">{k.value}</p>
            }
            <p className="text-sm text-gray-500 mt-1">{k.label}</p>
          </div>
        ))}
      </div>

      {/* Extra badges */}
      <div className="flex flex-wrap gap-3">
        {[
          { icon: Star,   label: `${featured} in evidenza`,  color: 'bg-amber-50 text-amber-700 border-amber-200' },
          { icon: EyeOff, label: `${hidden} nascosti`,       color: 'bg-orange-50 text-orange-700 border-orange-200' },
        ].map(b => (
          <span key={b.label} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border ${b.color}`}>
            <b.icon size={14} />
            {b.label}
          </span>
        ))}
      </div>

      {/* Two-column tables */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent products */}
        <div className="bg-white rounded-2xl shadow-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Ultimi inseriti</h2>
            <Link href="/admin/catalogo" className="text-xs text-teal-600 hover:text-teal-700 flex items-center gap-1">
              Vedi tutti <ArrowRight size={12} />
            </Link>
          </div>
          <div className="space-y-3">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-10 bg-gray-50 rounded-xl animate-pulse" />
                ))
              : recent.map(p => (
                  <div key={p.id} className="flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{p.name}</p>
                      <p className="text-xs text-gray-400">{formatDate(p.createdAt)}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-semibold text-gray-700">{formatPrice(p.price)}</p>
                      <p className={`text-xs ${p.status === 'available' ? 'text-teal-600' : p.status === 'sold' ? 'text-gray-400' : 'text-orange-500'}`}>
                        {p.status === 'available' ? 'Disponibile' : p.status === 'sold' ? 'Venduto' : 'Nascosto'}
                      </p>
                    </div>
                    <Link href={`/admin/catalogo/${p.id}`} className="p-1.5 rounded-lg text-gray-300 hover:text-teal-600 hover:bg-teal-50 transition-colors shrink-0">
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                ))
            }
          </div>
        </div>

        {/* Top viewed */}
        <div className="bg-white rounded-2xl shadow-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Più visti</h2>
            <Link href="/admin/statistiche" className="text-xs text-teal-600 hover:text-teal-700 flex items-center gap-1">
              Statistiche <ArrowRight size={12} />
            </Link>
          </div>
          <div className="space-y-4">
            {loading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-12 bg-gray-50 rounded-xl animate-pulse" />
                ))
              : topView.map((p, i) => (
                  <div key={p.id} className="flex items-center gap-3">
                    <span className="text-2xl font-bold text-gray-200 w-6 text-center leading-none">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{p.name}</p>
                      <p className="text-xs text-gray-400">{CATEGORY_LABELS[p.category]}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-bold text-teal-600">{p.views}</p>
                      <p className="text-xs text-gray-400">visite</p>
                    </div>
                  </div>
                ))
            }
            {!loading && topView.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-4">
                Nessun prodotto ancora visitato.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Quick add CTA */}
      <div className="bg-gradient-to-r from-teal-500 to-teal-600 rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-white">
        <div>
          <p className="font-semibold text-lg">Hai una nuova creazione?</p>
          <p className="text-teal-100 text-sm">Aggiungila subito al catalogo.</p>
        </div>
        <Link
          href="/admin/nuovo-articolo"
          className="inline-flex items-center gap-2 bg-white text-teal-600 hover:bg-teal-50 px-5 py-2.5 rounded-2xl font-semibold text-sm transition-colors shrink-0"
        >
          <PlusCircle size={18} />
          Aggiungi articolo
        </Link>
      </div>
    </div>
  )
}
