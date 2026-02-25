// Preload script — intentionally empty.
// contextIsolation is on and nodeIntegration is off,
// so the renderer (the web app) has no access to Node.js APIs.
const { contextBridge } = require('electron')

// Expose nothing — the web app talks to the backend via HTTP as usual.
contextBridge.exposeInMainWorld('electron', {
    platform: process.platform,
})
