import { electronApp, is, optimizer } from '@electron-toolkit/utils'
import clipboardWatcher from 'electron-clipboard-watcher'
import { ParsePlayerData } from './ipc/commands/macro'
import { app, BrowserWindow, shell } from 'electron'
import icon from '../../resources/icon.png?asset'
import InitializeIPC from './ipc/main'
import { join } from 'path'

import { autoUpdater } from 'electron-updater'
const log = require('electron-log')

log.transports.file.level = 'debug'
autoUpdater.logger = log
log.info('App starting...')

let mainWindow: BrowserWindow
function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    show: false,
    title: 'DEFSAK',
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  const AppUpdaterEvent = (text: string) => {
    log.info(text)
    mainWindow.webContents.send('update', text)
  }

  AppUpdaterEvent('App started...')
  autoUpdater.on('checking-for-update', () => AppUpdaterEvent('Checking for update...'))
  autoUpdater.on('update-available', () => AppUpdaterEvent('Update available. Downloading...'))
  autoUpdater.on('update-not-available', () => AppUpdaterEvent('No updates available'))
  autoUpdater.on('error', (err) => AppUpdaterEvent(`Error in auto-updater: ${err}`))
  autoUpdater.on('download-progress', (progress) =>
    AppUpdaterEvent(`Download progress: ${progress.percent}`)
  )
  autoUpdater.on('update-downloaded', () => {
    AppUpdaterEvent('Update downloaded. Installing...')
    // autoUpdater.quitAndInstall()
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

app.whenReady().then(async () => {
  autoUpdater.checkForUpdates()
  electronApp.setAppUserModelId('com.dek.sak')

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

  InitializeIPC(mainWindow)

  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
