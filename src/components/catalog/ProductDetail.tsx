'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, ExternalLink, ChevronLeft, ChevronRight, Share2, CheckCircle2 } from 'lucide-react'
import { cn, formatPrice, formatDate, CATEGORY_LABELS } from '@/lib/utils'
import type { Product } from '@/types'

interface ProductDetailProps {
  product: Product
}

export function ProductDetail({ product }: ProductDetailProps) {
  const [activeIdx, setActiveIdx] = useState(0)
  const [copied,    setCopied]    = useState(false)
  const isSold = product.status === 'sold'
  const images = product.images.length > 0 ? product.images : [{ id: '0', url: product.mainImage, alt: product.name }]

  const prev = () => setActiveIdx(i => (i - 1 + images.length) % images.length)
  const next = () => setActiveIdx(i => (i + 1) % images.length)

  const share = async () => {
    const url = window.location.href
    if (navigator.share) {
      await navigator.share({ title: product.name, url })
    } else {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="section">
      {/* Back link */}
      <Link
        href="/catalogo"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-teal-600 mb-8 transition-colors"
      >
        <ArrowLeft size={16} />
        Torna al catalogo
      </Link>

      <div className="grid md:grid-cols-2 gap-10 lg:gap-16 items-start">
        {/* ── Gallery ───────────────────────────────────────────────────── */}
        <div className="space-y-3">
          {/* Main image */}
          <div className="relative aspect-square rounded-3xl overflow-hidden bg-white shadow-card group">
            {images[activeIdx]?.url && (
              <Image
                src={images[activeIdx].url}
                alt={images[activeIdx].alt ?? product.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className={cn('object-cover', isSold && 'grayscale opacity-70')}
                priority
              />
            )}
            {isSold && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="bg-gray-900/70 text-white text-lg font-semibold px-6 py-3 rounded-2xl backdrop-blur-sm">
                  Venduto
                </span>
              </div>
            )}
            {images.length > 1 && (
              <>
                <button
                  onClick={prev}
                  className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-xl shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Immagine precedente"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={next}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-xl shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Immagine successiva"
                >
                  <ChevronRight size={18} />
                </button>
              </>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {images.map((img, idx) => (
                <button
                  key={img.id}
                  onClick={() => setActiveIdx(idx)}
                  className={cn(
                    'relative shrink-0 w-16 h-16 rounded-xl overflow-hidden transition-all',
                    activeIdx === idx
                      ? 'ring-2 ring-teal-500 ring-offset-1'
                      : 'opacity-60 hover:opacity-100'
                  )}
                  aria-label={`Immagine ${idx + 1}`}
                  aria-pressed={activeIdx === idx}
                >
                  <Image src={img.url} alt={img.alt ?? ''} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Info ──────────────────────────────────────────────────────── */}
        <div className="space-y-6">
          {/* Category + share */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-teal-600 uppercase tracking-widest">
              {CATEGORY_LABELS[product.category]}
            </span>
            <button
              onClick={share}
              className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-teal-600 transition-colors"
              aria-label="Condividi prodotto"
            >
              {copied ? <CheckCircle2 size={16} className="text-teal-500" /> : <Share2 size={16} />}
              {copied ? 'Link copiato!' : 'Condividi'}
            </button>
          </div>

          <h1 className="font-display text-3xl md:text-4xl text-gray-900 leading-tight">
            {product.name}
          </h1>

          <div className="font-display text-4xl font-semibold text-teal-600">
            {formatPrice(product.price)}
          </div>

          {/* Status badge */}
          <div className="flex items-center gap-2">
            <span
              className={cn(
                'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium',
                isSold
                  ? 'bg-gray-100 text-gray-600'
                  : 'bg-teal-50 text-teal-700'
              )}
            >
              <span className={cn('w-2 h-2 rounded-full', isSold ? 'bg-gray-400' : 'bg-teal-500')} />
              {isSold ? 'Non disponibile' : 'Disponibile'}
            </span>
          </div>

          {/* Description */}
          <div className="border-t border-gray-100 pt-6">
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3">
              Descrizione
            </h2>
            <p className="text-gray-600 leading-relaxed whitespace-pre-line">
              {product.description}
            </p>
          </div>

          {/* CTA */}
          {!isSold && product.vintedUrl && (
            <a
              href={product.vintedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                'w-full inline-flex items-center justify-center gap-2',
                'bg-teal-500 hover:bg-teal-600 text-white',
                'py-4 px-6 rounded-2xl text-base font-semibold',
                'shadow-brand hover:shadow-brand-lg',
                'transition-all duration-200 hover:-translate-y-0.5',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:ring-offset-2'
              )}
              aria-label={`Acquista ${product.name} su Vinted`}
            >
              <ExternalLink size={18} />
              Acquista su Vinted
            </a>
          )}

          {isSold && (
            <div className="bg-gray-50 rounded-2xl p-4 text-center text-sm text-gray-500">
              Questo articolo è stato venduto. Dai un'occhiata agli altri prodotti nel catalogo!
            </div>
          )}

          {/* Meta */}
          <p className="text-xs text-gray-400">
            Aggiunto il {formatDate(product.createdAt)}
          </p>
        </div>
      </div>
    </div>
  )
}
