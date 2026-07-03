'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'
import { getAllProducts } from '@/lib/firebase/products'
import { createProduct } from '@/lib/firebase/products'
import { toSlug } from '@/lib/utils'
import type { Product, ProductFormData } from '@/types'

/**
 * Backup utility — available inside the Impostazioni page.
 * Export produces a .json file with all Firestore product data.
 * Import re-creates products from a backup file (images not included).
 */
export function BackupPanel() {
  const [importing, setImporting] = useState(false)

  // ── Export ───────────────────────────────────────────────────────────────
  const exportCatalog = async () => {
    const toastId = toast.loading('Esportazione catalogo…')
    try {
      const products = await getAllProducts()
      const json = JSON.stringify(products, null, 2)
      const url  = URL.createObjectURL(new Blob([json], { type: 'application/json' }))
      const a    = Object.assign(document.createElement('a'), {
        href:     url,
        download: `catalogo-backup-${new Date().toISOString().slice(0, 10)}.json`,
      })
      a.click()
      URL.revokeObjectURL(url)
      toast.success(`${products.length} prodotti esportati`, { id: toastId })
    } catch {
      toast.error('Errore nell\'esportazione', { id: toastId })
    }
  }

  // ── Import ───────────────────────────────────────────────────────────────
  const importCatalog = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!window.confirm(
      'L\'importazione creerà nuovi prodotti a partire dal backup. Continuare?'
    )) return

    setImporting(true)
    const toastId = toast.loading('Importazione…')
    try {
      const text     = await file.text()
      const products = JSON.parse(text) as Product[]
      let   count    = 0

      for (const p of products) {
        const formData: ProductFormData = {
          name:        p.name,
          description: p.description,
          price:       p.price,
          category:    p.category,
          status:      'hidden', // import as hidden for safety
          featured:    p.featured,
          vintedUrl:   p.vintedUrl,
          order:       p.order,
        }
        const slug = `${toSlug(p.name)}-import-${Date.now()}`
        await createProduct(formData, p.images, slug)
        count++
      }

      toast.success(
        `${count} prodotti importati (stati impostati su "Nascosto" per sicurezza)`,
        { id: toastId, duration: 5000 }
      )
    } catch {
      toast.error('Errore nell\'importazione — verifica il formato del file', { id: toastId })
    } finally {
      setImporting(false)
      e.target.value = ''
    }
  }

  return (
    <section className="bg-white rounded-3xl shadow-card p-6 space-y-4">
      <div>
        <h2 className="font-semibold text-gray-900">Backup catalogo</h2>
        <p className="text-xs text-gray-500 mt-0.5">
          Esporta tutti i prodotti in un file JSON. Puoi reimportarlo in futuro per ripristinare i dati.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        {/* Export */}
        <button
          onClick={exportCatalog}
          className="inline-flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-2xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          ⬇︎ Esporta catalogo (.json)
        </button>

        {/* Import */}
        <label className={`inline-flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-2xl text-sm font-medium transition-colors cursor-pointer ${importing ? 'opacity-50 cursor-wait' : 'text-gray-700 hover:bg-gray-50'}`}>
          <input
            type="file"
            accept=".json"
            className="hidden"
            onChange={importCatalog}
            disabled={importing}
          />
          {importing ? 'Importazione…' : '⬆︎ Importa backup (.json)'}
        </label>
      </div>

      <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
        ⚠️ Le immagini non sono incluse nel backup JSON. Vengono mantenute solo le URL già caricate su Firebase Storage.
      </p>
    </section>
  )
}
