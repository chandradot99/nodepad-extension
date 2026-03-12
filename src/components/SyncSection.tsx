import React from 'react'
import type { ActionState } from '../types'

interface Props {
  lastSyncText: string | null
  state: ActionState
  error: string
  successText: string
  buttonLabel: string
  buttonLoadingLabel: string
  onSync: () => void
  disabled: boolean
  primary?: boolean
}

export default function SyncSection({
  lastSyncText,
  state,
  error,
  successText,
  buttonLabel,
  buttonLoadingLabel,
  onSync,
  disabled,
  primary,
}: Props) {
  return (
    <div className="space-y-2">
      {lastSyncText && (
        <p className="text-[10px] text-[#3f3f47]">{lastSyncText}</p>
      )}

      {state === 'success' && (
        <div className="text-[11px] text-green-400 bg-green-400/10 border border-green-400/20 rounded px-3 py-2">
          ✓ {successText}
        </div>
      )}

      {state === 'error' && (
        <div className="text-[11px] text-red-400 bg-red-400/10 border border-red-400/20 rounded px-3 py-2">
          {error}
        </div>
      )}

      <button
        onClick={onSync}
        disabled={disabled}
        className={`w-full disabled:opacity-40 disabled:cursor-not-allowed text-sm font-medium py-2.5 rounded transition-colors ${
          primary
            ? 'bg-violet-600 hover:bg-violet-700 text-white'
            : 'bg-[#161618] hover:bg-[#1e1e22] border border-[#2a2a30] hover:border-[#3f3f47] text-[#ededef]'
        }`}
      >
        {state === 'syncing' ? buttonLoadingLabel : buttonLabel}
      </button>
    </div>
  )
}
