export function ConstructToastMessage(command: Command) {
  switch (command.type) {
    case 'ban':
      return `Banned ${command.player.playfabId} - ${command.reason} (${command.duration}h)`
    case 'kick':
      return `Kicked ${command.player.playfabId} - ${command.reason}`
    case 'list_players':
      return 'Refreshed List'
    case 'admin':
      return `Admin Say: ${command.message}`
    case 'server':
      return `Server Say: ${command.message}`
    default:
      return 'Unknown Command'
  }
}
