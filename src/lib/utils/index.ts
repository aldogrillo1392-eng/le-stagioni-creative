import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import slugify from 'slugify'

// ─── Tailwind class merger ────────────────────────────────────────────────────

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

// ─── Slug generation ──────────────────────────────────────────────────────────

export function toSlug(text: string): string {
  return slugify(text, {
    lower:  true,
    strict: true,
    locale: 'it',
  })
}

// ─── Price formatter ─────────────────────────────────────────────────────────

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('it-IT', {
    style:                 'currency',
    currency:              'EUR',
    minimumFractionDigits: 2,
  }).format(price)
}

// ─── Date formatter ───────────────────────────────────────────────────────────

export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('it-IT', {
    day:   'numeric',
    month: 'long',
    year:  'numeric',
  }).format(d)
}

// ─── Category labels ─────────────────────────────────────────────────────────

export const CATEGORY_LABELS: Record<string, string> = {
  decorazioni:   'Decorazioni',
  portacandele:  'Portacandele',
  oggettistica:  'Oggettistica',
  natale:        'Natale 🎄',
  pasqua:        'Pasqua 🐣',
  autunno:       'Autunno 🍂',
  primavera:     'Primavera 🌸',
  estate:        'Estate ☀️',
  'idee-regalo': 'Idee Regalo 🎁',
  altre:         'Altre',
  all:           'Tutte le categorie',
}

export const CATEGORY_OPTIONS = [
  { value: 'all',          label: 'Tutte' },
  { value: 'decorazioni',  label: 'Decorazioni' },
  { value: 'portacandele', label: 'Portacandele' },
  { value: 'oggettistica', label: 'Oggettistica' },
  { value: 'natale',       label: 'Natale 🎄' },
  { value: 'pasqua',       label: 'Pasqua 🐣' },
  { value: 'autunno',      label: 'Autunno 🍂' },
  { value: 'primavera',    label: 'Primavera 🌸' },
  { value: 'estate',       label: 'Estate ☀️' },
  { value: 'idee-regalo',  label: 'Idee Regalo 🎁' },
  { value: 'altre',        label: 'Altre' },
] as const

// ─── Unique ID generator (browser-safe) ──────────────────────────────────────

export function generateId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`
}

// ─── Debounce ─────────────────────────────────────────────────────────────────

export function debounce<T extends (...args: unknown[]) => void>(
  fn: T,
  ms: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), ms)
  }
}
