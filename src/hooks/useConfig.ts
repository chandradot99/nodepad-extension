import { useState, useEffect } from 'react'
import type { Config } from '../types'
import { storageGet, storageSet } from '../lib/storage'
import { parseCompoundToken } from '../lib/token'

export function useConfig() {
  const [config, setConfig] = useState<Config | null>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    storageGet<{ apiUrl?: string; apiToken?: string }>(['apiUrl', 'apiToken']).then((data) => {
      if (data.apiUrl && data.apiToken) {
        setConfig({ apiUrl: data.apiUrl, apiToken: data.apiToken })
      }
      setLoaded(true)
    })
  }, [])

  // Returns null on success, error message on failure
  const saveConfig = async (raw: string): Promise<string | null> => {
    const parsed = parseCompoundToken(raw)
    if (!parsed) return 'Invalid token. Generate one from NodePad → Settings → Extension.'
    await storageSet({ apiUrl: parsed.apiUrl, apiToken: parsed.apiToken })
    setConfig(parsed)
    return null
  }

  return { config, loaded, saveConfig }
}
