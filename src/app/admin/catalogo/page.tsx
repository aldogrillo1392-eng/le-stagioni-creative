'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import toast from 'react-hot-toast'
import {
  Plus, Pencil, Trash2, Copy, Eye, EyeOff, Star, StarOff,
  ExternalLink, ArrowUp, ArrowDown, Search
} from 'lucide-react'
import { getAllProducts, updateProduct, deleteProduct, duplicateProduct } from '@/lib/firebase/products'
import { deleteStorageFile } from '@/lib/firebase/storage'
import { cn, formatPrice, CATEGORY_LABELS } from '@/lib/utils'
import type { Product } from '@/types'

export default function AdminCatalogoPage() {
  const [products, setProducts]     = useState<Product[]>([])
  const [loading,  setLoading]      = useState(true)
  const [search,   setSearch]       = useState('')
  const [deleting, setDeleting]     = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getAllProducts()
      setProducts(data)
    } catch {
      toast.error('Errore nel caricamento dei prodotti')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const filtered = search
    ? products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
    : products

  // ── Actions ──────────────────────────────────────────────────────────────

  const toggleVisibility = async (product: Product) => {
    const newStatus = product.status === 'hidden' ? 'available' : 'hidden'
    await updateProduct(product.id, { status: newStatus })
    setProducts(prev => prev.map(p => p.id === product.id ? { ...p, status: newStatus } : p))
    toast.success(newStatus === 'hidden' ? 'Nascosto' : 'Pubblicato')
  }

  const toggleFeatured = async (product: Product) => {
    const featured = !product.featured
    await updateProduct(product.id, { featured })
    setProducts(prev => prev.map(p => p.id === product.id ? { ...p, featured } : p))
    toast.success(featured ? 'Messo in evidenza' : 'Rimosso dall\'evidenza')
  }

  const handleDuplicate = async (product: Product) => {
    const toastId = toast.loading('Duplicazione…')
    try {
      await duplicateProduct(product)
      toast.success('Prodotto duplicato', { id: toastId })
      load()
    } catch {
      toast.error('Errore nella duplicazione', { id: toastId })
    }
  }

  const handleDelete = async (product: Product) => {
    if (!window.confirm(`Eliminare "${product.name}"? L'azione è irreversibile.`)) return
    setDeleting(product.id)
    const toastId = toast.loading('Eliminazione…')
    try {
      // Delete images from storage
      await Promise.all(product.images.map(img => deleteStorageFile(img.storagePath)))
      await deleteProduct(product.id)
      setProducts(prev => prev.filter(p => p.id !== product.id))
      toast.success('Prodotto eliminato', { id: toastId })
    } catch {
      toast.error('Errore nell\'eliminazione', { id: toastId })
    } finally {
      setDeleting(null)
    }
  }

  const moveOrder = async (product: Product, direction: 'up' | 'down') => {
    const idx  = products.findIndex(p => p.id === product.id)
    const swap = direction === 'up' ? idx - 1 : idx + 1
    if (swap < 0 || swap >= products.length) return

    const updated = [...products]
    const orderA  = updated[idx].order
    const orderB  = updated[swap].order

    updated[idx]  = { ...updated[idx],  order: orderB }
    updated[swap] = { ...updated[swap], order: orderA }
    updated.sort((a, b) => a.order - b.order)
    setProducts(updated)

    await Promise.all([
      updateProduct(updated[idx].id,  { order: updated[idx].order }),
      updateProduct(updated[swap].id, { order: updated[swap].order }),
    ])
  }

  // ── Status badge ─────────────────────────────────────────────────────────

  const StatusBadge = ({ status }: { status: string }) => {
    const map: Record<string, { label: string; className: string }> = {
      available: { label: 'Disponibile', className: 'bg-teal-50 text-teal-700' },
      sold:      { label: 'Venduto',     className: 'bg-gray-100 text-gray-600' },
      hidden:    { label: 'Nascosto',    className: 'bg-orange-50 text-orange-600' },
    }
    const { label, className } = map[status] ?? map.hidden
    return <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium', className)}>{label}</span>
  }

  return (
    <div className="p-6 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Catalogo</h1>
          <p className="text-sm text-gray-500 mt-0.5">{products.length} articoli totali</p>
        </div>
        <Link
          href="/admin/nuovo-articolo"
          className="inline-flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-2xl text-sm font-medium shadow-brand-sm transition-colors"
        >
          <Plus size={16} />
          Nuovo articolo
        </Link>
      </div>

      {/* Search */}
      <div className="relative mb-4 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
        <input
          type="search"
          placeholder="Cerca per nome…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full h-10 pl-9 pr-4 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 bg-white"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl shadow-card overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-400">Caricamento…</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-gray-400">Nessun prodotto trovato.</p>
            <Link href="/admin/nuovo-articolo" className="text-teal-600 text-sm mt-2 inline-block">
              + Aggiungi il primo prodotto
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-xs text-gray-500 uppercase tracking-wider">
                  <th className="text-left px-4 py-3 font-medium">Prodotto</th>
                  <th className="text-left px-4 py-3 font-medium hidden sm:table-cell">Categoria</th>
                  <th className="text-left px-4 py-3 font-medium">Prezzo</th>
                  <th className="text-left px-4 py-3 font-medium">Stato</th>
                  <th className="text-right px-4 py-3 font-medium">Azioni</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((product, idx) => (
                  <tr key={product.id} className="hover:bg-gray-50/60 transition-colors group">
                    {/* Product */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                          {product.mainImage && (
                            <Image src={product.mainImage} alt={product.name} fill className="object-cover" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-gray-900 truncate max-w-[180px]">{product.name}</p>
                          <p className="text-xs text-gray-400">{product.views} visualizzazioni</p>
                        </div>
                        {product.featured && <Star size={12} className="text-sand-500 shrink-0" />}
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">
                      {CATEGORY_LABELS[product.category]}
                    </td>

                    {/* Price */}
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {formatPrice(product.price)}
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3">
                      <StatusBadge status={product.status} />
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        {/* Reorder */}
                        <button onClick={() => moveOrder(product, 'up')}  disabled={idx === 0} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 disabled:opacity-20 transition-colors" aria-label="Sposta su">
                          <ArrowUp size={14} />
                        </button>
                        <button onClick={() => moveOrder(product, 'down')} disabled={idx === filtered.length - 1} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 disabled:opacity-20 transition-colors" aria-label="Sposta giù">
                          <ArrowDown size={14} />
                        </button>

                        {/* Toggle visibility */}
                        <button onClick={() => toggleVisibility(product)} className="p-1.5 rounded-lg text-gray-400 hover:text-teal-600 hover:bg-teal-50 transition-colors" aria-label={product.status === 'hidden' ? 'Pubblica' : 'Nascondi'}>
                          {product.status === 'hidden' ? <Eye size={14} /> : <EyeOff size={14} />}
                        </button>

                        {/* Toggle featured */}
                        <button onClick={() => toggleFeatured(product)} className="p-1.5 rounded-lg text-gray-400 hover:text-sand-500 hover:bg-sand-50 transition-colors" aria-label={product.featured ? 'Rimuovi dall\'evidenza' : 'Metti in evidenza'}>
                          {product.featured ? <Star size={14} className="fill-sand-400 text-sand-400" /> : <StarOff size={14} />}
                        </button>

                        {/* Vinted link */}
                        {product.vintedUrl && (
                          <a href={product.vintedUrl} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg text-gray-400 hover:text-teal-600 hover:bg-teal-50 transition-colors" aria-label="Apri su Vinted">
                            <ExternalLink size={14} />
                          </a>
                        )}

                        {/* Edit */}
                        <Link href={`/admin/catalogo/${product.id}`} className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors" aria-label="Modifica">
                          <Pencil size={14} />
                        </Link>

                        {/* Duplicate */}
                        <button onClick={() => handleDuplicate(product)} className="p-1.5 rounded-lg text-gray-400 hover:text-purple-600 hover:bg-purple-50 transition-colors" aria-label="Duplica">
                          <Copy size={14} />
                        </button>

                        {/* Delete */}
                        <button onClick={() => handleDelete(product)} disabled={deleting === product.id} className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50" aria-label="Elimina">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
