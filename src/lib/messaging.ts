/** Send a message to the content script of the active tab via the background relay. */
export function relayToContent(type: string): Promise<any> {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage(
      { type: 'RELAY_TO_CONTENT', payload: { type } },
      (response) => {
        if (chrome.runtime.lastError) resolve(null)
        else resolve(response)
      }
    )
  })
}
