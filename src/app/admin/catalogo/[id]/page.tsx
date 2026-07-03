'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getProductById } from '@/lib/firebase/products'
import { ProductForm } from '@/components/admin/ProductForm'
import type { Product } from '@/types'

interface Props {
  params: { id: string }
}

export default function EditProductPage({ params }: Props) {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    getProductById(params.id)
      .then(setProduct)
      .finally(() => setLoading(false))
  }, [params.id])

  if (loading) return <div className="p-6 text-gray-400">Caricamento…</div>
  if (!product) return <div className="p-6 text-red-500">Prodotto non trovato.</div>

  return (
    <div className="p-6 max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Modifica articolo</h1>
        <p className="text-sm text-gray-500 mt-0.5 truncate">{product.name}</p>
      </div>
      <ProductForm product={product} onSuccess={() => router.push('/admin/catalogo')} />
    </div>
  )
}
