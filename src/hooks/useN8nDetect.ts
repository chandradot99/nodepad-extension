import { useState, useEffect } from 'react'
import type { Config, N8nStatus } from '../types'
import { relayToContent } from '../lib/messaging'

export function useN8nDetect(config: Config | null) {
  const [n8nStatus, setN8nStatus] = useState<N8nStatus | null>(null)
  const [detecting, setDetecting] = useState(false)

  const detect = async () => {
    setDetecting(true)
    setN8nStatus(null)
    const response = await relayToContent('DETECT_N8N')
    setN8nStatus(response ?? { isN8n: false })
    setDetecting(false)
  }

  useEffect(() => {
    if (!config) return
    detect()
  }, [config])

  return { n8nStatus, detecting, detect }
}
