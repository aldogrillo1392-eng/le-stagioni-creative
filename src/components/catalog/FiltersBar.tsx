'use client'

import React from 'react'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { cn, CATEGORY_OPTIONS } from '@/lib/utils'
import type { CatalogFilters, SortOption, StatusFilter, ProductCategory } from '@/types'

interface FiltersBarProps {
  filters:    CatalogFilters
  onChange:   (f: Partial<CatalogFilters>) => void
  totalCount: number
}

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'newest',     label: 'Più recenti' },
  { value: 'price-asc',  label: 'Prezzo ↑' },
  { value: 'price-desc', label: 'Prezzo ↓' },
]

const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: 'all',       label: 'Tutti' },
  { value: 'available', label: 'Disponibili' },
  { value: 'sold',      label: 'Venduti' },
]

export function FiltersBar({ filters, onChange, totalCount }: FiltersBarProps) {
  const hasActiveFilters =
    filters.query !== '' ||
    filters.category !== 'all' ||
    filters.status !== 'all' ||
    filters.sort !== 'newest'

  return (
    <div className="space-y-4">
      {/* Search + sort row */}
      <div className="flex gap-3 flex-wrap">
        {/* Search input */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="search"
            placeholder="Cerca articoli…"
            value={filters.query}
            onChange={e => onChange({ query: e.target.value })}
            className={cn(
              'w-full h-10 pl-9 pr-4 rounded-2xl',
              'border border-gray-200 bg-white',
              'text-sm text-gray-800 placeholder:text-gray-400',
              'focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent',
              'transition-shadow'
            )}
            aria-label="Cerca nel catalogo"
          />
          {filters.query && (
            <button
              onClick={() => onChange({ query: '' })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              aria-label="Cancella ricerca"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Sort */}
        <select
          value={filters.sort}
          onChange={e => onChange({ sort: e.target.value as SortOption })}
          className={cn(
            'h-10 px-3 rounded-2xl',
            'border border-gray-200 bg-white',
            'text-sm text-gray-700',
            'focus:outline-none focus:ring-2 focus:ring-teal-400',
            'cursor-pointer'
          )}
          aria-label="Ordina per"
        >
          {SORT_OPTIONS.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      {/* Category pills */}
      <div className="flex gap-2 flex-wrap" role="group" aria-label="Filtra per categoria">
        {CATEGORY_OPTIONS.map(opt => (
          <button
            key={opt.value}
            onClick={() => onChange({ category: opt.value as ProductCategory | 'all' })}
            className={cn(
              'px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200',
              filters.category === opt.value
                ? 'bg-teal-500 text-white shadow-brand-sm'
                : 'bg-white border border-gray-200 text-gray-600 hover:border-teal-300 hover:text-teal-600'
            )}
            aria-pressed={filters.category === opt.value}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Status pills */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex gap-2" role="group" aria-label="Filtra per stato">
          {STATUS_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => onChange({ status: opt.value })}
              className={cn(
                'px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200',
                filters.status === opt.value
                  ? 'bg-gray-800 text-white'
                  : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-400'
              )}
              aria-pressed={filters.status === opt.value}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Result count */}
        <span className="ml-auto text-sm text-gray-500">
          {totalCount} {totalCount === 1 ? 'articolo' : 'articoli'}
        </span>

        {/* Clear all */}
        {hasActiveFilters && (
          <button
            onClick={() => onChange({ query: '', category: 'all', status: 'all', sort: 'newest' })}
            className="flex items-center gap-1 text-sm text-teal-600 hover:text-teal-700 font-medium"
          >
            <X size={14} />
            Azzera filtri
          </button>
        )}
      </div>
    </div>
  )
}
