import { useEffect, useRef, useState } from 'react'

const FFT_SIZE    = 512
const THROTTLE_MS = 50

export function useMicVolume(stream: MediaStream | null, isMuted: boolean): number {
  const [volume, setVolume] = useState(0)
  const rafRef              = useRef<number | null>(null)
  const lastTickRef         = useRef(0)
  const dataRef             = useRef<Uint8Array<ArrayBuffer> | null>(null)

  // Reset volume to 0 when no stream or muted — separate effect to avoid setState in effect body
  useEffect(() => {
    if (!stream || isMuted) setVolume(0)
  }, [stream, isMuted])

  useEffect(() => {
    if (!stream || isMuted) return

    const ctx      = new AudioContext()
    const source   = ctx.createMediaStreamSource(stream)
    const analyser = ctx.createAnalyser()
    analyser.fftSize               = FFT_SIZE
    analyser.smoothingTimeConstant = 0.6
    source.connect(analyser)

    dataRef.current = new Uint8Array(new ArrayBuffer(analyser.frequencyBinCount))

    const tick = (timestamp: number) => {
      if (timestamp - lastTickRef.current >= THROTTLE_MS) {
        lastTickRef.current = timestamp
        analyser.getByteFrequencyData(dataRef.current!)

        const data       = dataRef.current!
        const voiceStart = Math.floor(data.length * 0.02)
        const voiceEnd   = Math.floor(data.length * 0.35)
        let sum = 0
        for (let i = voiceStart; i < voiceEnd; i++) sum += data[i]
        const avg = sum / (voiceEnd - voiceStart)
        setVolume(Math.round((avg / 255) * 100))
      }
      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      source.disconnect()
      ctx.close()
      dataRef.current = null
    }
  }, [stream, isMuted])

  return volume
}
