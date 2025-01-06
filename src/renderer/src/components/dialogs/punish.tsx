import { Button } from '@/components/ui/button'
import { DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { FloatingLabelInput } from '@/components/ui/floating-input'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { PresetSelector } from '@/components/ui/preset-selector'
import { Separator } from '@/components/ui/separator'
import { Slider } from '@/components/ui/slider'
import { PunishmentSchema } from '@/lib/forms'
import { zodResolver } from '@hookform/resolvers/zod'
import { createContext, useContext, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { useAPI } from '../api-provider'
import { server } from '@/main'

function GetPunishmentData(puns: Punishment[]) {
  const min_duration = Math.max(...puns.map(({ min_duration }) => min_duration))
  const max_duration = Math.max(...puns.map(({ max_duration }) => max_duration))
  const duration = Math.max(
    min_duration,
    Math.min(max_duration, Math.floor((max_duration + min_duration) / 2))
  )
  const reason = puns.map(({ reason }) => reason).join(', ')

  return { min_duration, max_duration, duration, reason }
}

interface PunishmentDialogProps {
  setOpen?: (open: boolean) => void
  player: Player
}

const KickSchema = z.object({
  reason: z.string().min(1, {
    message: 'Reason is required'
  })
})

export function KickDialog({ player, setOpen }: PunishmentDialogProps) {
  const { setReason, reason } = usePunishments()
  const { api } = useAPI()

  const icon = '🥾'
  const animation = {
    kick: {
      rotate: [0, 90, -20, 30, -10, 0],
      x: [0, -5, 20, -5, 0],
      y: [0, 0, -5, 0, 0],
      transition: {
        duration: 1.2,
        times: [0, 0.4, 0.6, 0.8, 1],
        ease: ['easeOut', 'easeIn', 'easeOut', 'easeInOut'],
        repeat: Infinity
      }
    }
  }

  const form = useForm<z.infer<typeof KickSchema>>({
    resolver: zodResolver(KickSchema),
    defaultValues: {
      reason
    }
  })

  const onSubmit = (data: z.infer<typeof KickSchema>) => {
    api.command({ type: 'kick', player, reason: data.reason, server: server.value })
    setReason(data.reason)
    setOpen?.(false)
  }

  const onPunishmentChange = (punishments: Punishment[]) => {
    const { reason: newReason } = GetPunishmentData(punishments)
    setReason(newReason)
    form.setValue('reason', newReason)
  }

  return (
    <>
      <DialogHeader className="flex justify-center">
        <DialogTitle className="text-center capitalize">Kick {player.displayName}</DialogTitle>
        <DialogDescription className="text-center">
          You are about to kick {player.displayName} ({player.playfabId})
        </DialogDescription>
      </DialogHeader>

      <PresetSelector
        presetKey="punishments"
        schema={PunishmentSchema}
        onChange={onPunishmentChange}
        className="w-full"
      />

      <Separator />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="reason"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <FloatingLabelInput label="Reason" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button variant="outline" className="w-full" type="submit">
            <motion.span animate="kick" variants={animation}>
              {icon}
            </motion.span>
          </Button>
        </form>
      </Form>
    </>
  )
}

const BanSchema = z.object({
  reason: z.string().min(1, {
    message: 'Reason is required'
  }),
  duration: z.coerce
    .number()
    .int()
    .min(1, {
      message: 'Duration is required'
    })
    .max(999_999, {
      message: 'Duration is too long'
    })
})

export function BanDialog({ player, setOpen }: PunishmentDialogProps) {
  const { setReason, setDuration, reason, duration } = usePunishments()
  const [selPuns, setSelPuns] = useState<Punishment[]>([])
  const { api } = useAPI()

  const icon = '🔨'
  const animation = {
    ban: {
      x: [0, 2, -2, 1, -1, 0],
      y: [0, 5, -5, 2.5, -2.5, 0],
      rotate: [0, -30, 30, -15, 15, 0],
      transition: { duration: 1, repeat: Infinity, ease: 'easeInOut' }
    }
  }

  const form = useForm<z.infer<typeof BanSchema>>({
    resolver: zodResolver(BanSchema),
    defaultValues: {
      reason,
      duration: duration.avg
    }
  })

  const onSubmit = (data: z.infer<typeof BanSchema>) => {
    api.command({
      type: 'ban',
      player,
      reason: data.reason,
      duration: data.duration,
      server: server.value
    })
    setDuration({ min: duration.min, max: duration.max, avg: data.duration })
    setReason(data.reason)
    setOpen?.(false)
  }

  const onPunishmentChange = (punishments: Punishment[]) => {
    const {
      reason: newReason,
      min_duration,
      max_duration,
      duration: newDuration
    } = GetPunishmentData(punishments)
    setSelPuns(punishments)

    setReason(newReason)
    form.setValue('reason', newReason)
    setDuration({ min: min_duration, max: max_duration, avg: newDuration })
    form.setValue('duration', newDuration)
  }

  return (
    <>
      <DialogHeader className="flex justify-center">
        <DialogTitle className="text-center capitalize">Ban {player.displayName}</DialogTitle>
        <DialogDescription className="text-center">
          You are about to ban {player.displayName} ({player.playfabId})
        </DialogDescription>
      </DialogHeader>

      <PresetSelector
        presetKey="punishments"
        schema={PunishmentSchema}
        onChange={onPunishmentChange}
        className="w-full"
      />

      {selPuns.length > 0 && (
        <>
          {duration.max === duration.min ? (
            <div className="text-xs p-2 text-center bg-background/50 border border-border/50 rounded-lg flex flex-col">
              <span>
                One or more of the selected punishments do not allow for a custom duration. (min:{' '}
                {duration.min} hours, max: {duration.max} hours)
              </span>
            </div>
          ) : (
            <Slider
              min={duration.min}
              max={duration.max}
              value={[duration.avg]}
              step={1}
              className="p-4"
              onValueChange={(value) => {
                setDuration({ ...duration, avg: value[0] })
                form.setValue('duration', value[0])
              }}
            />
          )}
        </>
      )}

      <Separator />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="reason"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <FloatingLabelInput label="Reason" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <FloatingLabelInput label="Duration" {...field} type="number" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button variant="outline" className="w-full" type="submit">
            <motion.span animate="ban" variants={animation}>
              {icon}
            </motion.span>
          </Button>
        </form>
      </Form>
    </>
  )
}

interface PunishmentContextProps {
  reason: string
  duration: { min: number; max: number; avg: number }
  setReason: (reason: string) => void
  setDuration: (duration: { min: number; max: number; avg: number }) => void
}

interface PunishmentProviderProps {
  children?: React.ReactNode
}

const PunishmentContext = createContext<PunishmentContextProps | undefined>(undefined)
export function PunishmentProvider({ children }: PunishmentProviderProps) {
  const [reason, setReason] = useState<string>(() => {
    const saved = localStorage.getItem('punishment-reason') as string
    const initialValue = JSON.parse(saved)
    return initialValue || ''
  })
  const [duration, setDuration] = useState<{ min: number; max: number; avg: number }>(() => {
    const saved = localStorage.getItem('punishment-duration') as string
    const initialValue = JSON.parse(saved)
    return initialValue || { min: 1, max: 1, avg: 1 }
  })

  useEffect(() => {
    localStorage.setItem('punishment-reason', JSON.stringify(reason))
  }, [reason])
  useEffect(() => {
    localStorage.setItem('punishment-duration', JSON.stringify(duration))
  }, [duration])

  return (
    <PunishmentContext.Provider value={{ reason, duration, setReason, setDuration }}>
      {children}
    </PunishmentContext.Provider>
  )
}

const usePunishments = (): PunishmentContextProps => {
  const context = useContext(PunishmentContext)
  if (context === undefined) {
    throw new Error('usePunishment must be used within a PunishmentProvider')
  }
  return context
}
