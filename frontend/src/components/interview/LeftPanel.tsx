import React, { memo, useEffect, useRef } from 'react'
import { Mic, Loader2, Volume2 } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { useAIState } from './hooks/useAIState'
import { DEFAULT_TRANSCRIPT } from './config'
import type { AIState, LeftPanelProps, TranscriptMessage } from './types'

// ---------------------------------------------------------------------------
// AI Avatar
// ---------------------------------------------------------------------------

const AI_STATE_CONFIG: Record<
  AIState,
  { icon: React.ReactNode; label: string; ringClass: string; textClass: string }
> = {
  listening: {
    icon: <Mic className="h-10 w-10 animate-pulse text-emerald-500" aria-hidden="true" />,
    label: 'Listening…',
    ringClass: 'animate-ping border border-emerald-500/30',
    textClass: 'text-emerald-500',
  },
  thinking: {
    icon: <Loader2 className="h-10 w-10 animate-spin text-orange-500" aria-hidden="true" />,
    label: 'Thinking…',
    ringClass: '',
    textClass: 'text-orange-500',
  },
  speaking: {
    icon: <Volume2 className="h-10 w-10 text-teal-400" aria-hidden="true" />,
    label: 'Speaking…',
    ringClass: 'scale-150 animate-pulse bg-teal-400/20',
    textClass: 'text-teal-400',
  },
}

const AIAvatar = memo(function AIAvatar({ state }: { state: AIState }) {
  const { icon, label, ringClass, textClass } = AI_STATE_CONFIG[state]
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative">
        <div
          className="relative z-10 flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-2 border-border bg-muted"
          role="img"
          aria-label={`AI interviewer is ${label}`}
        >
          {icon}
        </div>
        {ringClass && (
          <div className={cn('absolute inset-0 rounded-full', ringClass)} aria-hidden="true" />
        )}
      </div>
      <div className="text-center">
        <p className="text-lg font-bold text-foreground">SmartHire AI</p>
        <p
          className={cn('mt-1 text-sm font-medium tracking-wider uppercase', textClass)}
          aria-live="polite"
          aria-atomic="true"
        >
          {label}
        </p>
      </div>
    </div>
  )
})

// ---------------------------------------------------------------------------
// Transcript message row
// ---------------------------------------------------------------------------

const MessageBubble = memo(function MessageBubble({ msg }: { msg: TranscriptMessage }) {
  const isUser = msg.sender === 'user'
  return (
    <div className={cn('flex flex-col', isUser ? 'items-end' : 'items-start')}>
      <span
        className="mb-1 text-[10px] font-semibold tracking-wider text-muted-foreground uppercase"
        aria-hidden="true"
      >
        {isUser ? 'You' : 'AI'}
      </span>
      <div
        className={cn(
          'max-w-[90%] rounded-lg px-3 py-2 text-sm',
          isUser
            ? 'rounded-tr-sm bg-muted text-foreground/80'
            : 'rounded-tl-sm border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-100',
        )}
      >
        {msg.text}
      </div>
    </div>
  )
})

// ---------------------------------------------------------------------------
// Panel
// ---------------------------------------------------------------------------

// LeftPanel.tsx — thêm isListening vào destructure props
export const LeftPanel: React.FC<LeftPanelProps> = ({
  aiState: controlledState,
  transcript = DEFAULT_TRANSCRIPT,
  isListening = false,   // ← thêm
}) => {
  const { aiState, setAIState } = useAIState({ enabled: controlledState === undefined })

  // Nếu đang lắng nghe mic user → override AI state thành 'listening'
  const activeState = controlledState ?? (isListening ? 'listening' : aiState)

  void setAIState

  const bottomRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [transcript])

  return (
    <div
      className="flex h-full flex-col gap-4 border-r border-border bg-background/50 p-4"
      aria-label="AI interviewer panel"
    >
      <Card className="flex h-1/3 items-center justify-center border-border bg-card/50 p-6">
        <AIAvatar state={activeState} />
      </Card>

      <Card className="flex flex-1 flex-col overflow-hidden border-border bg-card/30">
        <div className="flex items-center justify-between border-b border-border bg-card/80 p-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Live Transcript
          </h2>
          {/* Indicator đang ghi âm */}
          {isListening && (
            <span className="flex items-center gap-1.5 text-xs text-emerald-500">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
              Recording
            </span>
          )}
        </div>
        <ScrollArea className="flex-1 p-4">
          <div
            className="flex flex-col gap-4"
            role="log"
            aria-label="Interview transcript"
            aria-live="polite"
          >
            {transcript.map((msg) => (
              <MessageBubble key={msg.id} msg={msg} />
            ))}
            <div ref={bottomRef} aria-hidden="true" />
          </div>
        </ScrollArea>
      </Card>
    </div>
  )
}
