/**
 * InterviewWorkspace
 *
 * Full-screen interview environment for candidates.
 *
 * Layout (three-column):
 *  ┌─────────────┬────────────────────────┬──────────────┐
 *  │  LeftPanel  │      CenterPanel       │  RightPanel  │
 *  │  25 % min   │  flex-1 (remaining)    │  20 % min    │
 *  │  300 px     │  500 px min-width      │  280 px      │
 *  └─────────────┴────────────────────────┴──────────────┘
 *
 * Props (`InterviewWorkspaceProps`):
 *  - `skipPermissions` – skip the modal gate (useful in E2E tests)
 *  - `onSessionEnd`    – called when the session ends (reserved for future use)
 */

import React, { useCallback, useState } from 'react'
import { Toaster } from 'sonner'
import { cn } from '@/lib/utils'
import { useTheme } from '@/components/theme'
import { PermissionsModal } from './PermissionsModal'
import { LeftPanel } from './LeftPanel'
import { CenterPanel } from './CenterPanel'
import { RightPanel } from './RightPanel'
import type { InterviewWorkspaceProps } from './types'

export const InterviewWorkspace: React.FC<InterviewWorkspaceProps> = ({
  skipPermissions = true,
}) => {
  const { resolvedTheme } = useTheme()
  const [permissionsGranted, setPermissionsGranted] = useState(skipPermissions)
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null)

  const handlePermissionsGranted = useCallback((stream: MediaStream) => {
    setMediaStream(stream)
    setPermissionsGranted(true)
  }, [])

  return (
    <div
      className="h-screen w-full overflow-hidden bg-background font-sans text-foreground"
      role="main"
      aria-label="Interview workspace"
    >
      {/* Permissions gate — shown before media is ready */}
      {!permissionsGranted && (
        <PermissionsModal onPermissionsGranted={handlePermissionsGranted} />
      )}

      {/* Three-column layout — fades in once permissions are granted */}
      <div
        className={cn(
          'flex h-full w-full transition-opacity duration-500',
          permissionsGranted ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
        aria-hidden={!permissionsGranted}
      >
        {/* Left: AI Presence & Live Transcript — 25 %, min 300 px */}
        <div className="h-full w-1/4 min-w-75">
          <LeftPanel />
        </div>

        {/* Center: Code Editor & Output Console — fills remaining space */}
        <div className="h-full min-w-125 flex-1">
          <CenterPanel />
        </div>

        {/* Right: Candidate Camera & Emotion Analysis — 20 %, min 280 px */}
        <div className="h-full w-1/5 min-w-70">
          <RightPanel mediaStream={mediaStream} />
        </div>
      </div>

      {/* Toast notifications — follows the active theme */}
      <Toaster theme={resolvedTheme} position="top-right" />
    </div>
  )
}

