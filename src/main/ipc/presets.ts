import { existsSync, readFileSync, writeFileSync } from 'fs'
import { app, IpcMainInvokeEvent } from 'electron'
import { join } from 'path'

type IPCHandler = {
  channel: string
  listener: (event: IpcMainInvokeEvent, ...args: any[]) => Promise<any> | any
}

const PRESET_VER = app.getVersion()

function compareSemver(version1: string, version2: string): number {
  const parseVersion = (version: string) => {
    const [major, minor = 0, patch = 0] = version.split('.').map(Number)
    return [major, minor, patch]
  }

  const [major1, minor1, patch1] = parseVersion(version1)
  const [major2, minor2, patch2] = parseVersion(version2)

  if (major1 !== major2) return major1 - major2
  if (minor1 !== minor2) return minor1 - minor2
  return patch1 - patch2
}

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
		if (compareSemver(version, PRESET_VER) > 0) {
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
