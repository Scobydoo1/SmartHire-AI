import React, { memo } from 'react'
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { LogOut, Loader2, CheckCircle2, AlertCircle, CloudUpload } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { UploadStatus } from './hooks/useSessionRecorder'

interface Props {
  open: boolean
  uploadStatus: UploadStatus
  duration: number
  onConfirm: () => void
  onCancel: () => void
}

const fmt = (s: number) =>
  `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

const STATUS_UI: Record<UploadStatus, { icon: React.ReactNode; text: string; color: string }> = {
  idle:      { icon: <LogOut className="h-5 w-5" />,        text: 'Ready to end session', color: 'text-muted-foreground' },
  recording: { icon: <LogOut className="h-5 w-5" />,        text: 'Ready to end session', color: 'text-muted-foreground' },
  uploading: { icon: <Loader2 className="h-5 w-5 animate-spin" />, text: 'Saving your session…', color: 'text-blue-400' },
  done:      { icon: <CheckCircle2 className="h-5 w-5" />,  text: 'Session saved!',        color: 'text-emerald-400' },
  error:     { icon: <AlertCircle className="h-5 w-5" />,   text: 'Upload failed. Retry?', color: 'text-red-400' },
}

export const EndInterviewModal = memo(function EndInterviewModal({
  open, uploadStatus, duration, onConfirm, onCancel,
}: Props) {
  const isUploading = uploadStatus === 'uploading'
  const isDone      = uploadStatus === 'done'
  const { icon, text, color } = STATUS_UI[uploadStatus]

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o && !isUploading) onCancel() }}>
      <DialogContent
        className="border-border bg-background text-foreground sm:max-w-sm"
        onEscapeKeyDown={(e) => { if (isUploading) e.preventDefault() }}
        onInteractOutside={(e) => { if (isUploading) e.preventDefault() }}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <LogOut className="h-5 w-5 text-red-400" />
            End Interview
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Session duration: <span className="font-mono font-bold text-foreground">{fmt(duration)}</span>
          </DialogDescription>
        </DialogHeader>

        {/* Upload status */}
        <div className={cn('flex items-center gap-3 rounded-lg border border-border bg-card/50 p-4', color)}>
          {icon}
          <div>
            <p className="text-sm font-medium">{text}</p>
            {isUploading && (
              <p className="text-xs text-muted-foreground mt-0.5">
                Video + audio → S3 → AI pipeline
              </p>
            )}
            {isDone && (
              <p className="text-xs text-muted-foreground mt-0.5">
                Your recording has been submitted for analysis
              </p>
            )}
          </div>
        </div>

        {!isDone && (
          <p className="text-xs text-muted-foreground text-center">
            Your video and transcript will be analyzed by AI after submission.
          </p>
        )}

        <DialogFooter className="gap-2">
          {!isDone && (
            <Button
              variant="outline"
              onClick={onCancel}
              disabled={isUploading}
              className="flex-1 border-border"
            >
              Continue Interview
            </Button>
          )}
          <Button
            onClick={isDone ? onCancel : onConfirm}
            disabled={isUploading}
            className={cn(
              'flex-1 font-medium',
              isDone
                ? 'bg-emerald-500 text-zinc-950 hover:bg-emerald-400'
                : 'bg-red-500/90 text-white hover:bg-red-500',
            )}
          >
            {isUploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isUploading ? 'Uploading…' : isDone ? 'Close' : 'End & Submit'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
})
