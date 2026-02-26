import React, { useState } from "react";
import { PermissionsModal } from "./PermissionsModal";
import { LeftPanel } from "./LeftPanel";
import { CenterPanel } from "./CenterPanel";
import { RightPanel } from "./RightPanel";
import { Toaster } from "sonner";

export const InterviewWorkspace: React.FC = () => {
  const [permissionsGranted, setPermissionsGranted] = useState(true); // Temporarily set to true for testing
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);

  const handlePermissionsGranted = (stream: MediaStream) => {
    setMediaStream(stream);
    setPermissionsGranted(true);
  };

  return (
    <div className="w-full h-screen bg-zinc-950 text-zinc-50 overflow-hidden font-sans">
      {!permissionsGranted && (
        <PermissionsModal onPermissionsGranted={handlePermissionsGranted} />
      )}

      {/* Main Dashboard Layout: 3 Panels */}
      <div
        className={`w-full h-full flex transition-opacity duration-500 ${
          permissionsGranted ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Left Panel: AI Presence & Transcript (25%) */}
        <div className="w-1/4 min-w-[300px] h-full">
          <LeftPanel />
        </div>

        {/* Center Panel: Code Editor & Output (55%) */}
        <div className="flex-1 min-w-[500px] h-full">
          <CenterPanel />
        </div>

        {/* Right Panel: Candidate Webcam & Emotion Matrix (20%) */}
        <div className="w-1/5 min-w-[280px] h-full">
          <RightPanel mediaStream={mediaStream} />
        </div>
      </div>

      {/* Toast Notifications */}
      <Toaster theme="dark" position="top-right" />
    </div>
  );
};
