import CheckForUpdate from '../settings/check-for-update'
import ConsoleKeySettings from '../settings/console-key'
import Credits from '../settings/credits'

function Settings() {
  return (
    <div className="flex flex-col gap-2 mx-10">
      <ConsoleKeySettings />
      <CheckForUpdate />
      <Credits />
    </div>
  )
}

export default Settings
