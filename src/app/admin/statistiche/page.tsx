'use client'

import { useState, useEffect } from 'react'
import { getAllProducts } from '@/lib/firebase/products'
import { formatPrice, formatDate, CATEGORY_LABELS } from '@/lib/utils'
import { Package, ShoppingBag, Eye, TrendingUp } from 'lucide-react'
import type { Product } from '@/types'

export default function StatistichePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    getAllProducts().then(setProducts).finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="p-6 text-gray-400">Calcolo statistiche…</div>

  const total     = products.length
  const available = products.filter(p => p.status === 'available').length
  const sold      = products.filter(p => p.status === 'sold').length
  const hidden    = products.filter(p => p.status === 'hidden').length
  const totalViews = products.reduce((sum, p) => sum + p.views, 0)
  const topViewed  = [...products].sort((a, b) => b.views - a.views).slice(0, 5)
  const recent     = [...products].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5)

  // Category breakdown
  const byCat = products.reduce<Record<string, number>>((acc, p) => {
    acc[p.category] = (acc[p.category] ?? 0) + 1
    return acc
  }, {})

  const STATS = [
    { icon: Package,     label: 'Articoli totali',    value: total,       color: 'teal' },
    { icon: ShoppingBag, label: 'Disponibili',         value: available,   color: 'green' },
    { icon: TrendingUp,  label: 'Venduti',             value: sold,        color: 'sand' },
    { icon: Eye,         label: 'Visualizzazioni tot.', value: totalViews, color: 'purple' },
  ]

  const exportCSV = () => {
    const rows = [
      ['ID', 'Nome', 'Categoria', 'Prezzo', 'Stato', 'Visualizzazioni', 'Data creazione'],
      ...products.map(p => [
        p.id, p.name, CATEGORY_LABELS[p.category], p.price.toFixed(2),
        p.status, p.views, formatDate(p.createdAt),
      ]),
    ]
    const csv = rows.map(r => r.map(c => `"${c}"`).join(',')).join('\n')
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }))
    const a   = Object.assign(document.createElement('a'), { href: url, download: 'catalogo.csv' })
    a.click()
  }

  return (
    <div className="p-6 max-w-5xl space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Statistiche</h1>
          <p className="text-sm text-gray-500 mt-0.5">Panoramica del catalogo</p>
        </div>
        <button
          onClick={exportCSV}
          className="px-4 py-2 rounded-2xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
        >
          Esporta CSV
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map(stat => (
          <div key={stat.label} className="bg-white rounded-2xl shadow-card p-5">
            <stat.icon className="text-teal-500 mb-3" size={22} />
            <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Two columns */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top viewed */}
        <div className="bg-white rounded-2xl shadow-card p-5">
          <h2 className="font-semibold text-gray-900 mb-4">Prodotti più visti</h2>
          <div className="space-y-3">
            {topViewed.map((p, i) => (
              <div key={p.id} className="flex items-center gap-3">
                <span className="text-sm font-bold text-gray-300 w-4">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{p.name}</p>
                  <p className="text-xs text-gray-400">{CATEGORY_LABELS[p.category]}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-teal-600">{p.views}</p>
                  <p className="text-xs text-gray-400">visite</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent */}
        <div className="bg-white rounded-2xl shadow-card p-5">
          <h2 className="font-semibold text-gray-900 mb-4">Ultimi articoli inseriti</h2>
          <div className="space-y-3">
            {recent.map(p => (
              <div key={p.id} className="flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{p.name}</p>
                  <p className="text-xs text-gray-400">{formatDate(p.createdAt)}</p>
                </div>
                <p className="text-sm font-semibold text-gray-700">{formatPrice(p.price)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Category breakdown */}
      <div className="bg-white rounded-2xl shadow-card p-5">
        <h2 className="font-semibold text-gray-900 mb-4">Distribuzione per categoria</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {Object.entries(byCat).sort(([,a],[,b]) => b - a).map(([cat, count]) => (
            <div key={cat} className="text-center p-3 bg-teal-50 rounded-2xl">
              <p className="text-2xl font-bold text-teal-600">{count}</p>
              <p className="text-xs text-gray-600 mt-0.5">{CATEGORY_LABELS[cat]}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Summary row */}
      <div className="flex gap-4 text-sm text-gray-500">
        <span>Disponibili: <strong className="text-gray-700">{available}</strong></span>
        <span>Venduti: <strong className="text-gray-700">{sold}</strong></span>
        <span>Nascosti: <strong className="text-gray-700">{hidden}</strong></span>
      </div>
    </div>
  )
}
