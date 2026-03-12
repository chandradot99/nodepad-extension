import type { Config } from '../types'

export async function nodepadPost(config: Config, path: string, body: object): Promise<void> {
  const res = await fetch(`${config.apiUrl}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.apiToken}`,
    },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error((data as any).error || `NodePad API returned ${res.status}`)
  }
}
