import React, { useEffect, useRef, useState } from "react";
import { Wifi, WifiOff } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { toast } from "sonner"; // Using Sonner instead of Toast Component directly

interface RightPanelProps {
  mediaStream: MediaStream | null;
}

export const RightPanel: React.FC<RightPanelProps> = ({ mediaStream }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isConnected, setIsConnected] = useState(true);
  const [emotion, setEmotion] = useState("Neutral");
  const [emotionScore, setEmotionScore] = useState(65);

  useEffect(() => {
    if (videoRef.current && mediaStream) {
      videoRef.current.srcObject = mediaStream;
    }
  }, [mediaStream]);

  // Mocking WebSocket connection and Emotion Gauge
  useEffect(() => {
    const emotions = [
      "Focused",
      "Thinking",
      "Neutral",
      "Frustrated",
      "Confident",
    ];

    const wsInterval = setInterval(() => {
      // Mocking live emotion changes every 5s
      const randomEmotion =
        emotions[Math.floor(Math.random() * emotions.length)];
      setEmotion(randomEmotion);
      setEmotionScore(Math.floor(Math.random() * 40) + 60);

      // Mock random latency spikes or disconnects
      if (Math.random() > 0.95) {
        setIsConnected(false);
        toast.error("WebSocket Disconnected", {
          description: "Attempting to reconnect...",
        });

        // Auto reconnect
        setTimeout(() => {
          setIsConnected(true);
          toast.success("Connection Restored");
        }, 3000);
      }
    }, 5000);

    return () => clearInterval(wsInterval);
  }, []);

  return (
    <div className="h-full flex flex-col p-4 bg-zinc-950/50 gap-4">
      {/* Network Status Top Right */}
      <div className="flex justify-end pr-2">
        <Badge
          variant="outline"
          className={`px-3 py-1 flex items-center gap-2 ${
            isConnected
              ? "border-emerald-500/30 text-emerald-400 bg-emerald-500/10"
              : "border-red-500/30 text-red-400 bg-red-500/10"
          }`}
        >
          {isConnected ? (
            <Wifi className="w-3 h-3" />
          ) : (
            <WifiOff className="w-3 h-3 animate-pulse" />
          )}
          {isConnected ? "Connected" : "Reconnecting..."}
        </Badge>
      </div>

      {/* Candidate Camera Stream */}
      <div className="relative rounded-lg overflow-hidden border border-zinc-800 bg-zinc-900 aspect-video shadow-lg">
        {mediaStream ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover transform -scale-x-100"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-zinc-600 text-sm">
            Camera Off
          </div>
        )}

        {/* Recording Indicator Overlay */}
        <div className="absolute top-3 left-3 flex items-center gap-2 bg-black/50 backdrop-blur-md px-2 py-1 rounded-md">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-[10px] uppercase tracking-widest font-bold text-zinc-300">
            REC
          </span>
        </div>
      </div>

      {/* Emotion Gauge Widget */}
      <Card className="p-5 bg-zinc-900/40 border-zinc-800 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-zinc-300">
            Real-time Analysis
          </h3>
          <span className="text-xs text-zinc-500">Live</span>
        </div>

        <div className="flex items-end justify-between">
          <div>
            <div className="text-xs text-zinc-500 uppercase tracking-wider mb-1">
              State
            </div>
            <div
              className={`text-xl font-bold ${
                emotion === "Frustrated"
                  ? "text-orange-400"
                  : emotion === "Focused" || emotion === "Confident"
                    ? "text-emerald-400"
                    : "text-zinc-300"
              }`}
            >
              {emotion}
            </div>
          </div>

          <div className="text-right">
            <div className="text-xs text-zinc-500 uppercase tracking-wider mb-1">
              Confidence
            </div>
            <div className="text-2xl font-light text-zinc-100">
              {emotionScore}%
            </div>
          </div>
        </div>

        {/* Emotion Progress Bar */}
        <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden mt-2">
          <div
            className="h-full bg-emerald-500 transition-all duration-1000 ease-in-out"
            style={{ width: `${emotionScore}%` }}
          />
        </div>
      </Card>

      {/* Session Controls */}
      <div className="mt-auto">
        <Badge
          variant="outline"
          className="w-full justify-center py-2 text-zinc-500 border-zinc-800"
        >
          Interview in Progress
        </Badge>
      </div>
    </div>
  );
};
