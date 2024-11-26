import { IntializeConsoleKeyHandlers } from './settings/console-key'
import { forEachPreset, InitializePreset } from './presets'
import { InitializeCommandQueue } from './commands/queue'
import InitializeContributors from './contributors'
import { BrowserWindow, ipcMain } from 'electron'
import { InitializeAPIHandlers } from './api'

function IntializeIPC(mainWindow: BrowserWindow) {
  forEachPreset(
    ipcMain.handle,
    InitializePreset('announcements', [
      { type: 'admin', label: 'Example', message: 'This is an example announcement' }
    ])
  )
  forEachPreset(
    ipcMain.handle,
    InitializePreset('punishments', [
      {
        label: 'FFA',
        reason: 'FFA is not allowed. Get more information at discord.gg/sakclan',
        min_duration: 1,
        max_duration: 12
      }
    ])
  )
  IntializeConsoleKeyHandlers(mainWindow, ipcMain)
  InitializeContributors(ipcMain.handle)
  InitializeAPIHandlers(ipcMain.handle)
  InitializeCommandQueue(ipcMain)
}

export default IntializeIPC
