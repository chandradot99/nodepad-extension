import { useState, useEffect } from 'react'
import type { Config, N8nStatus, CredSyncRecord, ActionState } from '../types'
import { relayToContent } from '../lib/messaging'
import { nodepadPost } from '../lib/api'
import { storageGet, storageSet } from '../lib/storage'

export function useCredentialSync(config: Config | null, n8nStatus: N8nStatus | null) {
  const [state, setState] = useState<ActionState>('idle')
  const [error, setError] = useState('')
  const [lastSync, setLastSync] = useState<CredSyncRecord | null>(null)

  useEffect(() => {
    storageGet<{ lastCredSync?: CredSyncRecord }>(['lastCredSync']).then((data) => {
      if (data.lastCredSync) setLastSync(data.lastCredSync)
    })
  }, [])

  const sync = async () => {
    if (!config || !n8nStatus?.isN8n || !n8nStatus?.loggedIn) return
    setState('syncing')
    setError('')

    try {
      // 1. Sync credential type schemas
      const typesResponse = await relayToContent('FETCH_CREDENTIAL_TYPES')
      if (!typesResponse?.success) throw new Error(typesResponse?.error || 'Failed to fetch credential types from n8n')
      await nodepadPost(config, '/sync/credential-types', {
        base_url: n8nStatus.url,
        credential_types: typesResponse.credential_types,
      })

      // 2. Sync saved credential instances (name + type only, never values)
      const credsResponse = await relayToContent('FETCH_CREDENTIALS')
      if (!credsResponse?.success) throw new Error(credsResponse?.error || 'Failed to fetch credentials from n8n')
      await nodepadPost(config, '/sync/saved-credentials', {
        base_url: n8nStatus.url,
        credentials: credsResponse.credentials,
      })

      const record: CredSyncRecord = { date: new Date().toISOString(), credCount: credsResponse.credentials.length }
      await storageSet({ lastCredSync: record })
      setLastSync(record)
      setState('success')
    } catch (err: any) {
      setState('error')
      setError(err.message)
    }
  }

  return { state, error, lastSync, sync }
}
