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
          'If you have a problem with a player/ appeal a ban visit discord.gg/ghc and go to server tickets. Dont throw stuff or people into the pit!!!'
      }
    ])
  )
  forEachPreset(
    ipcMain.handle,
    InitializePreset('punishments', [
      {
        label: 'FFA (warning 1 hour)',
        reason:
          "FFA: You need to flourish to your opponent and wait on them to flourish back to start a duel. Flourish can be done with MMB, or L3+Square/X. FFA is allowed only in the pit, outside of the pit you aren't allowed to randomly attack (which includes; jabs, kicks, tackles, throwing items, arrows, etc.) other players. Rules and tickets at discord.gg/ghc.",
        min_duration: 1,
        max_duration: 1
      },
      {
        label: 'Pit rules',
        reason:
          'Do not throw stuff in or out the pit, this includes people. Rules and tickets at discord.gg/ghc.',
        min_duration: 1,
        max_duration: 1
      },
      {
        label: 'FFA (1h->7d)',
        reason:
          "FFA: You need to flourish to your opponent and wait on them to flourish back to start a duel. Flourish can be done with MMB, or L3+Square/X. FFA is allowed only in the pit, outside of the pit you aren't allowed to randomly attack (which includes; jabs, kicks, tackles, throwing items, arrows, etc.) other players. Rules and tickets at discord.gg/ghc.",
        min_duration: 1,
        max_duration: 168
      },
      {
        label: 'FFA (4->8hours baseline, non serious 1st offense)',
        reason:
          "FFA: You need to flourish to your opponent and wait on them to flourish back to start a duel. Flourish can be done with MMB, or L3+Square/X. FFA is allowed only in the pit, outside of the pit you aren't allowed to randomly attack (which includes; jabs, kicks, tackles, throwing items, arrows, etc.) other players. Rules and tickets at discord.gg/ghc.",
        min_duration: 4,
        max_duration: 4
      },
      {
        label: 'FFA (1st non-serious repeat / 1st serious offense, 12-24 hours)',
        reason:
          "FFA: You need to flourish to your opponent and wait on them to flourish back to start a duel. Flourish can be done with MMB, or L3+Square/X. FFA is allowed only in the pit, outside of the pit you aren't allowed to randomly attack (which includes; jabs, kicks, tackles, throwing items, arrows, etc.) other players. Rules and tickets at discord.gg/ghc.",
        min_duration: 12,
        max_duration: 24
      },
      {
        label: 'FFA (Basic Duration, 8 hours)',
        reason:
          "FFA: You need to flourish to your opponent and wait on them to flourish back to start a duel. Flourish can be done with MMB, or L3+Square/X. FFA is allowed only in the pit, outside of the pit you aren't allowed to randomly attack (which includes; jabs, kicks, tackles, throwing items, arrows, etc.) other players. Rules and tickets at discord.gg/ghc.",
        min_duration: 8,
        max_duration: 8
      },
      {
        label: 'FFA (1st serious repeat offense, 1d)',
        reason:
          "FFA: You need to flourish to your opponent and wait on them to flourish back to start a duel. Flourish can be done with MMB, or L3+Square/X. FFA is allowed only in the pit, outside of the pit you aren't allowed to randomly attack (which includes; jabs, kicks, tackles, throwing items, arrows, etc.) other players. Rules and tickets at discord.gg/ghc.",
        min_duration: 24,
        max_duration: 24
      },
      {
        label: 'FFA (2nd serious offense, 3d -> 1w)',
        reason:
          "FFA: You need to flourish to your opponent and wait on them to flourish back to start a duel. Flourish can be done with MMB, or L3+Square/X. FFA is allowed only in the pit, outside of the pit you aren't allowed to randomly attack (which includes; jabs, kicks, tackles, throwing items, arrows, etc.) other players. Rules and tickets at discord.gg/ghc.",
        min_duration: 72,
        max_duration: 168
      },
      {
        label: 'FFA (3rd serious offense, 2 weeks)',
        reason:
          "FFA: You need to flourish to your opponent and wait on them to flourish back to start a duel. Flourish can be done with MMB, or L3+Square/X. FFA is allowed only in the pit, outside of the pit you aren't allowed to randomly attack (which includes; jabs, kicks, tackles, throwing items, arrows, etc.) other players. Rules and tickets at discord.gg/ghc.",
        min_duration: 348,
        max_duration: 348
      },
      {
        label: 'FFA (>3 Offenses, 1month to perm)',
        reason:
          "FFA: You need to flourish to your opponent and wait on them to flourish back to start a duel. Flourish can be done with MMB, or L3+Square/X. FFA is allowed only in the pit, outside of the pit you aren't allowed to randomly attack (which includes; jabs, kicks, tackles, throwing items, arrows, etc.) other players. Rules and tickets at discord.gg/ghc.",
        min_duration: 720,
        max_duration: 999_999
      },
      {
        label: 'Racism / Bigotry / Hatespeech',
        reason:
          'Hate speech, whether racist, sexist or whatever other kind of bigotry you can think of can all fall under this umbrella term, this ofcourse is not allowed. Rules and tickets at discord.gg/ghc.',
        min_duration: 100,
        max_duration: 100_000
      },
      {
        label: 'Offensive username',
        reason:
          'Your username is not allowed on this server, appeal this at discord.gg/ghc when you have changed it to something that is in line with the rules of the server (disc.gg/sakclan). Appeal your ban here incase you believe this was either unwaranted, you have changed ur name and want to resume playing, or have any questions.',
        min_duration: 999,
        max_duration: 999_999
      },
      {
        label: ' Suspected Alt Account, appeal:',
        reason:
          'This account is suspected of being an alt account being used by a banned player, if this ban is unjust/incorrect you need to appeal your ban at discord.gg/ghc.',
        min_duration: 9999,
        max_duration: 999_999
      },
      {
        label: 'Cheating / DDOS',
        reason:
          'Cheating is strictly prohibited, please make a ticket at discord.gg/ghc if you wish to appeal this ban. Using alt accounts in the mean time will be a surefire way to get yourself in even more trouble with the community, take the right approach and contact us.',
        min_duration: 999_999,
        max_duration: 999_999
      },
      {
        label: 'Trollvote (1st offense = 1-4H, 2nd offense <24H, 3rd offense >48H)',
        reason:
          'Creating votekicks against players without any valid reason to do so is considered to be troll voting. Read the rules at discord.gg/ghc before you continue playing, here you can also appeal your ban or ask further questions.',
        min_duration: 1,
        max_duration: 1000
      },
      {
        label: 'Trollvoting (>3rd offense, 20d->3months)',
        reason:
          "Creating votekicks against players without any valid reason to do so will be considered troll voting. The admins are there to help out if you need it, if you see this, you are someone that has had plenty of chances to change their behaviour but simply hasn't. Rules and tickets at discord.gg/ghc.",
        min_duration: 480,
        max_duration: 2160
      },
      {
        label: 'PERMANENT: (add custom reason)',
        reason: 'Appeal at discord.gg/ghc',
        min_duration: 999_999,
        max_duration: 999_999
      },
      {
        label: 'PERMANENT: (GENERIC REASON)',
        reason:
          'You have been permanently banned from this server, depending on the details of your case this can be due to various different reasons. Make an appeal at discord.gg/ghc if you believe this was unfair, ask questions about this ban or appeal it. Playing on any alts in the mean time will only worsen your situation, please refrain from doing so.',
        min_duration: 999_999,
        max_duration: 999_999
      }
    ])
  )

  IntializeConsoleKeyHandlers(mainWindow, ipcMain)
  InitializeContributors(ipcMain)
  InitializeCommandQueue(ipcMain)
  InitializeAPIHandlers(ipcMain)
}

export default IntializeIPC
