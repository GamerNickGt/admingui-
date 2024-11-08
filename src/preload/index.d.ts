import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      call: <T>(endpoint: APIEndpoint, ...args: any[]) => Promise<APIResponse<T>>
    }
  }
}
