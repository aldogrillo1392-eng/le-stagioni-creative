import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Instagram, Sparkles } from 'lucide-react'
import { getFeaturedProducts, getNewestProducts } from '@/lib/firebase/products'
import { ProductCard, ProductCardSkeleton } from '@/components/catalog/ProductCard'
import { CATEGORY_OPTIONS, CATEGORY_LABELS } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Home',
  description: 'Scopri le creazioni artigianali di Le Stagioni Creative: decorazioni, portacandele, oggetti unici fatti a mano.',
}

// Revalidate every 60 seconds (ISR)
export const revalidate = 60

export default async function HomePage() {
  const [featured, newest] = await Promise.all([
    getFeaturedProducts(6).catch(() => []),
    getNewestProducts(4).catch(() => []),
  ])

  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section
        className="relative min-h-[85vh] flex items-center overflow-hidden"
        aria-labelledby="hero-title"
        style={{ background: 'linear-gradient(160deg, #FAF8F4 0%, #f0fafa 60%, #d9f2f2 100%)' }}
      >
        {/* Decorative blobs */}
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full bg-teal-100/40 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-[400px] h-[400px] rounded-full bg-sand-100/60 blur-3xl" />
        </div>

        <div className="section relative z-10 grid md:grid-cols-2 gap-12 items-center py-20">
          {/* Text */}
          <div className="space-y-6 animate-fade-up">
            <div className="inline-flex items-center gap-2 bg-teal-50 text-teal-700 px-3 py-1.5 rounded-full text-sm font-medium">
              <Sparkles size={14} />
              Creazioni artigianali fatte a mano
            </div>

            <h1
              id="hero-title"
              className="font-display text-4xl sm:text-5xl md:text-6xl text-gray-900 leading-[1.1] text-balance"
            >
              Benvenuta nel<br />
              <em className="not-italic text-teal-500">laboratorio</em><br />
              creativo
            </h1>

            <p className="text-lg text-gray-500 max-w-md leading-relaxed">
              Oggetti unici realizzati con cura e passione, per rendere speciale ogni stagione della vita.
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                href="/catalogo"
                className="inline-flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white px-6 py-3 rounded-2xl font-medium shadow-brand transition-all hover:-translate-y-0.5"
              >
                Sfoglia il catalogo
                <ArrowRight size={18} />
              </Link>
              <a
                href="https://www.instagram.com/jmlestagionicreative13"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white border border-gray-200 hover:border-pink-300 text-gray-700 hover:text-pink-600 px-6 py-3 rounded-2xl font-medium transition-all hover:-translate-y-0.5"
              >
                <Instagram size={18} />
                Seguici su Instagram
              </a>
            </div>
          </div>

{/* Hero logo */}
<div className="flex justify-center animate-fade-in" aria-hidden="true">
  <div className="relative w-56 h-56 md:w-72 md:h-72">
    <Image
      src="/images/logo.png"
      alt="Le Stagioni Creative"
      fill
      className="object-contain drop-shadow-md"
      priority
    />
  </div>
</div>
        </div>
      </section>

      {/* ── Novità ────────────────────────────────────────────────────────── */}
      {newest.length > 0 && (
        <section className="section" aria-labelledby="novita-title">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 id="novita-title" className="section-title">Novità</h2>
              <div className="divider" />
            </div>
            <Link href="/catalogo?sort=newest" className="text-sm text-teal-600 hover:text-teal-700 font-medium flex items-center gap-1">
              Vedi tutte <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {newest.map((product, i) => (
              <ProductCard key={product.id} product={product} priority={i < 2} />
            ))}
          </div>
        </section>
      )}

      {/* ── Categorie ─────────────────────────────────────────────────────── */}
      <section className="section bg-panna rounded-4xl mx-4 sm:mx-6" aria-labelledby="categorie-title">
        <h2 id="categorie-title" className="section-title mb-2">Categorie</h2>
        <div className="divider mb-8" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {CATEGORY_OPTIONS.filter(c => c.value !== 'all').map(cat => (
            <Link
              key={cat.value}
              href={`/catalogo?category=${cat.value}`}
              className="group flex flex-col items-center gap-2 p-4 bg-white rounded-2xl hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200 text-center"
            >
              <span className="text-2xl">{getCategoryEmoji(cat.value)}</span>
              <span className="text-sm font-medium text-gray-700 group-hover:text-teal-600 transition-colors">
                {cat.label.replace(/ [^\w\s].*/, '')}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── In evidenza ───────────────────────────────────────────────────── */}
      {featured.length > 0 && (
        <section className="section" aria-labelledby="evidenza-title">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 id="evidenza-title" className="section-title">Articoli in evidenza</h2>
              <div className="divider" />
            </div>
            <Link href="/catalogo" className="text-sm text-teal-600 hover:text-teal-700 font-medium flex items-center gap-1">
              Tutto il catalogo <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {featured.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* ── CTA Instagram ─────────────────────────────────────────────────── */}
      <section className="section">
        <div className="bg-gradient-to-br from-pink-50 to-purple-50 border border-pink-100 rounded-4xl p-8 md:p-12 text-center space-y-4">
          <Instagram size={36} className="text-pink-500 mx-auto" />
          <h2 className="font-display text-3xl text-gray-900">Seguici su Instagram</h2>
          <p className="text-gray-500 max-w-md mx-auto">
            Guarda le nostre creazioni in anteprima, dietro le quinte e tante idee regalo originali.
          </p>
          <a
            href="https://www.instagram.com/jmlestagionicreative13"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-2xl font-medium shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5"
          >
            <Instagram size={18} />
            @jmlestagionicreative13
          </a>
        </div>
      </section>
    </>
  )
}

function getCategoryEmoji(value: string): string {
  const map: Record<string, string> = {
    decorazioni:   '🏡',
    portacandele:  '🕯️',
    oggettistica:  '✨',
    natale:        '🎄',
    pasqua:        '🐣',
    autunno:       '🍂',
    primavera:     '🌸',
    estate:        '☀️',
    'idee-regalo': '🎁',
    altre:         '🔮',
  }
  return map[value] ?? '✨'
}
