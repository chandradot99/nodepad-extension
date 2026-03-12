import { useState, useEffect } from 'react'
import type { Config, N8nStatus, SyncRecord, ActionState } from '../types'
import { relayToContent } from '../lib/messaging'
import { nodepadPost } from '../lib/api'
import { storageGet, storageSet } from '../lib/storage'

export function useNodeSync(config: Config | null, n8nStatus: N8nStatus | null) {
  const [state, setState] = useState<ActionState>('idle')
  const [error, setError] = useState('')
  const [lastSync, setLastSync] = useState<SyncRecord | null>(null)

  useEffect(() => {
    storageGet<{ lastSync?: SyncRecord }>(['lastSync']).then((data) => {
      if (data.lastSync) setLastSync(data.lastSync)
    })
  }, [])

  const sync = async () => {
    if (!config || !n8nStatus?.isN8n || !n8nStatus?.loggedIn) return
    setState('syncing')
    setError('')

    try {
      const response = await relayToContent('FETCH_NODES')
      if (!response?.success) throw new Error(response?.error || 'Failed to fetch nodes from n8n')

      await nodepadPost(config, '/sync/nodes', { base_url: n8nStatus.url, nodes: response.nodes })

      const record: SyncRecord = { date: new Date().toISOString(), nodeCount: response.nodes.length }
      await storageSet({ lastSync: record })
      setLastSync(record)
      setState('success')
    } catch (err: any) {
      setState('error')
      setError(err.message)
    }
  }

  return { state, error, lastSync, sync }
}
