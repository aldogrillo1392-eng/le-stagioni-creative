import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center text-center px-4">
      <div className="w-20 h-20 bg-acqua-gradient rounded-full flex items-center justify-center mx-auto mb-8 shadow-elevated">
        <span className="font-display text-white text-2xl font-light">404</span>
      </div>
      <h1 className="font-display text-display-lg text-grigio-antracite mb-4">
        Pagina non trovata
      </h1>
      <p className="font-body text-sm text-grigio-scuro mb-8 max-w-sm">
        La pagina che cerchi non esiste o è stata spostata.
        Torna al catalogo per scoprire tutte le creazioni.
      </p>
      <div className="flex gap-3">
        <Link href="/" className="btn-secondary">← Home</Link>
        <Link href="/catalogo" className="btn-primary">Sfoglia il catalogo</Link>
      </div>
    </div>
  )
}
