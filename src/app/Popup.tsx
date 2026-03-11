import React, { useEffect, useState } from 'react'

interface Config {
  apiUrl: string   // full API base e.g. http://localhost:4000/api
  apiToken: string // raw token for Authorization header
}

interface N8nStatus {
  isN8n: boolean
  loggedIn?: boolean
  url?: string
}

interface SyncRecord {
  date: string
  nodeCount: number
}

type SyncState = 'idle' | 'detecting' | 'syncing' | 'success' | 'error'

function parseCompoundToken(raw: string): Config | null {
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

export default function Popup() {
  const [config, setConfig] = useState<Config | null>(null)
  const [tokenInput, setTokenInput] = useState('')
  const [showSettings, setShowSettings] = useState(false)
  const [saveError, setSaveError] = useState('')

  const [n8nStatus, setN8nStatus] = useState<N8nStatus | null>(null)
  const [syncState, setSyncState] = useState<SyncState>('idle')
  const [syncError, setSyncError] = useState('')
  const [lastSync, setLastSync] = useState<SyncRecord | null>(null)

  // Load config + last sync from storage
  useEffect(() => {
    chrome.storage.sync.get(['apiUrl', 'apiToken', 'lastSync'], (data) => {
      if (data.apiUrl && data.apiToken) {
        setConfig({ apiUrl: data.apiUrl, apiToken: data.apiToken })
      }
      if (data.lastSync) setLastSync(data.lastSync)
    })
  }, [])

  // Detect n8n when config loads
  useEffect(() => {
    if (!config) return
    detect()
  }, [config])

  const detect = () => {
    setSyncState('detecting')
    setN8nStatus(null)
    chrome.runtime.sendMessage(
      { type: 'RELAY_TO_CONTENT', payload: { type: 'DETECT_N8N' } },
      (response) => {
        setSyncState('idle')
        setN8nStatus(chrome.runtime.lastError || !response ? { isN8n: false } : response)
      }
    )
  }

  const saveConfig = () => {
    setSaveError('')
    const parsed = parseCompoundToken(tokenInput)
    if (!parsed) {
      setSaveError('Invalid token. Generate one from NodePad → Settings → Extension.')
      return
    }
    chrome.storage.sync.set({ apiUrl: parsed.apiUrl, apiToken: parsed.apiToken }, () => {
      setConfig(parsed)
      setShowSettings(false)
      setN8nStatus(null)
    })
  }

  const syncNodes = () => {
    if (!config || !n8nStatus?.isN8n || !n8nStatus?.loggedIn) return
    setSyncState('syncing')
    setSyncError('')

    chrome.runtime.sendMessage(
      { type: 'RELAY_TO_CONTENT', payload: { type: 'FETCH_NODES' } },
      async (response) => {
        if (chrome.runtime.lastError || !response?.success) {
          setSyncState('error')
          setSyncError(response?.error || 'Failed to fetch nodes from n8n')
          return
        }

        try {
          const res = await fetch(`${config.apiUrl}/sync/nodes`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${config.apiToken}`,
            },
            body: JSON.stringify({ base_url: n8nStatus.url, nodes: response.nodes }),
          })

          if (!res.ok) {
            const body = await res.json().catch(() => ({}))
            throw new Error(body.error || `NodePad API returned ${res.status}`)
          }

          const record: SyncRecord = { date: new Date().toISOString(), nodeCount: response.nodes.length }
          chrome.storage.sync.set({ lastSync: record })
          setLastSync(record)
          setSyncState('success')
        } catch (err: any) {
          setSyncState('error')
          setSyncError(err.message)
        }
      }
    )
  }

  const formatDate = (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return 'just now'
    if (mins < 60) return `${mins}m ago`
    const hrs = Math.floor(mins / 60)
    if (hrs < 24) return `${hrs}h ago`
    return new Date(iso).toLocaleDateString()
  }

  // ── Setup / Settings screen ──────────────────────────────────────────────
  if (!config || showSettings) {
    return (
      <div className="min-h-screen bg-[#0c0c0d] text-[#ededef] p-5 font-sans">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-violet-600 flex items-center justify-center text-white text-xs font-bold">N</div>
            <span className="text-sm font-semibold">NodePad</span>
          </div>
          {showSettings && (
            <button onClick={() => setShowSettings(false)} className="text-xs text-[#7c7c86] hover:text-[#ededef] transition-colors">
              ✕ Cancel
            </button>
          )}
        </div>

        <p className="text-xs text-[#7c7c86] mb-4">
          Paste the token from <strong className="text-[#ededef]">NodePad → Settings → Extension</strong>.
        </p>

        <div>
          <label className="block text-[11px] text-[#7c7c86] mb-1.5">NodePad Token</label>
          <textarea
            value={tokenInput}
            onChange={(e) => setTokenInput(e.target.value)}
            placeholder="Paste your NodePad token here…"
            rows={4}
            className="w-full bg-[#161618] border border-[#2a2a30] text-[#ededef] text-xs px-3 py-2 rounded outline-none focus:border-violet-500 placeholder-[#3f3f47] resize-none font-mono"
          />
        </div>

        {saveError && <p className="text-[11px] text-red-400 mt-2">{saveError}</p>}

        <button
          onClick={saveConfig}
          className="mt-4 w-full bg-violet-600 hover:bg-violet-700 text-white text-xs font-medium py-2 rounded transition-colors"
        >
          Connect
        </button>
      </div>
    )
  }

  // ── Main screen ──────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#0c0c0d] text-[#ededef] p-5 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-violet-600 flex items-center justify-center text-white text-xs font-bold">N</div>
          <span className="text-sm font-semibold">NodePad</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={detect}
            disabled={syncState === 'detecting' || syncState === 'syncing'}
            className="text-[#3f3f47] hover:text-[#7c7c86] transition-colors disabled:opacity-40 text-sm"
            title="Re-detect current tab"
          >
            ↺
          </button>
          <button
            onClick={() => { setShowSettings(true); setSyncState('idle') }}
            className="text-[#3f3f47] hover:text-[#7c7c86] transition-colors text-sm"
            title="Change token"
          >
            ⚙
          </button>
        </div>
      </div>

      {/* State: detecting */}
      {syncState === 'detecting' && (
        <div className="text-center py-10">
          <p className="text-xs text-[#7c7c86]">Detecting n8n…</p>
        </div>
      )}

      {/* State: not on n8n page */}
      {syncState !== 'detecting' && !n8nStatus?.isN8n && (
        <div className="space-y-4">
          <div className="bg-[#161618] border border-[#2a2a30] rounded-lg p-4 text-center space-y-3">
            <p className="text-2xl">⬡</p>
            <p className="text-xs font-medium text-[#ededef]">No n8n instance detected</p>
            <p className="text-[11px] text-[#7c7c86] leading-relaxed">
              Open your n8n instance in this browser tab, then click refresh to sync your nodes.
            </p>
          </div>
          {lastSync && (
            <p className="text-[10px] text-[#3f3f47] text-center">
              Last synced {formatDate(lastSync.date)} · {lastSync.nodeCount} nodes
            </p>
          )}
        </div>
      )}

      {/* State: on n8n page but not logged in */}
      {syncState !== 'detecting' && n8nStatus?.isN8n && !n8nStatus?.loggedIn && (
        <div className="space-y-4">
          <div className="bg-[#161618] border border-[#2a2a30] rounded-lg p-4 text-center space-y-3">
            <p className="text-2xl">🔒</p>
            <p className="text-xs font-medium text-[#ededef]">n8n detected but not logged in</p>
            <p className="text-[11px] text-[#7c7c86] leading-relaxed">
              Sign in to your n8n instance at<br />
              <span className="font-mono text-[#ededef] break-all">{n8nStatus.url}</span><br />
              then click refresh.
            </p>
          </div>
        </div>
      )}

      {/* State: on n8n page and ready */}
      {syncState !== 'detecting' && n8nStatus?.isN8n && n8nStatus?.loggedIn && (
        <div className="space-y-4">
          {/* n8n instance info */}
          <div className="bg-[#161618] border border-[#2a2a30] rounded-lg p-3">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block shrink-0"></span>
              <span className="text-[11px] font-medium text-[#ededef]">n8n detected</span>
            </div>
            <p className="text-[10px] text-[#3f3f47] truncate">{n8nStatus.url}</p>
          </div>

          {/* Last sync */}
          {lastSync && (
            <p className="text-[10px] text-[#3f3f47]">
              Last synced {formatDate(lastSync.date)} · {lastSync.nodeCount} nodes
            </p>
          )}

          {/* Success message */}
          {syncState === 'success' && (
            <div className="text-[11px] text-green-400 bg-green-400/10 border border-green-400/20 rounded px-3 py-2">
              ✓ {lastSync?.nodeCount} nodes synced to NodePad
            </div>
          )}

          {/* Error message */}
          {syncState === 'error' && (
            <div className="text-[11px] text-red-400 bg-red-400/10 border border-red-400/20 rounded px-3 py-2">
              {syncError}
            </div>
          )}

          {/* Sync button */}
          <button
            onClick={syncNodes}
            disabled={syncState === 'syncing'}
            className="w-full bg-violet-600 hover:bg-violet-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium py-2.5 rounded transition-colors"
          >
            {syncState === 'syncing' ? 'Syncing…' : 'Sync Nodes Now'}
          </button>

          <p className="text-[10px] text-[#3f3f47] text-center">
            Repeat after installing new community nodes
          </p>
        </div>
      )}
    </div>
  )
}
