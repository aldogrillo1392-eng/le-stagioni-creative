'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ExternalLink } from 'lucide-react'
import { cn, formatPrice, CATEGORY_LABELS } from '@/lib/utils'
import type { Product } from '@/types'

interface ProductCardProps {
  product:   Product
  priority?: boolean
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const isSold    = product.status === 'sold'
  const imgSrc    = product.mainImage || '/images/placeholder.jpg'
  const href      = `/prodotto/${product.slug}`

  return (
    <article
      className={cn(
        'group bg-white rounded-3xl overflow-hidden',
        'shadow-card hover:shadow-card-hover',
        'transition-all duration-300',
        'flex flex-col'
      )}
    >
      {/* Image */}
      <Link href={href} className="block relative overflow-hidden aspect-square">
        <Image
          src={imgSrc}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className={cn(
            'object-cover transition-transform duration-500 group-hover:scale-105',
            isSold && 'grayscale opacity-70'
          )}
          priority={priority}
        />

        {/* Status badge */}
        {isSold && (
          <span className="absolute top-3 left-3 bg-gray-700 text-white text-xs font-medium px-2.5 py-1 rounded-full">
            Venduto
          </span>
        )}
        {product.featured && !isSold && (
          <span className="absolute top-3 left-3 bg-teal-500 text-white text-xs font-medium px-2.5 py-1 rounded-full">
            In evidenza ✦
          </span>
        )}
      </Link>

      {/* Info */}
      <div className="flex flex-col gap-2 p-4 flex-1">
        <span className="text-2xs font-medium text-teal-600 uppercase tracking-widest">
          {CATEGORY_LABELS[product.category]}
        </span>

        <Link href={href}>
          <h3 className="font-display text-lg text-gray-800 leading-snug group-hover:text-teal-600 transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>

        <p className="text-sm text-gray-500 line-clamp-2 flex-1">
          {product.description}
        </p>

                <div className="flex items-center justify-between mt-auto pt-2">
          {product.price > 0 && (
            <span className="font-display text-xl font-semibold text-gray-900">
              {formatPrice(product.price)}
            </span>
          )}

          {!isSold && product.vintedUrl && (
            <a
              href={product.vintedUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              className={cn(
                'inline-flex items-center gap-1.5 text-sm font-medium',
                'bg-teal-500 hover:bg-teal-600 text-white',
                'px-3 py-1.5 rounded-xl',
                'transition-colors duration-200',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400'
              )}
              aria-label={`Acquista ${product.name} su Vinted`}
            >
              Vinted
              <ExternalLink size={12} />
            </a>
          )}
        </div>
      </div>
    </article>
  )
}

// ─── Skeleton loader ──────────────────────────────────────────────────────────

export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-card">
      <div className="aspect-square bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 animate-shimmer bg-[length:200%_100%]" />
      <div className="p-4 space-y-2">
        <div className="h-3 w-20 bg-gray-100 rounded-full animate-pulse" />
        <div className="h-5 w-3/4 bg-gray-100 rounded-full animate-pulse" />
        <div className="h-4 w-full  bg-gray-100 rounded-full animate-pulse" />
        <div className="h-4 w-2/3  bg-gray-100 rounded-full animate-pulse" />
        <div className="flex justify-between pt-2">
          <div className="h-6 w-16 bg-gray-100 rounded-full animate-pulse" />
          <div className="h-8 w-20 bg-gray-100 rounded-xl animate-pulse" />
        </div>
      </div>
    </div>
  )
}
