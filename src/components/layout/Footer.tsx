import React from 'react'
import Link from 'next/link'
import { Instagram, ExternalLink, Heart } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-10">

          {/* Brand column */}
          <div className="space-y-3">
            <h3 className="font-display text-2xl text-white">Le Stagioni Creative</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Oggetti artigianali unici, realizzati con cura e passione per rendere speciale ogni momento.
            </p>
          </div>

          {/* Navigation */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Naviga</h4>
            <ul className="space-y-2">
              {[
                { href: '/',         label: 'Home' },
                { href: '/catalogo', label: 'Catalogo' },
              ].map(link => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-teal-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Trovaci su</h4>
            <div className="space-y-2">
              <a
                href="https://www.instagram.com/jmlestagionicreative13"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-gray-400 hover:text-pink-400 transition-colors"
              >
                <Instagram size={16} />
                @jmlestagionicreative13
              </a>
              <a
                href="https://www.vinted.it/member/281391273-lestagionicreative"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-gray-400 hover:text-teal-400 transition-colors"
              >
                <ExternalLink size={16} />
                Vinted — lestagionicreative
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} Le Stagioni Creative. Tutti i diritti riservati.</p>
          <div className="flex items-center gap-1">
            Fatto con <Heart size={12} className="text-teal-500 mx-0.5" /> e creatività
          </div>
          {/* Hidden admin link */}
          <Link
            href="/admin"
            className="opacity-0 hover:opacity-100 text-gray-700 hover:text-gray-400 transition-opacity text-xs"
            aria-label="Area riservata"
          >
            Area riservata
          </Link>
        </div>
      </div>
    </footer>
  )
}
