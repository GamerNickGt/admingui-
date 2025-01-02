import { electronApp, is, optimizer } from '@electron-toolkit/utils'
import clipboardWatcher from 'electron-clipboard-watcher'
import { ParsePlayerData } from './ipc/commands/macro'
import { app, BrowserWindow, shell } from 'electron'
import InitializeIPC from './ipc/main'
import { update } from './update'
import { join } from 'path'

if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}

let mainWindow: BrowserWindow
function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    show: false,
    title: 'DEFSAK',
    autoHideMenuBar: true,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env.ELECTRON_RENDERER_URL) {
    mainWindow.loadURL(process.env.ELECTRON_RENDERER_URL)
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  update(mainWindow)
}

app.whenReady().then(async () => {
  electronApp.setAppUserModelId(app.getName())

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  clipboardWatcher({
    onTextChange: (text: string) => {
      if (text.startsWith('ServerName - ')) {
        const data = ParsePlayerData(text)
        mainWindow.webContents.send('player-data', data)
      }
    }
  })

  createWindow()
  InitializeIPC(mainWindow)

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
