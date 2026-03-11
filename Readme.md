# NodePad Chrome Extension

Syncs n8n node schemas to NodePad so the AI can generate accurate workflows.

## How it works

1. Navigate to your n8n instance (must be logged in)
2. Click the NodePad extension icon to open the side panel
3. Click **Sync Nodes Now**
4. The extension fetches `/types/nodes.json` using your browser session and sends it to NodePad

Repeat after installing new community nodes in n8n.

## Setup

1. Generate an API token in NodePad → Settings → Extensions
2. Open the side panel, enter your NodePad URL and API token
3. Navigate to your n8n instance and sync

## Development

```bash
npm install
npm run dev      # watch mode
npm run build    # production build
```

Load the `dist/` folder as an unpacked extension in `chrome://extensions`.
