import type { Config } from '../types'

export function parseCompoundToken(raw: string): Config | null {
  try {
    const decoded = JSON.parse(atob(raw.trim()))
    if (decoded.api && decoded.token) {
      return { apiUrl: decoded.api, apiToken: decoded.token }
    }
    return null
  } catch {
    return null
  }
}
