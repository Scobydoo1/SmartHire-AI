import React, { useEffect, useRef, useState } from 'react'
import { Wifi, WifiOff } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { toast } from 'sonner' // Using Sonner instead of Toast Component directly

interface RightPanelProps {
  mediaStream: MediaStream | null
}

export const RightPanel: React.FC<RightPanelProps> = ({ mediaStream }) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isConnected, setIsConnected] = useState(true)
  const [emotion, setEmotion] = useState('Neutral')
  const [emotionScore, setEmotionScore] = useState(65)

  useEffect(() => {
    if (videoRef.current && mediaStream) {
      videoRef.current.srcObject = mediaStream
    }
  }, [mediaStream])

  // Mocking WebSocket connection and Emotion Gauge
  useEffect(() => {
    const emotions = ['Focused', 'Thinking', 'Neutral', 'Frustrated', 'Confident']

    const wsInterval = setInterval(() => {
      // Mocking live emotion changes every 5s
      const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)]
      setEmotion(randomEmotion)
      setEmotionScore(Math.floor(Math.random() * 40) + 60)

      // Mock random latency spikes or disconnects
      if (Math.random() > 0.95) {
        setIsConnected(false)
        toast.error('WebSocket Disconnected', {
          description: 'Attempting to reconnect...',
        })

        // Auto reconnect
        setTimeout(() => {
          setIsConnected(true)
          toast.success('Connection Restored')
        }, 3000)
      }
    }, 5000)

    return () => clearInterval(wsInterval)
  }, [])

  return (
    <div className="flex h-full flex-col gap-4 bg-zinc-950/50 p-4">
      {/* Network Status Top Right */}
      <div className="flex justify-end pr-2">
        <Badge
          variant="outline"
          className={`flex items-center gap-2 px-3 py-1 ${
            isConnected
              ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
              : 'border-red-500/30 bg-red-500/10 text-red-400'
          }`}
        >
          {isConnected ? (
            <Wifi className="h-3 w-3" />
          ) : (
            <WifiOff className="h-3 w-3 animate-pulse" />
          )}
          {isConnected ? 'Connected' : 'Reconnecting...'}
        </Badge>
      </div>

      {/* Candidate Camera Stream */}
      <div className="relative aspect-video overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900 shadow-lg">
        {mediaStream ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="h-full w-full -scale-x-100 transform object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-sm text-zinc-600">
            Camera Off
          </div>
        )}

        {/* Recording Indicator Overlay */}
        <div className="absolute top-3 left-3 flex items-center gap-2 rounded-md bg-black/50 px-2 py-1 backdrop-blur-md">
          <div className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
          <span className="text-[10px] font-bold tracking-widest text-zinc-300 uppercase">REC</span>
        </div>
      </div>

      {/* Emotion Gauge Widget */}
      <Card className="flex flex-col gap-4 border-zinc-800 bg-zinc-900/40 p-5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-zinc-300">Real-time Analysis</h3>
          <span className="text-xs text-zinc-500">Live</span>
        </div>

        <div className="flex items-end justify-between">
          <div>
            <div className="mb-1 text-xs tracking-wider text-zinc-500 uppercase">State</div>
            <div
              className={`text-xl font-bold ${
                emotion === 'Frustrated'
                  ? 'text-orange-400'
                  : emotion === 'Focused' || emotion === 'Confident'
                    ? 'text-emerald-400'
                    : 'text-zinc-300'
              }`}
            >
              {emotion}
            </div>
          </div>

          <div className="text-right">
            <div className="mb-1 text-xs tracking-wider text-zinc-500 uppercase">Confidence</div>
            <div className="text-2xl font-light text-zinc-100">{emotionScore}%</div>
          </div>
        </div>

        {/* Emotion Progress Bar */}
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-zinc-800">
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
          className="w-full justify-center border-zinc-800 py-2 text-zinc-500"
        >
          Interview in Progress
        </Badge>
      </div>
    </div>
  )
}
