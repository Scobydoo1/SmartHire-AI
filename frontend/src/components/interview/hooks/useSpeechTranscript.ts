import { useState, useCallback, useEffect, useRef } from 'react'
import type { TranscriptMessage } from '../types'



const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`

interface UseSpeechTranscriptReturn {
  transcript: TranscriptMessage[]
  isListening: boolean
  addAIMessage: (text: string) => void
  stopListening: () => void
  clearTranscript: () => void
}

export function useSpeechTranscript(
  stream: MediaStream | null,
): UseSpeechTranscriptReturn {
  const [transcript, setTranscript] = useState<TranscriptMessage[]>([{
    id: '1', sender: 'ai',
    text: "Hello! I'm your SmartHire AI interviewer. Let's start with a coding problem.",
  }])
  const [isListening, setIsListening] = useState(false)

  const recogRef   = useRef<SpeechRecognition | null>(null)
  const activeRef  = useRef(false)

  const addMessage = useCallback((sender: 'user' | 'ai', text: string) => {
    setTranscript((p) => [...p, { id: uid(), sender, text }])
  }, [])

  const addAIMessage   = useCallback((text: string) => addMessage('ai', text), [addMessage])
  const clearTranscript = useCallback(() => setTranscript([]), [])

  const stop = useCallback(() => {
    activeRef.current = false
    recogRef.current?.stop()
    recogRef.current = null
    setIsListening(false)
  }, [])

  // ── Khởi tạo + start SpeechRecognition ───────────────────────────────────
  const start = useCallback(() => {
    const SR = window.SpeechRecognition ?? window.webkitSpeechRecognition
    if (!SR || !stream || activeRef.current) return

    const r = new SR()
    r.continuous     = true
    r.interimResults = true
    r.lang           = 'vi-VN'   // đổi 'en-US' nếu cần

    r.onresult = ({ results, resultIndex }: SpeechRecognitionEvent) => {
      for (let i = resultIndex; i < results.length; i++) {
        const text = results[i][0].transcript.trim()
        if (results[i].isFinal && text) addMessage('user', text)
      }
    }

    // Auto-restart khi bị ngắt
    r.onend = () => {
      if (activeRef.current) try { r.start() } catch {}
      else setIsListening(false)
    }

    r.onerror = (event: Event) => {
      const error = (event as any).error
      if (error === 'no-speech') return   // bình thường, bỏ qua
      if (error === 'not-allowed') { stop(); return }
    }

    recogRef.current  = r
    activeRef.current = true
    setIsListening(true)
    try { r.start() } catch {}
  }, [stream, addMessage, stop])

  // Auto start/stop theo stream
  useEffect(() => {
    if (stream) start()
    return stop
  }, [stream, start, stop])

  return { transcript, isListening, addAIMessage, stopListening: stop, clearTranscript }
}
