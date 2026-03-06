import React, { useCallback, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Camera, Mic, CheckCircle2, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { PermissionsModalProps } from './types'

type PermissionStatus = 'idle' | 'requesting' | 'granted' | 'denied'

/** A single permission row (microphone or camera). */
const PermissionRow: React.FC<{
  icon: React.ReactNode
  grantedIcon: React.ReactNode
  label: string
  description: string
  granted: boolean
}> = ({ icon, grantedIcon, label, description, granted }) => (
  <div className="flex items-center gap-4 rounded-md border border-border bg-card p-3">
    <div
      className={cn(
        'rounded-full p-2',
        granted ? 'bg-emerald-500/20 text-emerald-500' : 'bg-muted text-muted-foreground',
      )}
      aria-hidden="true"
    >
      {granted ? grantedIcon : icon}
    </div>
    <div className="flex-1">
      <p className="text-sm font-medium text-foreground">{label}</p>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
    {granted && (
      <span className="text-xs font-semibold text-emerald-500" aria-label="Permission granted">
        Granted
      </span>
    )}
  </div>
)

export const PermissionsModal: React.FC<PermissionsModalProps> = ({ onPermissionsGranted }) => {
  const [open, setOpen] = useState(true)
  const [status, setStatus] = useState<PermissionStatus>('idle')
  const [errorDesc, setErrorDesc] = useState('')

  const requestPermissions = useCallback(async () => {
    try {
      setStatus('requesting')
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      setStatus('granted')
      setOpen(false)
      onPermissionsGranted(stream)
    } catch (err: unknown) {
      console.error('Permission error:', err)
      setStatus('denied')
      setErrorDesc((err as Error).message || 'Failed to access camera and microphone.')
    }
  }, [onPermissionsGranted])

  const isGranted = status === 'granted'

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* Prevent dismissal — permissions are required to proceed. */}
      <DialogContent
        className="border-border bg-background text-foreground sm:max-w-106.25"
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        aria-describedby="permissions-desc"
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Camera className="h-5 w-5" aria-hidden="true" />
            <Mic className="h-5 w-5" aria-hidden="true" />
            Device Permissions Required
          </DialogTitle>
          <DialogDescription id="permissions-desc" className="text-muted-foreground">
            SmartHire AI needs your camera and microphone to conduct the interview. Your stream is
            processed locally and never stored.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3 py-4" role="list" aria-label="Required permissions">
          <PermissionRow
            icon={<Mic className="h-5 w-5" />}
            grantedIcon={<CheckCircle2 className="h-5 w-5" />}
            label="Microphone"
            description="For speaking with the AI interviewer"
            granted={isGranted}
          />
          <PermissionRow
            icon={<Camera className="h-5 w-5" />}
            grantedIcon={<CheckCircle2 className="h-5 w-5" />}
            label="Camera"
            description="For live emotion and presence analysis"
            granted={isGranted}
          />

          {status === 'denied' && (
            <div
              role="alert"
              className="flex items-start gap-2 rounded-md border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400"
            >
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              <p>
                {errorDesc} — Please allow permissions in your browser settings and try again.
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            onClick={requestPermissions}
            disabled={status === 'requesting' || isGranted}
            aria-busy={status === 'requesting'}
            className="w-full cursor-pointer bg-emerald-500 font-medium text-zinc-950 transition-colors hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {status === 'requesting'
              ? 'Requesting…'
              : isGranted
                ? 'Permissions Granted!'
                : 'Grant Permissions'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
