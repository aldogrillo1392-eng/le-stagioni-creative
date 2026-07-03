'use client'

import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { getPublicProducts, getFeaturedProducts, getNewestProducts } from '@/lib/firebase/products'
import type { Product, CatalogFilters } from '@/types'
import { debounce } from '@/lib/utils'

// ─── useFilteredProducts ─────────────────────────────────────────────────────

export function useFilteredProducts(filters: CatalogFilters) {
  const [products, setProducts]   = useState<Product[]>([])
  const [loading,  setLoading]    = useState(true)
  const [error,    setError]      = useState<string | null>(null)

  // Debounce only the text query; categories/sort fire immediately
  const debouncedQuery = useDebouncedValue(filters.query, 300)

  const effectiveFilters = useMemo(
    () => ({ ...filters, query: debouncedQuery }),
    [filters, debouncedQuery]
  )

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getPublicProducts(effectiveFilters)
      setProducts(data)
    } catch {
      setError('Impossibile caricare i prodotti. Riprova.')
    } finally {
      setLoading(false)
    }
  }, [effectiveFilters])

  useEffect(() => { fetchProducts() }, [fetchProducts])

  return { products, loading, error, refresh: fetchProducts }
}

// ─── useFeaturedProducts ──────────────────────────────────────────────────────

export function useFeaturedProducts(maxItems = 6) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    getFeaturedProducts(maxItems)
      .then(setProducts)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [maxItems])

  return { products, loading }
}

// ─── useNewestProducts ────────────────────────────────────────────────────────

export function useNewestProducts(maxItems = 4) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    getNewestProducts(maxItems)
      .then(setProducts)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [maxItems])

  return { products, loading }
}

// ─── Shared debounce helper ───────────────────────────────────────────────────

function useDebouncedValue<T>(value: T, ms: number): T {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), ms)
    return () => clearTimeout(t)
  }, [value, ms])

  return debounced
}
