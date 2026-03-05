import React, { useState } from 'react'
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

interface PermissionsModalProps {
  onPermissionsGranted: (stream: MediaStream) => void
}

export const PermissionsModal: React.FC<PermissionsModalProps> = ({ onPermissionsGranted }) => {
  const [open, setOpen] = useState(true)
  const [status, setStatus] = useState<'idle' | 'requesting' | 'granted' | 'denied'>('idle')
  const [errorDesc, setErrorDesc] = useState<string>('')

  const requestPermissions = async () => {
    try {
      setStatus('requesting')
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      })
      setStatus('granted')
      setOpen(false)
      onPermissionsGranted(stream)
    } catch (err: unknown) {
      console.error('Permission error:', err)
      setStatus('denied')
      setErrorDesc((err as Error).message || 'Failed to access camera and microphone.')
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* prevent closing by clicking outside or pressing escape */}
      <DialogContent
        className="border-zinc-800 bg-zinc-950 text-zinc-50 sm:max-w-[425px]"
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Camera className="h-5 w-5" />
            <Mic className="h-5 w-5" />
            Device Permissions
          </DialogTitle>
          <DialogDescription className="text-zinc-400">
            SmartHire AI needs access to your camera and microphone to conduct the interview.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-4">
          <div className="flex items-center gap-4 rounded-md border border-zinc-800 bg-zinc-900 p-3">
            <div
              className={`rounded-full p-2 ${status === 'granted' ? 'bg-emerald-500/20 text-emerald-500' : 'bg-zinc-800 text-zinc-400'}`}
            >
              {status === 'granted' ? (
                <CheckCircle2 className="h-5 w-5" />
              ) : (
                <Mic className="h-5 w-5" />
              )}
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-medium">Microphone</h4>
              <p className="text-xs text-zinc-500">For speaking with the AI</p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-md border border-zinc-800 bg-zinc-900 p-3">
            <div
              className={`rounded-full p-2 ${status === 'granted' ? 'bg-emerald-500/20 text-emerald-500' : 'bg-zinc-800 text-zinc-400'}`}
            >
              {status === 'granted' ? (
                <CheckCircle2 className="h-5 w-5" />
              ) : (
                <Camera className="h-5 w-5" />
              )}
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-medium">Camera</h4>
              <p className="text-xs text-zinc-500">For live emotion analysis</p>
            </div>
          </div>

          {status === 'denied' && (
            <div className="flex items-start gap-2 rounded-md border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-500">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <p>{errorDesc}. Please allow permissions in your browser settings and try again.</p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            onClick={requestPermissions}
            disabled={status === 'requesting' || status === 'granted'}
            className="w-full bg-emerald-500 font-medium text-zinc-950 hover:bg-emerald-600"
          >
            {status === 'requesting'
              ? 'Requesting...'
              : status === 'granted'
                ? 'Granted!'
                : 'Grant Permissions'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
