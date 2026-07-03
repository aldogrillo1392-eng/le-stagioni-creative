'use client'

import { useState, useEffect } from 'react'
import { getSiteSettings, DEFAULT_SETTINGS } from '@/lib/firebase/settings'
import type { SiteSettings } from '@/types'

export function useSettings() {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS)
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    getSiteSettings()
      .then(setSettings)
      .catch(() => setSettings(DEFAULT_SETTINGS))
      .finally(() => setLoading(false))
  }, [])

  return { settings, loading }
}
