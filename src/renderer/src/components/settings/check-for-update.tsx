import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '../ui/dialog'
import type { ProgressInfo, UpdateCheckResult } from 'electron-updater'
import { useCallback, useEffect, useState } from 'react'
import { useAPI } from '../api-provider'
import { IPCEvent } from '@/lib/events'
import { Button } from '../ui/button'
import { Progress } from '../ui/progress'
import { MoveRight } from 'lucide-react'
import { Badge } from '../ui/badge'

function CheckForUpdate() {
  const { api } = useAPI()
  const [checking, setChecking] = useState(false)
  const [updateAvailable, setUpdateAvailable] = useState(false)
  const [versionInfo, setVersionInfo] = useState<VersionInfo>({
    version: '0.0.0',
    newVersion: '0.0.0'
  } as VersionInfo)
  const [updateError, setUpdateError] = useState<ErrorType>()
  const [progressInfo, setProgressInfo] = useState<Partial<ProgressInfo>>()
  const [modalOpen, setModalOpen] = useState<boolean>(false)
  const [modalBtn, setModalBtn] = useState<{
    cancelText?: string
    okText?: string
    onCancel?: () => void
    onOk?: () => void
  }>({
    onCancel: () => setModalOpen(false),
    onOk: () => api.call('start-download')
  })

  const checkUpdate = async () => {
    setChecking(true)
    const result = await api.call<UpdateCheckResult | null | { message: string; error: Error }>(
      'check-update'
    )
    setProgressInfo({ percent: 0 })
    setChecking(false)
    setModalOpen(true)
    if ((result as any)?.error) {
      setUpdateAvailable(false)
      setUpdateError((result as any)?.error)
    }
  }

  const onUpdateCanAvailable = useCallback(
    (_event: Electron.IpcRendererEvent, arg1: VersionInfo) => {
      setVersionInfo(arg1)
      setUpdateError(undefined)
      if (arg1.update) {
        setModalBtn((state) => ({
          ...state,
          cancelText: 'Cancel',
          okText: 'Update',
          onOk: () => api.call('start-download')
        }))
        setUpdateAvailable(true)
      } else {
        setUpdateAvailable(false)
      }
    },
    []
  )

  const onUpdateError = useCallback((_event: Electron.IpcRendererEvent, arg1: ErrorType) => {
    setUpdateAvailable(false)
    setUpdateError(arg1)
  }, [])

  const onDownloadProgress = useCallback(
    (_event: Electron.IpcRendererEvent, arg1: ProgressInfo) => {
      setProgressInfo(arg1)
    },
    []
  )

  const onUpdateDownloaded = useCallback((_event: Electron.IpcRendererEvent, ..._: any[]) => {
    setProgressInfo({ percent: 100 })
    setModalBtn((state) => ({
      ...state,
      cancelText: 'Later',
      okText: 'Install now',
      onOk: () => api.call('quit-and-install')
    }))
  }, [])

  useEffect(() => {
    const Events = [
      IPCEvent('update-can-available', onUpdateCanAvailable),
      IPCEvent('update-error', onUpdateError),
      IPCEvent('download-progress', onDownloadProgress),
      IPCEvent('update-downloaded', onUpdateDownloaded)
    ]

    return () => {
      Events.forEach((RemoveIPCEvent) => {
        RemoveIPCEvent()
      })
    }
  }, [])

  return (
    <div>
      <div className="flex flex-col items-center justify-center h-full">
        <Dialog open={modalOpen} onOpenChange={(open) => setModalOpen(open)}>
          <DialogTrigger asChild>
            <Button disabled={checking} onClick={checkUpdate} variant="outline">
              {checking ? 'Checking...' : 'Check for Update'}
            </Button>
          </DialogTrigger>
          <DialogContent>
            {!updateError && checking ? (
              <>Checking for updates...</>
            ) : (
              <DialogHeader>
                <DialogTitle>
                  {updateError
                    ? 'There was an error downloading the latest version.'
                    : updateAvailable
                      ? 'An update is available.'
                      : 'You are up to date.'}
                </DialogTitle>
                <DialogDescription>
                  {updateError
                    ? updateError.message
                    : updateAvailable
                      ? `The latest version is: ${versionInfo?.newVersion}`
                      : ''}
                </DialogDescription>
              </DialogHeader>
            )}

            {updateAvailable && (
              <>
                <div>
                  <div className="mb-2 flex flex-row gap-2">
                    <Badge>{versionInfo?.version}</Badge>
                    <MoveRight />
                    <Badge>{versionInfo?.newVersion}</Badge>
                  </div>

                  <div>
                    <Progress value={progressInfo?.percent} />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={modalBtn?.onCancel}>
                    {modalBtn?.cancelText}
                  </Button>
                  <Button variant="outline" onClick={modalBtn?.onOk}>
                    {modalBtn?.okText}
                  </Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

export default CheckForUpdate
