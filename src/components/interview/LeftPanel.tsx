import React, { useEffect, useRef, useState } from 'react'
import { Mic, Loader2, Volume2 } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'

type AIState = 'listening' | 'thinking' | 'speaking'

interface TranscriptMessage {
  id: string
  sender: 'user' | 'ai'
  text: string
}

export const LeftPanel: React.FC = () => {
  const [aiState, setAiState] = useState<AIState>('listening')
  const [transcript] = useState<TranscriptMessage[]>([
    {
      id: '1',
      sender: 'ai',
      text: "Hello! I am your SmartHire AI interviewer. Let's start with a coding problem.",
    },
  ])
  const scrollRef = useRef<HTMLDivElement>(null)

  // Auto-scroll transcript
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [transcript])

  // Mocking AI state transitions for visual feedback testing
  useEffect(() => {
    const interval = setInterval(() => {
      setAiState((prev) => {
        if (prev === 'listening') return 'thinking'
        if (prev === 'thinking') return 'speaking'
        return 'listening'
      })
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex h-full flex-col gap-4 border-r border-zinc-800 bg-zinc-950/50 p-4">
      {/* AI Presence & State */}
      <Card className="flex h-1/3 flex-col items-center justify-center border-zinc-800 bg-zinc-900/50 p-6">
        <div className="relative mb-4">
          {/* Avatar / Visual representation */}
          <div className="relative z-10 flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-2 border-zinc-800 bg-zinc-800">
            {aiState === 'listening' && (
              <Mic className="h-10 w-10 animate-pulse text-emerald-500" />
            )}
            {aiState === 'thinking' && (
              <Loader2 className="h-10 w-10 animate-spin text-orange-500" />
            )}
            {aiState === 'speaking' && <Volume2 className="h-10 w-10 text-teal-400" />}
          </div>

          {/* Pulse Rings */}
          {aiState === 'listening' && (
            <div className="absolute inset-0 animate-ping rounded-full border border-emerald-500/30" />
          )}
          {aiState === 'speaking' && (
            <div className="absolute inset-0 scale-150 animate-pulse rounded-full bg-teal-400/20" />
          )}
        </div>

        <div className="text-center">
          <h2 className="flex items-center justify-center gap-2 text-lg font-bold text-zinc-100">
            SmartHire AI
          </h2>
          <p className="mt-1 text-sm font-medium tracking-wider uppercase">
            {aiState === 'listening' && <span className="text-emerald-500">Listening...</span>}
            {aiState === 'thinking' && <span className="text-orange-500">Thinking...</span>}
            {aiState === 'speaking' && <span className="text-teal-400">Speaking...</span>}
          </p>
        </div>
      </Card>

      {/* Live Transcript */}
      <Card className="flex flex-1 flex-col overflow-hidden border-zinc-800 bg-zinc-900/30">
        <div className="border-b border-zinc-800 bg-zinc-900/80 p-3">
          <h3 className="text-xs font-semibold tracking-wider text-zinc-400 uppercase">
            Live Transcript
          </h3>
        </div>
        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
          <div className="flex flex-col gap-4">
            {transcript.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <span className="mb-1 text-[10px] font-semibold tracking-wider text-zinc-500 uppercase">
                  {msg.sender === 'user' ? 'You' : 'AI'}
                </span>
                <div
                  className={`max-w-[90%] rounded-lg px-3 py-2 text-sm ${
                    msg.sender === 'user'
                      ? 'rounded-tr-sm bg-zinc-800 text-zinc-200'
                      : 'rounded-tl-sm border border-emerald-500/20 bg-emerald-500/10 text-emerald-100'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </Card>
    </div>
  )
}
