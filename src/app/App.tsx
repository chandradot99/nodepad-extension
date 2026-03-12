import React, { useState } from 'react'
import { useConfig } from '../hooks/useConfig'
import { useN8nDetect } from '../hooks/useN8nDetect'
import { useNodeSync } from '../hooks/useNodeSync'
import { useCredentialSync } from '../hooks/useCredentialSync'
import SetupScreen from '../components/SetupScreen'
import Header from '../components/Header'
import NoN8nState from '../components/NoN8nState'
import NotLoggedInState from '../components/NotLoggedInState'
import SyncPanel from '../components/SyncPanel'

export default function App() {
  const { config, loaded, saveConfig } = useConfig()
  const [showSettings, setShowSettings] = useState(false)

  const { n8nStatus, detecting, detect } = useN8nDetect(config)
  const nodeSync = useNodeSync(config, n8nStatus)
  const credSync = useCredentialSync(config, n8nStatus)

  if (!loaded) return null

  if (!config || showSettings) {
    return (
      <SetupScreen
        onSave={async (raw) => {
          const err = await saveConfig(raw)
          if (!err) setShowSettings(false)
          return err
        }}
        onCancel={config ? () => setShowSettings(false) : undefined}
      />
    )
  }

  const isBusy = detecting || nodeSync.state === 'syncing' || credSync.state === 'syncing'

  return (
    <div className="min-h-screen bg-[#0c0c0d] text-[#ededef] p-5 font-sans">
      <Header
        showActions
        onRefresh={detect}
        refreshDisabled={isBusy}
        onSettings={() => setShowSettings(true)}
      />

      {detecting && (
        <div className="text-center py-10">
          <p className="text-xs text-[#7c7c86]">Detecting n8n…</p>
        </div>
      )}

      {!detecting && !n8nStatus?.isN8n && (
        <NoN8nState lastSync={nodeSync.lastSync} />
      )}

      {!detecting && n8nStatus?.isN8n && !n8nStatus?.loggedIn && (
        <NotLoggedInState url={n8nStatus.url!} />
      )}

      {!detecting && n8nStatus?.isN8n && n8nStatus?.loggedIn && (
        <SyncPanel
          url={n8nStatus.url!}
          nodeState={nodeSync.state}
          nodeError={nodeSync.error}
          lastNodeSync={nodeSync.lastSync}
          onSyncNodes={nodeSync.sync}
          credState={credSync.state}
          credError={credSync.error}
          lastCredSync={credSync.lastSync}
          onSyncCredentials={credSync.sync}
        />
      )}
    </div>
  )
}
