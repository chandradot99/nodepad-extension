// NodePad content script - runs on all pages to detect n8n and fetch node schemas

chrome.runtime.onMessage.addListener((message: any, _sender: any, sendResponse: any) => {
  if (message.type === 'DETECT_N8N') {
    detectN8n().then(sendResponse)
    return true
  }

  if (message.type === 'FETCH_NODES') {
    fetchNodes().then(sendResponse)
    return true
  }

  if (message.type === 'FETCH_CREDENTIAL_TYPES') {
    fetchCredentialTypes().then(sendResponse)
    return true
  }

  if (message.type === 'FETCH_CREDENTIALS') {
    fetchCredentials().then(sendResponse)
    return true
  }
})

async function detectN8n(): Promise<{ isN8n: boolean; loggedIn?: boolean; url?: string }> {
  try {
    const res = await fetch('/types/nodes.json', { credentials: 'include' })
    if (res.ok) {
      return { isN8n: true, loggedIn: true, url: window.location.origin }
    }
    if (res.status === 401 || res.status === 403) {
      return { isN8n: true, loggedIn: false, url: window.location.origin }
    }
    return { isN8n: false }
  } catch {
    return { isN8n: false }
  }
}

async function fetchNodes(): Promise<{ success: boolean; nodes?: any[]; error?: string }> {
  try {
    const res = await fetch('/types/nodes.json', { credentials: 'include' })
    if (!res.ok) {
      return { success: false, error: `HTTP ${res.status} — make sure you're logged in to n8n` }
    }
    const data = await res.json()
    // Normalize to array (n8n returns array of node type objects)
    const nodes = Array.isArray(data) ? data : Object.values(data)
    return { success: true, nodes }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}

async function fetchCredentialTypes(): Promise<{ success: boolean; credential_types?: any[]; error?: string }> {
  try {
    const res = await fetch('/types/credentials.json', { credentials: 'include' })
    if (!res.ok) {
      return { success: false, error: `HTTP ${res.status} — make sure you're logged in to n8n` }
    }
    const data = await res.json()
    const credential_types = Array.isArray(data) ? data : Object.values(data)
    return { success: true, credential_types }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}

/** Read the browser-id n8n stores in localStorage. */
function n8nHeaders(): Record<string, string> {
  const browserId = localStorage.getItem('n8n-browserId')
  return browserId ? { 'browser-id': browserId } : {}
}

async function fetchCredentials(): Promise<{ success: boolean; credentials?: any[]; error?: string }> {
  try {
    const res = await fetch('/rest/credentials', { credentials: 'include', headers: n8nHeaders() })
    if (!res.ok) {
      return { success: false, error: `HTTP ${res.status} — make sure you're logged in to n8n` }
    }
    const data = await res.json()
    const credentials = Array.isArray(data?.data) ? data.data : []
    // Only keep name and type — never send credential values
    const safe = credentials.map((c: any) => ({ id: c.id, name: c.name, type: c.type }))
    return { success: true, credentials: safe }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}

export default {}
