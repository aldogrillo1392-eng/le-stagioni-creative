'use client'

import { useState, useEffect, useCallback } from 'react'
import { getAllProducts } from '@/lib/firebase/products'
import type { Product } from '@/types'

export function useAllProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getAllProducts()
      setProducts(data)
    } catch {
      setError('Impossibile caricare il catalogo.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  return { products, setProducts, loading, error, refresh: load }
}
