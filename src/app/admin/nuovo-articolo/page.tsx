'use client'

import { useRouter } from 'next/navigation'
import { ProductForm } from '@/components/admin/ProductForm'

export default function NuovoArticoloPage() {
  const router = useRouter()

  return (
    <div className="p-6 max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Nuovo articolo</h1>
        <p className="text-sm text-gray-500 mt-0.5">Compila il modulo per aggiungere un nuovo prodotto al catalogo.</p>
      </div>
      <ProductForm onSuccess={id => router.push('/admin/catalogo')} />
    </div>
  )
}
