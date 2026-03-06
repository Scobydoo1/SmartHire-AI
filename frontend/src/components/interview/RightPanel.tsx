import React, { memo, useEffect, useRef } from 'react'
import { Wifi, WifiOff } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { useEmotionAnalysis } from './hooks/useEmotionAnalysis'
import { EMOTION_BAR_COLOR, EMOTION_COLOR } from './config'
import type { RightPanelProps } from './types'

// ---------------------------------------------------------------------------
// Connection badge
// ---------------------------------------------------------------------------

const ConnectionBadge = memo(function ConnectionBadge({ connected }: { connected: boolean }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        'flex items-center gap-2 px-3 py-1 transition-colors duration-300',
        connected
          ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
          : 'border-red-500/30 bg-red-500/10 text-red-400',
      )}
      aria-label={connected ? 'WebSocket connected' : 'Reconnecting…'}
    >
      {connected ? (
        <Wifi className="h-3 w-3" aria-hidden="true" />
      ) : (
        <WifiOff className="h-3 w-3 animate-pulse" aria-hidden="true" />
      )}
      {connected ? 'Connected' : 'Reconnecting…'}
    </Badge>
  )
})

// ---------------------------------------------------------------------------
// Candidate camera feed
// ---------------------------------------------------------------------------

const CameraFeed = memo(function CameraFeed({ stream }: { stream: MediaStream | null }) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    if (stream) {
      video.srcObject = stream
    } else {
      video.srcObject = null
    }

    // Clean up srcObject on unmount to release the media track.
    return () => {
      if (video) video.srcObject = null
    }
  }, [stream])

  return (
    <div
      className="relative aspect-video overflow-hidden rounded-lg border border-border bg-card shadow-lg"
      aria-label="Candidate camera feed"
    >
      {stream ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="h-full w-full -scale-x-100 object-cover"
          aria-label="Your camera preview (mirrored)"
        />
      ) : (
        <div
          className="absolute inset-0 flex items-center justify-center text-sm text-muted-foreground"
          role="status"
        >
          Camera Off
        </div>
      )}

      {/* Recording indicator */}
      <div
        className="absolute top-3 left-3 flex items-center gap-2 rounded-md bg-black/50 px-2 py-1 backdrop-blur-md"
        aria-label="Session recording in progress"
      >
        <div className="h-2 w-2 animate-pulse rounded-full bg-red-500" aria-hidden="true" />
          <span className="text-[10px] font-bold tracking-widest text-foreground/70 uppercase">REC</span>
      </div>
    </div>
  )
})

// ---------------------------------------------------------------------------
// Panel
// ---------------------------------------------------------------------------

export const RightPanel: React.FC<RightPanelProps> = ({ mediaStream }) => {
  const { snapshot, isConnected } = useEmotionAnalysis()
  const { label, score } = snapshot

  return (
    <div
      className="flex h-full flex-col gap-4 bg-background/50 p-4"
      aria-label="Candidate monitoring panel"
    >
      {/* Network status */}
      <div className="flex justify-end">
        <ConnectionBadge connected={isConnected} />
      </div>

      {/* Camera */}
      <CameraFeed stream={mediaStream} />

      {/* Emotion / confidence widget */}
      <Card
        className="flex flex-col gap-4 border-border bg-card/40 p-5"
        role="region"
        aria-label="Real-time emotion analysis"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground/70">Real-time Analysis</h3>
          <span className="text-xs text-muted-foreground" aria-hidden="true">
            Live
          </span>
        </div>

        <div className="flex items-end justify-between">
          <div>
            <p className="mb-1 text-xs tracking-wider text-muted-foreground uppercase">State</p>
            <p
              className={cn('text-xl font-bold transition-colors duration-500', EMOTION_COLOR[label])}
              aria-live="polite"
              aria-atomic="true"
            >
              {label}
            </p>
          </div>
          <div className="text-right">
            <p className="mb-1 text-xs tracking-wider text-muted-foreground uppercase">Confidence</p>
            <p className="text-2xl font-light text-foreground" aria-live="polite" aria-atomic="true">
              {score}%
            </p>
          </div>
        </div>

        {/* Confidence bar */}
        <div
          className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted"
          role="progressbar"
          aria-valuenow={score}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Confidence score: ${score}%`}
        >
          <div
            className={cn('h-full transition-all duration-1000 ease-in-out', EMOTION_BAR_COLOR[label])}
            style={{ width: `${score}%` }}
          />
        </div>
      </Card>

      {/* Session status footer */}
      <div className="mt-auto">
        <Badge
          variant="outline"
          className="w-full justify-center border-border py-2 text-muted-foreground"
          role="status"
        >
          Interview in Progress
        </Badge>
      </div>
    </div>
  )
}


