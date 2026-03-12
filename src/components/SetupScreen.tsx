import React, { useState } from 'react'
import Header from './Header'

interface Props {
  onSave: (token: string) => Promise<string | null>
  onCancel?: () => void
}

export default function SetupScreen({ onSave, onCancel }: Props) {
  const [tokenInput, setTokenInput] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    setError('')
    const err = await onSave(tokenInput)
    if (err) {
      setError(err)
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0c0c0d] text-[#ededef] p-5 font-sans">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-violet-600 flex items-center justify-center text-white text-xs font-bold">N</div>
          <span className="text-sm font-semibold">NodePad</span>
        </div>
        {onCancel && (
          <button onClick={onCancel} className="text-xs text-[#7c7c86] hover:text-[#ededef] transition-colors">
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

      {error && <p className="text-[11px] text-red-400 mt-2">{error}</p>}

      <button
        onClick={handleSave}
        disabled={saving || !tokenInput.trim()}
        className="mt-4 w-full bg-violet-600 hover:bg-violet-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-medium py-2 rounded transition-colors"
      >
        Connect
      </button>
    </div>
  )
}
