import React from 'react'
import type { SyncRecord } from '../types'
import { formatDate } from '../lib/utils'

interface Props {
  lastSync: SyncRecord | null
}

export default function NoN8nState({ lastSync }: Props) {
  return (
    <div className="space-y-4">
      <div className="bg-[#161618] border border-[#2a2a30] rounded-lg p-4 text-center space-y-3">
        <p className="text-2xl">⬡</p>
        <p className="text-xs font-medium text-[#ededef]">No n8n instance detected</p>
        <p className="text-[11px] text-[#7c7c86] leading-relaxed">
          Open your n8n instance in this browser tab, then click refresh to sync.
        </p>
      </div>
      {lastSync && (
        <p className="text-[10px] text-[#3f3f47] text-center">
          Last synced {formatDate(lastSync.date)} · {lastSync.nodeCount} nodes
        </p>
      )}
    </div>
  )
}
