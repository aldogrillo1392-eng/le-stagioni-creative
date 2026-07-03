import type { Metadata, Viewport } from 'next'
import { Cormorant_Garamond, Inter } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from '@/hooks/useAuth'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import '@/styles/globals.css'

// ─── Fonts ────────────────────────────────────────────────────────────────────

const cormorant = Cormorant_Garamond({
  subsets:  ['latin'],
  weight:   ['300', '400', '500', '600', '700'],
  style:    ['normal', 'italic'],
  variable: '--font-cormorant',
  display:  'swap',
})

const inter = Inter({
  subsets:  ['latin'],
  variable: '--font-inter',
  display:  'swap',
})

// ─── Metadata ─────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://lestagionicreative.it'),
  title: {
    default:  'Le Stagioni Creative — Creazioni artigianali fatte con amore',
    template: '%s | Le Stagioni Creative',
  },
  description: 'Scopri le creazioni artigianali di Le Stagioni Creative: decorazioni, portacandele, oggettistica e idee regalo uniche realizzate a mano con cura e passione.',
  keywords: ['artigianato', 'decorazioni', 'portacandele', 'handmade', 'Vinted', 'idee regalo', 'Le Stagioni Creative'],
  authors: [{ name: 'Le Stagioni Creative' }],
  creator: 'Le Stagioni Creative',
  openGraph: {
    type:        'website',
    locale:      'it_IT',
    siteName:    'Le Stagioni Creative',
    title:       'Le Stagioni Creative — Creazioni artigianali',
    description: 'Oggetti unici realizzati a mano per rendere speciale ogni momento.',
    images: [{ url: '/images/og-cover.jpg', width: 1200, height: 630 }],
  },
  twitter: {
    card:        'summary_large_image',
    title:       'Le Stagioni Creative',
    description: 'Creazioni artigianali fatte con amore.',
  },
  robots: { index: true, follow: true },
  manifest: '/manifest.json',
  icons: {
    icon:  [{ url: '/icons/favicon-32.png', sizes: '32x32' }, { url: '/icons/favicon-16.png', sizes: '16x16' }],
    apple: '/icons/apple-touch-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor:          '#2fa5a5',
  width:               'device-width',
  initialScale:        1,
  viewportFit:         'cover',
}

// ─── Root Layout ──────────────────────────────────────────────────────────────

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it" className={`${cormorant.variable} ${inter.variable}`}>
      <body className="bg-cream font-body text-gray-800 antialiased min-h-screen flex flex-col">
        <AuthProvider>
          <Header />
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <Footer />
        </AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#1f2937',
              color:      '#f9fafb',
              borderRadius: '1rem',
              fontSize: '0.875rem',
            },
            success: { iconTheme: { primary: '#2fa5a5', secondary: '#fff' } },
          }}
        />
      </body>
    </html>
  )
}
