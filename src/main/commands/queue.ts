import { Game, GetGameProcess, WriteToConsole } from './macro'
import { IpcMainEvent } from 'electron'

class CommandQueue {
  private commands: CommandEvent[] = []
  private processing: boolean = false

  public add(command: CommandEvent) {
    this.commands.push(command)
    this.process()
  }

  private _skip = () => {
    this.processing = false
    this.process()
  }

  private _error_fail = (event: IpcMainEvent, error: string) => {
    event.reply('command-response', { error })
    this._skip()
  }

  private _process_command = (game: Game, event: IpcMainEvent, command: Command) => {
    WriteToConsole(
      game,
      { event, command },
      `${
        command.type === 'ban' || command.type === 'kick'
          ? `${command.type}byid ${command.player.playfabId} ${
              command.type === 'ban' ? command.duration : ''
            } "${command.reason}"`
          : command.type === 'list_players'
            ? 'listplayers'
            : command.type === 'unban'
              ? `unbanbyid ${command.player.playfabId}`
              : command.type === 'admin' || command.type === 'server'
                ? `${command.type === 'admin' ? 'adminsay' : 'serversay'} "${command.message}"`
                : '🫃'
      }`
    )
  }

  public async process() {
    if (this.processing || this.commands.length === 0) return
    this.processing = true

    const { event, command } = this.commands.shift() as CommandEvent
    if (!command) {
      this._error_fail(event, 'Invalid command')
      return
    }

    const game = GetGameProcess()
    if (!game) {
      this._error_fail(event, 'Game not running')
      return
    }

    this._process_command(game, event, command)

    this.processing = false
    this.process()
  }
}

export default CommandQueue
