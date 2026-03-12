export function storageGet<T extends Record<string, unknown>>(keys: string[]): Promise<T> {
  return new Promise((resolve) => chrome.storage.sync.get(keys, resolve as (items: Record<string, unknown>) => void))
}

export function storageSet(items: Record<string, unknown>): Promise<void> {
  return new Promise((resolve) => chrome.storage.sync.set(items, resolve))
}
