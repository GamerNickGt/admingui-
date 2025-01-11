import { existsSync, readFileSync, writeFileSync } from 'fs'
import { app, IpcMainInvokeEvent } from 'electron'
import { join } from 'path'

type IPCHandler = {
  channel: string
  listener: (event: IpcMainInvokeEvent, ...args: any[]) => Promise<any> | any
}

const PRESET_VER = app.getVersion()

function generatePresetFile(key: string, defaultData?: any) {
  return {
    [key]: [],
    [`default_${key}`]: defaultData || [],
    [`version_${key}`]: PRESET_VER
  }
}

export function InitializePreset<T>(key: string, defaultData?: T): IPCHandler[] {
  const userData = app.getPath('userData')
  const presetPath = join(userData, `${key}.json`)

  const data = generatePresetFile(key, defaultData)
  if (existsSync(presetPath)) {
    const old_data = JSON.parse(readFileSync(presetPath, 'utf-8'))
    const version = old_data[`version_${key}`]
    if (version !== PRESET_VER) {
      const user_data = old_data[key] || []
      data[key] = user_data
      writeFileSync(presetPath, JSON.stringify(data))
    }
  } else {
    writeFileSync(presetPath, JSON.stringify(data))
  }

  return [
    {
      channel: `fetch_${key}`,
      listener: () => {
        const data = JSON.parse(readFileSync(presetPath, 'utf-8'))

        return {
          data: data[key],
          defaultData: data[`default_${key}`],
          version: PRESET_VER
        }
      }
    },
    {
      channel: `update_${key}`,
      listener: (_, data) => {
        const preset = JSON.parse(readFileSync(presetPath, 'utf-8'))

        const index = preset[key].findIndex((item: any) => item.label === data.label)
        if (index === -1) {
          preset[key].push(data)
        } else {
          preset[key][index] = data
        }

        writeFileSync(presetPath, JSON.stringify(preset))
      }
    },
    {
      channel: `delete_${key}`,
      listener: (_, label) => {
        const data = JSON.parse(readFileSync(presetPath, 'utf-8'))
        const preset = data[key].filter((item: any) => item.label !== label)

        data[key] = preset
        writeFileSync(presetPath, JSON.stringify(data))
      }
    }
  ]
}

export function forEachPreset(f: Function, handlers: IPCHandler[]) {
  handlers.forEach((handler) => f(handler.channel, handler.listener))
}
