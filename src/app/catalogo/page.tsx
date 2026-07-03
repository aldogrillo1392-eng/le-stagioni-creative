'use client'

import React, { useState } from 'react'
import { ProductCard, ProductCardSkeleton } from '@/components/catalog/ProductCard'
import { FiltersBar } from '@/components/catalog/FiltersBar'
import { useFilteredProducts } from '@/hooks/useProducts'
import type { CatalogFilters } from '@/types'

const DEFAULT_FILTERS: CatalogFilters = {
  query:    '',
  category: 'all',
  status:   'all',
  sort:     'newest',
}

export default function CatalogoPage() {
  const [filters, setFilters] = useState<CatalogFilters>(DEFAULT_FILTERS)
  const { products, loading, error } = useFilteredProducts(filters)

  const updateFilters = (partial: Partial<CatalogFilters>) => {
    setFilters(prev => ({ ...prev, ...partial }))
  }

  return (
    <div className="section space-y-8">
      {/* Header */}
      <div>
        <h1 className="section-title">Catalogo</h1>
        <div className="divider" />
        <p className="text-gray-500 mt-2">
          Tutte le nostre creazioni artigianali, disponibili su Vinted.
        </p>
      </div>

      {/* Filters */}
      <FiltersBar
        filters={filters}
        onChange={updateFilters}
        totalCount={products.length}
      />

      {/* Products grid */}
      {error ? (
        <div className="text-center py-16 text-red-500">{error}</div>
      ) : loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-4xl mb-4">🔍</p>
          <h2 className="font-display text-2xl text-gray-700 mb-2">Nessun articolo trovato</h2>
          <p className="text-gray-400 text-sm">
            Prova a modificare i filtri o la ricerca.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {products.map((product, i) => (
            <ProductCard key={product.id} product={product} priority={i < 4} />
          ))}
        </div>
      )}
    </div>
  )
}
