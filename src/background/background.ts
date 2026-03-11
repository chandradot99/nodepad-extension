// NodePad background service worker

chrome.runtime.onInstalled.addListener(() => {
  // Open side panel when extension icon is clicked
  chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true })
  console.log('NodePad extension installed')
})

// Relay messages from side panel to active tab's content script
chrome.runtime.onMessage.addListener((message: any, _sender: any, sendResponse: any) => {
  if (message.type === 'RELAY_TO_CONTENT') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0]
      if (!tab?.id) {
        sendResponse({ success: false, error: 'No active tab' })
        return
      }
      chrome.tabs.sendMessage(tab.id, message.payload, (response) => {
        if (chrome.runtime.lastError) {
          sendResponse({ success: false, error: chrome.runtime.lastError.message })
        } else {
          sendResponse(response)
        }
      })
    })
    return true // async
  }
})

export default {}
