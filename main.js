const { app, BrowserWindow } = require('electron')
const path = require('path');

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1024,
    height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            sandbox: false,
            contextIsolation: true,   // Importante para seguridad
            enableRemoteModule: false, // Desactivado por defecto desde Electron 14
            nodeIntegration: false     // Por seguridad debe estar en false
        }
})

  win.loadFile('app/src/index.html')
}

app.whenReady().then(() => {
  createWindow()
})