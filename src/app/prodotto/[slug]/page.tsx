import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getProductBySlug, getAllProducts, incrementProductViews } from '@/lib/firebase/products'
import { ProductDetail } from '@/components/catalog/ProductDetail'

interface Props {
  params: { slug: string }
}

// Static generation for all products
export async function generateStaticParams() {
  try {
    const products = await getAllProducts()
    return products.map(p => ({ slug: p.slug }))
  } catch {
    return []
  }
}

export const revalidate = 60

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProductBySlug(params.slug)
  if (!product) return { title: 'Prodotto non trovato' }

  const title       = `${product.name} — Le Stagioni Creative`
  const description = product.description.slice(0, 160)
  const image       = product.mainImage

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type:   'website',
      images: image ? [{ url: image, width: 800, height: 800, alt: product.name }] : [],
    },
    twitter: { card: 'summary_large_image', title, description },
  }
}

export default async function ProductPage({ params }: Props) {
  const product = await getProductBySlug(params.slug)
  if (!product) notFound()

  // Increment views (fire and forget)
  incrementProductViews(product.id)

  return (
    <>
      {/* JSON-LD Schema.org */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context':   'https://schema.org',
            '@type':      'Product',
            name:         product.name,
            description:  product.description,
            image:        product.mainImage,
            offers: {
              '@type':       'Offer',
              price:         product.price.toFixed(2),
              priceCurrency: 'EUR',
              availability:
                product.status === 'available'
                  ? 'https://schema.org/InStock'
                  : 'https://schema.org/SoldOut',
              url: product.vintedUrl,
            },
          }),
        }}
      />
      <ProductDetail product={product} />
    </>
  )
}
