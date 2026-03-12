import React from 'react'

interface Props {
  url: string
}

export default function N8nInstanceBadge({ url }: Props) {
  return (
    <div className="bg-[#161618] border border-[#2a2a30] rounded-lg p-3">
      <div className="flex items-center gap-1.5 mb-1">
        <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block shrink-0" />
        <span className="text-[11px] font-medium text-[#ededef]">n8n detected</span>
      </div>
      <p className="text-[10px] text-[#3f3f47] truncate">{url}</p>
    </div>
  )
}
