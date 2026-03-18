import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

dotenv.config()

const app  = express()
const PORT = process.env.PORT ?? 8080

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', process.env.FRONTEND_URL ?? ''].filter(Boolean),
  methods: ['GET', 'POST', 'PUT', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))
app.use(express.json())

const s3 = new S3Client({
  region: process.env.AWS_REGION ?? 'ap-southeast-1',
  // Credentials auto-loaded from env: AWS_ACCESS_KEY_ID + AWS_SECRET_ACCESS_KEY
})

const BUCKET = process.env.S3_BUCKET ?? 'smarthire-frontend-dev'

// ── Health check ────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ ok: true, bucket: BUCKET })
})

// ── Step 1: Generate presigned S3 upload URL ────────────────────────────────
app.post('/api/sessions/:sessionId/upload-url', async (req, res) => {
  try {
    const { sessionId } = req.params
    const { filename, mimeType, sizeBytes } = req.body

    if (!filename || !mimeType) {
      res.status(400).json({ error: 'filename and mimeType are required' })
      return
    }

    const s3Key = `recordings/${sessionId}/${filename}`

    const command = new PutObjectCommand({
      Bucket:        BUCKET,
      Key:           s3Key,
      ContentType:   mimeType,
      ContentLength: sizeBytes,
    })

    const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 300 }) // 5 min

    console.info(`[S3] Presigned URL generated for session ${sessionId} → ${s3Key}`)
    res.json({ uploadUrl, s3Key })
  } catch (err) {
    console.error('[S3] presign error:', err)
    res.status(500).json({ error: 'Failed to generate upload URL' })
  }
})

// ── Step 2: Receive transcript + notify upload complete ──────────────────────
app.post('/api/sessions/:sessionId/end', async (req, res) => {
  try {
    const { sessionId } = req.params
    const { s3Key, durationSeconds, transcript } = req.body

    console.info(`[Session] ${sessionId} ended`)
    console.info(`  Duration  : ${durationSeconds}s`)
    console.info(`  S3 Key    : ${s3Key}`)
    console.info(`  Transcript: ${transcript?.length ?? 0} messages`)

    // TODO: save to database, trigger AI analysis pipeline

    res.json({ ok: true, sessionId, s3Key })
  } catch (err) {
    console.error('[Session] end error:', err)
    res.status(500).json({ error: 'Failed to end session' })
  }
})

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`)
  console.log(`S3 Bucket: ${BUCKET} (${process.env.AWS_REGION ?? 'ap-southeast-1'})`)
})
