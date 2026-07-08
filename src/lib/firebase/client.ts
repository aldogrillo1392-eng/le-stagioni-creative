'use client'

import React, { useState, useCallback } from 'react'
import Image from 'next/image'
import { useDropzone } from 'react-dropzone'
import toast from 'react-hot-toast'
import { GripVertical, X, Upload, AlertCircle } from 'lucide-react'
import { createProduct, updateProduct } from '@/lib/firebase/products'
import { uploadProductImage, deleteStorageFile } from '@/lib/firebase/storage'
import { cn, toSlug, generateId, CATEGORY_OPTIONS } from '@/lib/utils'
import type { Product, ProductFormData, ProductImage } from '@/types'

interface ProductFormProps {
  product?:   Product
  onSuccess:  (id: string) => void
}

const EMPTY_FORM: ProductFormData = {
  name:        '',
  description: '',
  price:       0,
  category:    'decorazioni',
  status:      'available',
  featured:    false,
  vintedUrl:   '',
  order:       0,
}

export function ProductForm({ product, onSuccess }: ProductFormProps) {
  const isEdit = Boolean(product)

  const [form,      setForm]      = useState<ProductFormData>(
    product
      ? { name: product.name, description: product.description, price: product.price,
          category: product.category, status: product.status, featured: product.featured,
          vintedUrl: product.vintedUrl, order: product.order }
      : EMPTY_FORM
  )
  const [images,    setImages]    = useState<ProductImage[]>(product?.images ?? [])
  const [uploading, setUploading] = useState(false)
  const [saving,    setSaving]    = useState(false)
  const [errors,    setErrors]    = useState<Partial<Record<keyof ProductFormData, string>>>({})

  // ── Image upload ─────────────────────────────────────────────────────────

  const onDrop = useCallback(async (accepted: File[]) => {
    if (accepted.length === 0) return
    setUploading(true)
    const tempId = product?.id ?? `temp-${Date.now()}`

    try {
      const uploaded = await Promise.all(
        accepted.map(async (file) => {
          const id  = generateId()
          const img = await uploadProductImage(tempId, file, id)
          return { ...img, order: images.length }
        })
      )
      setImages(prev => [...prev, ...uploaded].map((img, i) => ({ ...img, order: i })))
      toast.success(`${uploaded.length} ${uploaded.length === 1 ? 'immagine caricata' : 'immagini caricate'}`)
    } catch {
      toast.error('Errore nel caricamento delle immagini')
    } finally {
      setUploading(false)
    }
  }, [images.length, product?.id])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept:   { 'image/*': ['.jpg', '.jpeg', '.png', '.webp', '.avif'] },
    maxFiles: 10,
    disabled: uploading,
  })

  const removeImage = async (img: ProductImage) => {
    setImages(prev => prev.filter(i => i.id !== img.id).map((im, idx) => ({ ...im, order: idx })))
    await deleteStorageFile(img.storagePath)
  }

  const moveImage = (idx: number, dir: 'left' | 'right') => {
    const swap = dir === 'left' ? idx - 1 : idx + 1
    if (swap < 0 || swap >= images.length) return
    const next = [...images]
    ;[next[idx], next[swap]] = [next[swap], next[idx]]
    setImages(next.map((img, i) => ({ ...img, order: i })))
  }

  // ── Validation ────────────────────────────────────────────────────────────

  const validate = (): boolean => {
    const errs: typeof errors = {}
    if (!form.name.trim())         errs.name = 'Il nome è obbligatorio'
    if (!form.description.trim())  errs.description = 'La descrizione è obbligatoria'
    if (form.price <= 0)           errs.price = 'Il prezzo deve essere maggiore di 0'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  // ── Submit ────────────────────────────────────────────────────────────────

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    if (images.length === 0) {
      toast.error('Aggiungi almeno un\'immagine')
      return
    }

    setSaving(true)
    const toastId = toast.loading(isEdit ? 'Salvataggio…' : 'Creazione…')
    const timeout = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Tempo scaduto: Firestore non ha risposto entro 20s. Controlla le regole di sicurezza (email verificata?) o la connessione.')), 20000)
    )
    try {
      const mainImage = images[0]?.url ?? ''

      if (isEdit && product) {
        await Promise.race([updateProduct(product.id, { ...form, images, mainImage }), timeout])
        toast.success('Prodotto aggiornato!', { id: toastId })
        onSuccess(product.id)
      } else {
        const slug = toSlug(form.name)
        const id   = await Promise.race([
          createProduct(form, images.map((img, i) => ({ ...img, order: i })), slug),
          timeout,
        ])
        toast.success('Prodotto creato!', { id: toastId })
        onSuccess(id)
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Errore sconosciuto'
      toast.error(`Errore nel salvataggio: ${message}`, { id: toastId, duration: 8000 })
    } finally {
      setSaving(false)
    }
  }

  // ── Field helpers ─────────────────────────────────────────────────────────

  const field = (key: keyof ProductFormData) => ({
    value:    String(form[key] as string | number),
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const value = e.target.type === 'checkbox'
        ? (e.target as HTMLInputElement).checked
        : e.target.type === 'number' ? parseFloat(e.target.value) || 0
        : e.target.value
      setForm(prev => ({ ...prev, [key]: value }))
      setErrors(prev => ({ ...prev, [key]: undefined }))
    },
  })

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-8">
      {/* ── Basic info ────────────────────────────────────────────────── */}
      <section className="bg-white rounded-3xl shadow-card p-6 space-y-5">
        <h2 className="text-base font-semibold text-gray-900">Informazioni prodotto</h2>

        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">
            Nome <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            type="text"
            required
            {...field('name')}
            onChange={field('name').onChange as React.ChangeEventHandler<HTMLInputElement>}
            className={cn(
              'w-full h-10 px-4 border rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-400',
              errors.name ? 'border-red-300' : 'border-gray-200'
            )}
            placeholder="Es. Portacandela a forma di fiore"
          />
          {errors.name && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={12}/>{errors.name}</p>}
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1.5">
            Descrizione <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            rows={4}
            required
            {...field('description')}
            onChange={field('description').onChange as React.ChangeEventHandler<HTMLTextAreaElement>}
            className={cn(
              'w-full px-4 py-3 border rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 resize-none',
              errors.description ? 'border-red-300' : 'border-gray-200'
            )}
            placeholder="Descrivi il prodotto: materiali, dimensioni, occasioni d'uso…"
          />
          {errors.description && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={12}/>{errors.description}</p>}
        </div>

        {/* Price + Category row */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1.5">
              Prezzo (€) <span className="text-red-500">*</span>
            </label>
            <input
              id="price"
              type="number"
              min="0"
              step="0.01"
              required
              {...field('price')}
              onChange={field('price').onChange as React.ChangeEventHandler<HTMLInputElement>}
              className={cn(
                'w-full h-10 px-4 border rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-400',
                errors.price ? 'border-red-300' : 'border-gray-200'
              )}
            />
            {errors.price && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={12}/>{errors.price}</p>}
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1.5">
              Categoria
            </label>
            <select
              id="category"
              {...field('category')}
              onChange={field('category').onChange as React.ChangeEventHandler<HTMLSelectElement>}
              className="w-full h-10 px-4 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 bg-white"
            >
              {CATEGORY_OPTIONS.filter(c => c.value !== 'all').map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Vinted URL */}
        <div>
          <label htmlFor="vintedUrl" className="block text-sm font-medium text-gray-700 mb-1.5">
            Link Vinted
          </label>
          <input
            id="vintedUrl"
            type="url"
            {...field('vintedUrl')}
            onChange={field('vintedUrl').onChange as React.ChangeEventHandler<HTMLInputElement>}
            className="w-full h-10 px-4 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
            placeholder="https://www.vinted.it/items/..."
          />
        </div>
      </section>

      {/* ── Images ────────────────────────────────────────────────────── */}
      <section className="bg-white rounded-3xl shadow-card p-6 space-y-4">
        <h2 className="text-base font-semibold text-gray-900">Immagini</h2>
        <p className="text-xs text-gray-500">La prima immagine sarà quella principale. Trascina per riordinare.</p>

        {/* Drop zone */}
        <div
          {...getRootProps()}
          className={cn(
            'border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-colors',
            isDragActive ? 'border-teal-400 bg-teal-50' : 'border-gray-200 hover:border-teal-300',
            uploading && 'opacity-50 cursor-wait'
          )}
        >
          <input {...getInputProps()} aria-label="Carica immagini" />
          <Upload className="mx-auto text-gray-400 mb-2" size={28} />
          <p className="text-sm text-gray-600 font-medium">
            {isDragActive ? 'Rilascia le immagini' : 'Trascina le immagini o clicca per selezionarle'}
          </p>
          <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP — max 10 MB per file. Auto-compresse in WebP.</p>
          {uploading && <p className="text-sm text-teal-600 mt-2 animate-pulse">Caricamento in corso…</p>}
        </div>

        {/* Preview grid */}
        {images.length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {images.map((img, idx) => (
              <div key={img.id} className="relative group">
                <div className={cn(
                  'aspect-square rounded-xl overflow-hidden',
                  idx === 0 && 'ring-2 ring-teal-500'
                )}>
                  <Image src={img.url} alt={img.alt ?? ''} fill className="object-cover" />
                </div>
                {idx === 0 && (
                  <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-teal-500 text-white text-2xs px-1.5 py-0.5 rounded-full whitespace-nowrap">
                    Principale
                  </span>
                )}
                {/* Remove button */}
                <button
                  type="button"
                  onClick={() => removeImage(img)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Rimuovi immagine"
                >
                  <X size={12} />
                </button>
                {/* Reorder */}
                <div className="absolute bottom-1 inset-x-1 flex justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                  <button type="button" onClick={() => moveImage(idx, 'left')} disabled={idx === 0} className="bg-white/90 rounded-lg p-0.5 text-gray-600 disabled:opacity-0">
                    ←
                  </button>
                  <button type="button" onClick={() => moveImage(idx, 'right')} disabled={idx === images.length - 1} className="bg-white/90 rounded-lg p-0.5 text-gray-600 disabled:opacity-0">
                    →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── Options ───────────────────────────────────────────────────── */}
      <section className="bg-white rounded-3xl shadow-card p-6 space-y-4">
        <h2 className="text-base font-semibold text-gray-900">Opzioni</h2>

        <div className="grid sm:grid-cols-3 gap-4">
          {/* Status */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1.5">Stato</label>
            <select
              id="status"
              {...field('status')}
              onChange={field('status').onChange as React.ChangeEventHandler<HTMLSelectElement>}
              className="w-full h-10 px-4 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 bg-white"
            >
              <option value="available">Disponibile</option>
              <option value="sold">Venduto</option>
              <option value="hidden">Nascosto</option>
            </select>
          </div>

          {/* Order */}
          <div>
            <label htmlFor="order" className="block text-sm font-medium text-gray-700 mb-1.5">Ordine</label>
            <input
              id="order"
              type="number"
              min="0"
              {...field('order')}
              onChange={field('order').onChange as React.ChangeEventHandler<HTMLInputElement>}
              className="w-full h-10 px-4 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
          </div>

          {/* Featured */}
          <div className="flex items-end pb-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={e => setForm(prev => ({ ...prev, featured: e.target.checked }))}
                className="w-4 h-4 accent-teal-500"
              />
              <span className="text-sm font-medium text-gray-700">In evidenza</span>
            </label>
          </div>
        </div>
      </section>

      {/* ── Submit ────────────────────────────────────────────────────── */}
      <div className="flex gap-3 justify-end">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="px-5 py-2.5 rounded-2xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
        >
          Annulla
        </button>
        <button
          type="submit"
          disabled={saving || uploading}
          className="px-6 py-2.5 rounded-2xl bg-teal-500 hover:bg-teal-600 text-white text-sm font-medium shadow-brand-sm transition-colors disabled:opacity-50"
        >
          {saving ? 'Salvataggio…' : isEdit ? 'Aggiorna prodotto' : 'Crea prodotto'}
        </button>
      </div>
    </form>
  )
}
