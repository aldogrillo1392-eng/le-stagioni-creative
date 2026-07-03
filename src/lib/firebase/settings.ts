import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import { getFirebaseDb } from './client'
import type { SiteSettings } from '@/types'

const SETTINGS_DOC = 'settings/site'

export const DEFAULT_SETTINGS: SiteSettings = {
  siteName:         'Le Stagioni Creative',
  tagline:          'Creazioni artigianali fatte con amore',
  heroTitle:        'Benvenuta nel laboratorio creativo',
  heroSubtitle:     'Oggetti unici realizzati a mano, per rendere speciale ogni momento',
  instagramHandle:  '@jmlestagionicreative13',
  instagramUrl:     'https://www.instagram.com/jmlestagionicreative13',
  vintedProfileUrl: 'https://www.vinted.it/member/lestagionicreative',
  adminEmail:       '',
  logoUrl:          '/images/logo.png',
  heroBgUrl:        '',
  primaryColor:     '#2fa5a5',
  accentColor:      '#b8955a',
  footerText:       '© 2024 Le Stagioni Creative. Tutti i diritti riservati.',
  contactEmail:     '',
  contactPhone:     '',
  updatedAt:        new Date().toISOString(),
}

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const db   = getFirebaseDb()
    const ref  = doc(db, SETTINGS_DOC)
    const snap = await getDoc(ref)
    if (!snap.exists()) return DEFAULT_SETTINGS
    return { ...DEFAULT_SETTINGS, ...snap.data() } as SiteSettings
  } catch {
    return DEFAULT_SETTINGS
  }
}

export async function updateSiteSettings(data: Partial<SiteSettings>): Promise<void> {
  const db  = getFirebaseDb()
  const ref = doc(db, SETTINGS_DOC)
  await setDoc(ref, { ...data, updatedAt: serverTimestamp() }, { merge: true })
}
