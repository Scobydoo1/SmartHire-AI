import React, { useCallback, useEffect, lazy, Suspense, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Toaster } from 'sonner'
import { cn } from '@/lib/utils'
import { useTheme } from '@/components/theme'
import { PermissionsModal } from './PermissionsModal'
import { EndInterviewModal } from './EndInterviewModal'
import { useMediaDevices } from './hooks/useMediaDevices'
import { useSpeechTranscript } from './hooks/useSpeechTranscript'
import { useSessionRecorder } from './hooks/useSessionRecorder'
import type { InterviewWorkspaceProps } from './types'

const LeftPanel   = lazy(() => import('./LeftPanel').then((m) => ({ default: m.LeftPanel })))
const CenterPanel = lazy(() => import('./CenterPanel').then((m) => ({ default: m.CenterPanel })))
const RightPanel  = lazy(() => import('./RightPanel').then((m) => ({ default: m.RightPanel })))

const SESSION_ID = new URLSearchParams(window.location.search).get('code') ?? 'unknown'

const PanelSkeleton = () => <div className="h-full w-full animate-pulse rounded-lg bg-muted/20" />

export const InterviewWorkspace: React.FC<InterviewWorkspaceProps> = ({
  skipPermissions = false,
}) => {
  const { resolvedTheme } = useTheme()
  const navigate = useNavigate()
  const [showEndModal, setShowEndModal] = useState(false)

  const {
    stream, isMicMuted, isCameraOff,
    permissionsGranted, requestPermissions,
    toggleMic, toggleCamera, stopAll,
  } = useMediaDevices()

  const { transcript, isListening } = useSpeechTranscript(stream)
  const { uploadStatus, duration, startRecording, stopAndUpload } = useSessionRecorder()

  const isReady = skipPermissions || permissionsGranted

  const handleGrant = useCallback(async () => {
    await requestPermissions()
  }, [requestPermissions])

  useEffect(() => {
    if (stream && isReady) startRecording(stream)
  }, [stream, isReady, startRecording])

  // Auto-redirect to dashboard 2s after upload completes
  useEffect(() => {
    if (uploadStatus === 'done') {
      stopAll()
      const timer = setTimeout(() => navigate('/'), 2000)
      return () => clearTimeout(timer)
    }
  }, [uploadStatus, stopAll, navigate])

  const handleEndConfirm = useCallback(async () => {
    await stopAndUpload(SESSION_ID, transcript)
  }, [stopAndUpload, transcript])

  const handleEndCancel = useCallback(() => {
    setShowEndModal(false)
  }, [])

  return (
    <div className="h-screen w-full overflow-hidden bg-background font-sans text-foreground" role="main">
      {!isReady && <PermissionsModal onPermissionsGranted={handleGrant} />}

      <div
        className={cn(
          'flex h-full w-full transition-opacity duration-500',
          isReady ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
        aria-hidden={!isReady}
      >
        <Suspense fallback={<div className="h-full w-1/4 min-w-75"><PanelSkeleton /></div>}>
          <div className="h-full w-1/4 min-w-75">
            <LeftPanel transcript={transcript} isListening={isListening} />
          </div>
        </Suspense>

        <Suspense fallback={<div className="h-full min-w-125 flex-1"><PanelSkeleton /></div>}>
          <div className="h-full min-w-125 flex-1">
            <CenterPanel onEndInterview={() => setShowEndModal(true)} />
          </div>
        </Suspense>

        <Suspense fallback={<div className="h-full w-1/5 min-w-70"><PanelSkeleton /></div>}>
          <div className="h-full w-1/5 min-w-70">
            <RightPanel
              mediaStream={stream}
              isMicMuted={isMicMuted}
              isCameraOff={isCameraOff}
              onToggleMic={toggleMic}
              onToggleCamera={toggleCamera}
            />
          </div>
        </Suspense>
      </div>

      <EndInterviewModal
        open={showEndModal}
        uploadStatus={uploadStatus}
        duration={duration}
        onConfirm={handleEndConfirm}
        onCancel={handleEndCancel}
      />

      <Toaster theme={resolvedTheme} position="top-right" />
    </div>
  )
}
