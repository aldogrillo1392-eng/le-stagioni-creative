'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ShoppingBag, Instagram, Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { href: '/',          label: 'Home' },
  { href: '/catalogo',  label: 'Catalogo' },
]

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [open,     setOpen]     = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-300',
        scrolled
          ? 'bg-white/95 backdrop-blur-sm shadow-card border-b border-gray-100'
          : 'bg-transparent'
      )}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 shrink-0" aria-label="Le Stagioni Creative - Home">
          <Image
            src="/images/logo.png"
            alt="Le Stagioni Creative"
            width={40}
            height={40}
            className="rounded-xl"
          />
          <span className="font-display text-xl text-gray-800 hidden sm:block">
            Le Stagioni Creative
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1" aria-label="Navigazione principale">
          {NAV_LINKS.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="px-4 py-2 rounded-xl text-sm font-medium text-gray-600 hover:text-teal-600 hover:bg-teal-50 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <a
            href="https://www.instagram.com/jmlestagionicreative13"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-xl text-gray-500 hover:text-pink-600 hover:bg-pink-50 transition-colors"
            aria-label="Seguici su Instagram"
          >
            <Instagram size={20} />
          </a>

          <Link
            href="/catalogo"
            className={cn(
              'hidden sm:inline-flex items-center gap-2',
              'bg-teal-500 hover:bg-teal-600 text-white',
              'px-4 py-2 rounded-2xl text-sm font-medium',
              'transition-colors shadow-brand-sm'
            )}
          >
            <ShoppingBag size={16} />
            Catalogo
          </Link>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setOpen(o => !o)}
            className="md:hidden p-2 rounded-xl text-gray-600 hover:bg-gray-100"
            aria-label={open ? 'Chiudi menu' : 'Apri menu'}
            aria-expanded={open}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile nav dropdown */}
      {open && (
        <nav
          className="md:hidden bg-white border-t border-gray-100 px-4 pb-4 pt-2 space-y-1"
          aria-label="Navigazione mobile"
        >
          {NAV_LINKS.map(link => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="block px-4 py-2.5 rounded-xl text-gray-700 hover:bg-teal-50 hover:text-teal-600 font-medium transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  )
}
