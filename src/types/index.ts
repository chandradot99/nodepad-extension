export interface Config {
  apiUrl: string   // e.g. http://localhost:4000/api
  apiToken: string // raw token for Authorization header
}

export interface N8nStatus {
  isN8n: boolean
  loggedIn?: boolean
  url?: string
}

export interface SyncRecord {
  date: string
  nodeCount: number
}

export interface CredSyncRecord {
  date: string
  credCount: number
}

export type ActionState = 'idle' | 'syncing' | 'success' | 'error'
