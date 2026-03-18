import { useState, useCallback, useRef } from 'react'
import { fetchAuthSession } from 'aws-amplify/auth'
import type { UploadStatus } from '../types'

interface UseSessionRecorderReturn {
  uploadStatus: UploadStatus
  duration: number
  startRecording: (stream: MediaStream) => void
  stopAndUpload: (sessionId: string, transcript: { sender: string; text: string }[]) => Promise<void>
}

const MIME = ['video/webm;codecs=vp9,opus', 'video/webm;codecs=vp8,opus', 'video/webm', 'video/mp4']
  .find((t) => MediaRecorder.isTypeSupported(t)) ?? 'video/webm'

const EXT = MIME.includes('mp4') ? 'mp4' : 'webm'

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a   = document.createElement('a')
  a.href     = url
  a.download = filename
  a.click()
  setTimeout(() => URL.revokeObjectURL(url), 10_000)
}

async function getAuthToken(): Promise<string> {
  try {
    const session = await fetchAuthSession()
    return session.tokens?.idToken?.toString() ?? ''
  } catch {
    return ''
  }
}

export function useSessionRecorder(): UseSessionRecorderReturn {
  const [uploadStatus, setStatus] = useState<UploadStatus>('idle')
  const [duration, setDuration]   = useState(0)

  const recorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef   = useRef<Blob[]>([])
  const timerRef    = useRef<ReturnType<typeof setInterval> | null>(null)
  const startRef    = useRef(0)

  const startRecording = useCallback((stream: MediaStream) => {
    if (recorderRef.current) return

    const rec = new MediaRecorder(stream, {
      mimeType:           MIME,
      videoBitsPerSecond: 800_000,
      audioBitsPerSecond: 96_000,
    })

    chunksRef.current   = []
    rec.ondataavailable = ({ data }) => { if (data.size > 0) chunksRef.current.push(data) }
    rec.start(1000)

    recorderRef.current = rec
    startRef.current    = Date.now()
    setStatus('recording')
    setDuration(0)

    timerRef.current = setInterval(
      () => setDuration(Math.floor((Date.now() - startRef.current) / 1000)),
      1000,
    )
  }, [])

  const stopAndUpload = useCallback(async (
    sessionId: string,
    transcript: { sender: string; text: string }[],
  ) => {
    const rec = recorderRef.current
    if (!rec) return

    if (timerRef.current) clearInterval(timerRef.current)

    await new Promise<void>((res) => { rec.onstop = () => res(); rec.stop() })
    recorderRef.current = null
    setStatus('uploading')

    try {
      const blob          = new Blob(chunksRef.current, { type: MIME })
      chunksRef.current   = []
      const finalDuration = Math.floor((Date.now() - startRef.current) / 1000)
      const apiBase       = import.meta.env.VITE_API_GATEWAY_URL

      if (apiBase) {
        const token = await getAuthToken()
        const authHeaders: Record<string, string> = {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        }

        // Step 1: get presigned S3 URL
        const { uploadUrl, s3Key } = await fetch(
          `${apiBase}/sessions/${sessionId}/upload-url`,
          {
            method:  'POST',
            headers: authHeaders,
            body:    JSON.stringify({ filename: `${sessionId}.${EXT}`, mimeType: MIME, sizeBytes: blob.size }),
          },
        ).then((r) => { if (!r.ok) throw new Error(`presign failed: ${r.status}`); return r.json() })

        // Step 2: upload video directly to S3
        const s3Res = await fetch(uploadUrl, { method: 'PUT', headers: { 'Content-Type': MIME }, body: blob })
        if (!s3Res.ok) throw new Error(`S3 upload failed: ${s3Res.status}`)

        // Step 3: notify backend with transcript
        await fetch(`${apiBase}/sessions/${sessionId}/end`, {
          method:  'POST',
          headers: authHeaders,
          body:    JSON.stringify({ s3Key, durationSeconds: finalDuration, transcript }),
        }).then((r) => { if (!r.ok) throw new Error(`session end failed: ${r.status}`) })

        console.info('[SessionRecorder] Upload complete:', s3Key)
      } else {
        // Dev fallback: download locally
        console.info('[SessionRecorder] No VITE_API_GATEWAY_URL — saving locally.')
        await new Promise((res) => setTimeout(res, 800))
        downloadBlob(blob, `smarthire-session-${sessionId}.${EXT}`)
      }

      setStatus('done')
    } catch (e) {
      console.error('[SessionRecorder] upload error:', e)
      setStatus('error')
    }
  }, [])

  return { uploadStatus, duration, startRecording, stopAndUpload }
}
