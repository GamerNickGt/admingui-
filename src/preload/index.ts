import { electronAPI } from '@electron-toolkit/preload'
import { contextBridge } from 'electron'

const api = {
  call: async <T>(endpoint: APIEndpoint, ...args: any[]): Promise<APIResponse<T>> => {
    return await electronAPI.ipcRenderer.invoke(endpoint, args)
  }
}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
