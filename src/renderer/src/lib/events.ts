const IPC = window.electron.ipcRenderer

export function IPCEvent<T>(
  event_listener: string,
  callback: (event: Electron.IpcRendererEvent, data: T) => void
) {
  IPC.on(event_listener, callback)
  return () => IPC.removeAllListeners(event_listener)
}

export function IPCEventOnce<T>(
	event_listener: string,
	callback: (event: Electron.IpcRendererEvent, data: T) => void
) {
	IPC.once(event_listener, callback)
	return () => IPC.removeAllListeners(event_listener)
}

export function SendIPCEvent<T>(event_listener: string, data: T) {
  IPC.send(event_listener, data)
}
