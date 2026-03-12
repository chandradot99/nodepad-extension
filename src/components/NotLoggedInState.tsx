import React from 'react'

interface Props {
  url: string
}

export default function NotLoggedInState({ url }: Props) {
  return (
    <div className="bg-[#161618] border border-[#2a2a30] rounded-lg p-4 text-center space-y-3">
      <p className="text-2xl">🔒</p>
      <p className="text-xs font-medium text-[#ededef]">n8n detected but not logged in</p>
      <p className="text-[11px] text-[#7c7c86] leading-relaxed">
        Sign in to your n8n instance at<br />
        <span className="font-mono text-[#ededef] break-all">{url}</span><br />
        then click refresh.
      </p>
    </div>
  )
}
