import React from 'react'

export default function PrivacyNotice() {
  return (
    <div className="bg-[#161618] border border-[#2a2a30] rounded-lg px-3 py-2.5 flex gap-2">
      <span className="text-[#3f3f47] text-xs shrink-0">🔒</span>
      <p className="text-[10px] text-[#7c7c86] leading-relaxed">
        We only sync credential <strong className="text-[#ededef]">names and types</strong> — never the actual values. Your secrets stay in n8n.
      </p>
    </div>
  )
}
