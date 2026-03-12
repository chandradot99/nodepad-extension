import React from 'react'
import type { ActionState, SyncRecord, CredSyncRecord } from '../types'
import { formatDate } from '../lib/utils'
import N8nInstanceBadge from './N8nInstanceBadge'
import SyncSection from './SyncSection'
import PrivacyNotice from './PrivacyNotice'

interface Props {
  url: string
  nodeState: ActionState
  nodeError: string
  lastNodeSync: SyncRecord | null
  onSyncNodes: () => void
  credState: ActionState
  credError: string
  lastCredSync: CredSyncRecord | null
  onSyncCredentials: () => void
}

export default function SyncPanel({
  url,
  nodeState, nodeError, lastNodeSync, onSyncNodes,
  credState, credError, lastCredSync, onSyncCredentials,
}: Props) {
  const isBusy = nodeState === 'syncing' || credState === 'syncing'

  return (
    <div className="space-y-4">
      <N8nInstanceBadge url={url} />

      <SyncSection
        lastSyncText={lastNodeSync
          ? `Nodes: last synced ${formatDate(lastNodeSync.date)} · ${lastNodeSync.nodeCount} nodes`
          : null}
        state={nodeState}
        error={nodeError}
        successText={`${lastNodeSync?.nodeCount} nodes synced to NodePad`}
        buttonLabel="Sync Nodes"
        buttonLoadingLabel="Syncing nodes…"
        onSync={onSyncNodes}
        disabled={isBusy}
        primary
      />

      <SyncSection
        lastSyncText={lastCredSync
          ? `Credentials: last synced ${formatDate(lastCredSync.date)} · ${lastCredSync.credCount} credentials`
          : null}
        state={credState}
        error={credError}
        successText={`${lastCredSync?.credCount} credentials synced to NodePad`}
        buttonLabel="Sync Credentials"
        buttonLoadingLabel="Syncing credentials…"
        onSync={onSyncCredentials}
        disabled={isBusy}
      />

      <PrivacyNotice />
    </div>
  )
}
