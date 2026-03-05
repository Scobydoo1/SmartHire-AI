import React, { useState } from 'react'
import { PermissionsModal } from './PermissionsModal'
import { LeftPanel } from './LeftPanel'
import { CenterPanel } from './CenterPanel'
import { RightPanel } from './RightPanel'
import { Toaster } from 'sonner'

export const InterviewWorkspace: React.FC = () => {
  const [permissionsGranted, setPermissionsGranted] = useState(true) // Temporarily set to true for testing
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null)

  const handlePermissionsGranted = (stream: MediaStream) => {
    setMediaStream(stream)
    setPermissionsGranted(true)
  }

  return (
    <div className="h-screen w-full overflow-hidden bg-zinc-950 font-sans text-zinc-50">
      {!permissionsGranted && <PermissionsModal onPermissionsGranted={handlePermissionsGranted} />}

      {/* Main Dashboard Layout: 3 Panels */}
      <div
        className={`flex h-full w-full transition-opacity duration-500 ${
          permissionsGranted ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        {/* Left Panel: AI Presence & Transcript (25%) */}
        <div className="h-full w-1/4 min-w-[300px]">
          <LeftPanel />
        </div>

        {/* Center Panel: Code Editor & Output (55%) */}
        <div className="h-full min-w-[500px] flex-1">
          <CenterPanel />
        </div>

        {/* Right Panel: Candidate Webcam & Emotion Matrix (20%) */}
        <div className="h-full w-1/5 min-w-[280px]">
          <RightPanel mediaStream={mediaStream} />
        </div>
      </div>

      {/* Toast Notifications */}
      <Toaster theme="dark" position="top-right" />
    </div>
  )
}
