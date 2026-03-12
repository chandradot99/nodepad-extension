import React from 'react'

interface Props {
  showActions?: boolean
  onRefresh?: () => void
  onSettings?: () => void
  refreshDisabled?: boolean
}

export default function Header({ showActions, onRefresh, onSettings, refreshDisabled }: Props) {
  return (
    <div className="flex items-center justify-between mb-5">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded bg-violet-600 flex items-center justify-center text-white text-xs font-bold">N</div>
        <span className="text-sm font-semibold">NodePad</span>
      </div>
      {showActions && (
        <div className="flex items-center gap-3">
          <button
            onClick={onRefresh}
            disabled={refreshDisabled}
            className="text-[#3f3f47] hover:text-[#7c7c86] transition-colors disabled:opacity-40 text-sm"
            title="Re-detect current tab"
          >
            ↺
          </button>
          <button
            onClick={onSettings}
            className="text-[#3f3f47] hover:text-[#7c7c86] transition-colors text-sm"
            title="Change token"
          >
            ⚙
          </button>
        </div>
      )}
    </div>
  )
}
