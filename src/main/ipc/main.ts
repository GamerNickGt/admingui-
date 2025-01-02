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
      {
        type: 'server',
        label: 'NO FFA/RDM ...',
        message:
          'NO FFA/RDM (only in the pit) Flourish[Press Scroll Wheel] to duel someone! To votekick a FFAer Press ESC - Scoreboard and klick on the name'
      },
      {
        type: 'admin',
        label: 'Problem/Appeal/Invite',
        message:
          'If you have a problem with a player/ appeal a ban visit discord.gg/sakclan and go to server tickets. Dont throw stuff or people into the pit!!!'
      }
    ])
  )
  forEachPreset(
    ipcMain.handle,
    InitializePreset('punishments', [
      {
        label: 'FFA',
        reason:
          'FFA is not allowed. Flourish with middle mouse button to initiate a duel. Get more information at discord.gg/sakclan',
        min_duration: 1,
        max_duration: 12
      },
      {
        label: 'Pit Rules',
        reason:
          'Throwing objects or pushing people into the pit is not allowed. Get more information at discord.gg/sakclan',
        min_duration: 1,
        max_duration: 6
      }
    ])
  )

  IntializeConsoleKeyHandlers(mainWindow, ipcMain)
  InitializeContributors(ipcMain)
  InitializeCommandQueue(ipcMain)
  InitializeAPIHandlers(ipcMain)
}

export default IntializeIPC
