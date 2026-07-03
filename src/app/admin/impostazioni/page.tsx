'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import toast from 'react-hot-toast'
import { getSiteSettings, updateSiteSettings } from '@/lib/firebase/settings'
import { uploadSiteAsset } from '@/lib/firebase/storage'
import { BackupPanel } from '@/components/admin/BackupPanel'
import type { SiteSettings } from '@/types'

export default function ImpostazioniPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [saving,   setSaving]   = useState(false)
  const [uploading, setUploading] = useState<'logo' | 'hero' | null>(null)
  const logoRef = useRef<HTMLInputElement>(null)
  const heroRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    getSiteSettings().then(setSettings)
  }, [])

  if (!settings) return <div className="p-6 text-gray-400">Caricamento impostazioni…</div>

  const set = (key: keyof SiteSettings) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setSettings(prev => prev ? { ...prev, [key]: e.target.value } : prev)

  const uploadFile = async (file: File, type: 'logo' | 'hero') => {
    setUploading(type)
    try {
      const url = await uploadSiteAsset(file, type)
      setSettings(prev => prev ? {
        ...prev,
        ...(type === 'logo' ? { logoUrl: url } : { heroBgUrl: url })
      } : prev)
      toast.success(`${type === 'logo' ? 'Logo' : 'Immagine hero'} aggiornata!`)
    } catch {
      toast.error('Errore nel caricamento')
    } finally {
      setUploading(null)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!settings) return
    setSaving(true)
    try {
      await updateSiteSettings(settings)
      toast.success('Impostazioni salvate!')
    } catch {
      toast.error('Errore nel salvataggio')
    } finally {
      setSaving(false)
    }
  }

  const inputClass = 'w-full h-10 px-4 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 bg-white'
  const labelClass = 'block text-sm font-medium text-gray-700 mb-1.5'

  return (
    <form onSubmit={handleSave} className="p-6 max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Impostazioni</h1>
        <p className="text-sm text-gray-500 mt-0.5">Modifica i contenuti del sito senza toccare il codice.</p>
      </div>

      {/* ── Identità visiva ──────────────────────────────────────────── */}
      <section className="bg-white rounded-3xl shadow-card p-6 space-y-5">
        <h2 className="font-semibold text-gray-900">Identità visiva</h2>

        {/* Logo */}
        <div>
          <p className={labelClass}>Logo</p>
          <div className="flex items-center gap-4">
            {settings.logoUrl && (
              <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-100">
                <Image src={settings.logoUrl} alt="Logo" fill className="object-contain p-1" />
              </div>
            )}
            <div>
              <input
                ref={logoRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={e => e.target.files?.[0] && uploadFile(e.target.files[0], 'logo')}
              />
              <button
                type="button"
                onClick={() => logoRef.current?.click()}
                disabled={uploading === 'logo'}
                className="px-4 py-2 border border-gray-200 rounded-2xl text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50"
              >
                {uploading === 'logo' ? 'Caricamento…' : 'Cambia logo'}
              </button>
            </div>
          </div>
        </div>

        {/* Site name + tagline */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="siteName" className={labelClass}>Nome attività</label>
            <input id="siteName" type="text" value={settings.siteName} onChange={set('siteName')} className={inputClass} />
          </div>
          <div>
            <label htmlFor="tagline" className={labelClass}>Tagline</label>
            <input id="tagline" type="text" value={settings.tagline} onChange={set('tagline')} className={inputClass} />
          </div>
        </div>

        {/* Colors */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="primaryColor" className={labelClass}>Colore principale</label>
            <div className="flex gap-3 items-center">
              <input type="color" value={settings.primaryColor} onChange={set('primaryColor')} className="w-10 h-10 rounded-xl border border-gray-200 cursor-pointer p-1" />
              <input id="primaryColor" type="text" value={settings.primaryColor} onChange={set('primaryColor')} className={`${inputClass} flex-1`} placeholder="#2fa5a5" />
            </div>
          </div>
          <div>
            <label htmlFor="accentColor" className={labelClass}>Colore accent</label>
            <div className="flex gap-3 items-center">
              <input type="color" value={settings.accentColor} onChange={set('accentColor')} className="w-10 h-10 rounded-xl border border-gray-200 cursor-pointer p-1" />
              <input id="accentColor" type="text" value={settings.accentColor} onChange={set('accentColor')} className={`${inputClass} flex-1`} placeholder="#b8955a" />
            </div>
          </div>
        </div>
      </section>

      {/* ── Testi home ───────────────────────────────────────────────── */}
      <section className="bg-white rounded-3xl shadow-card p-6 space-y-4">
        <h2 className="font-semibold text-gray-900">Testi homepage</h2>
        <div>
          <label htmlFor="heroTitle" className={labelClass}>Titolo hero</label>
          <input id="heroTitle" type="text" value={settings.heroTitle} onChange={set('heroTitle')} className={inputClass} />
        </div>
        <div>
          <label htmlFor="heroSubtitle" className={labelClass}>Sottotitolo hero</label>
          <textarea id="heroSubtitle" rows={2} value={settings.heroSubtitle} onChange={set('heroSubtitle')} className="w-full px-4 py-3 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 resize-none" />
        </div>
      </section>

      {/* ── Social & link ────────────────────────────────────────────── */}
      <section className="bg-white rounded-3xl shadow-card p-6 space-y-4">
        <h2 className="font-semibold text-gray-900">Social & link</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="instagramHandle" className={labelClass}>Handle Instagram</label>
            <input id="instagramHandle" type="text" value={settings.instagramHandle} onChange={set('instagramHandle')} className={inputClass} placeholder="@nomeutente" />
          </div>
          <div>
            <label htmlFor="instagramUrl" className={labelClass}>URL Instagram</label>
            <input id="instagramUrl" type="url" value={settings.instagramUrl} onChange={set('instagramUrl')} className={inputClass} />
          </div>
          <div>
            <label htmlFor="vintedProfileUrl" className={labelClass}>URL profilo Vinted</label>
            <input id="vintedProfileUrl" type="url" value={settings.vintedProfileUrl} onChange={set('vintedProfileUrl')} className={inputClass} />
          </div>
        </div>
      </section>

      {/* ── Footer & contatti ────────────────────────────────────────── */}
      <section className="bg-white rounded-3xl shadow-card p-6 space-y-4">
        <h2 className="font-semibold text-gray-900">Footer & contatti</h2>
        <div>
          <label htmlFor="footerText" className={labelClass}>Testo footer</label>
          <input id="footerText" type="text" value={settings.footerText} onChange={set('footerText')} className={inputClass} />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="contactEmail" className={labelClass}>Email contatto</label>
            <input id="contactEmail" type="email" value={settings.contactEmail} onChange={set('contactEmail')} className={inputClass} />
          </div>
          <div>
            <label htmlFor="contactPhone" className={labelClass}>Telefono contatto</label>
            <input id="contactPhone" type="tel" value={settings.contactPhone} onChange={set('contactPhone')} className={inputClass} />
          </div>
        </div>
      </section>

      {/* ── Admin ──────────────────────────────────────────────────────── */}
      <section className="bg-white rounded-3xl shadow-card p-6 space-y-4">
        <h2 className="font-semibold text-gray-900">Account amministratore</h2>
        <p className="text-xs text-gray-500">
          Per cambiare email o password accedi alla{' '}
          <a href="https://console.firebase.google.com" target="_blank" rel="noopener noreferrer" className="text-teal-600 underline">
            Firebase Console → Authentication
          </a>
          .
        </p>
        <div>
          <label htmlFor="adminEmail" className={labelClass}>Email amministratore (solo visualizzazione)</label>
          <input id="adminEmail" type="email" value={settings.adminEmail} onChange={set('adminEmail')} className={`${inputClass} bg-gray-50`} readOnly />
        </div>
      </section>

      {/* Backup */}
      <BackupPanel />

      {/* Save */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-3 rounded-2xl bg-teal-500 hover:bg-teal-600 text-white font-medium text-sm shadow-brand-sm transition-colors disabled:opacity-50"
        >
          {saving ? 'Salvataggio…' : 'Salva impostazioni'}
        </button>
      </div>
    </form>
  )
}
