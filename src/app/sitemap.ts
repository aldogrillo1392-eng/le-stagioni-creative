import type { MetadataRoute } from 'next'
import { getAllProducts } from '@/lib/firebase/products'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://lestagionicreative.it'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL,               lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
    { url: `${BASE_URL}/catalogo`, lastModified: new Date(), changeFrequency: 'daily',  priority: 0.9 },
  ]

  let productPages: MetadataRoute.Sitemap = []
  try {
    const products = await getAllProducts()
    productPages = products
      .filter(p => p.status !== 'hidden')
      .map(p => ({
        url:             `${BASE_URL}/prodotto/${p.slug}`,
        lastModified:    new Date(p.updatedAt),
        changeFrequency: 'weekly' as const,
        priority:        0.8,
      }))
  } catch {
    // Firestore not reachable at build time → static pages only
  }

  return [...staticPages, ...productPages]
}
