import { IntializeConsoleKeyHandlers } from './settings/console-key'
import { forEachPreset, InitializePreset } from './presets'
import { InitializeCommandQueue } from './commands/queue'
import InitializeContributors from './contributors'
import { BrowserWindow, ipcMain } from 'electron'
import { InitializeAPIHandlers } from './api'

function IntializeIPC(mainWindow: BrowserWindow) {
  forEachPreset(ipcMain.handle, InitializePreset('punishments'))
  IntializeConsoleKeyHandlers(mainWindow, ipcMain)
  InitializeContributors(ipcMain.handle)
  InitializeAPIHandlers(ipcMain.handle)
  InitializeCommandQueue(ipcMain)
}

export default IntializeIPC
