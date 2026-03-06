import React, { useState, useCallback } from 'react'
import { UploadCloud, CheckCircle2, FileText, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export const JobCreation: React.FC = () => {
  const [jobTitle, setJobTitle] = useState('')
  const [uploadState, setUploadState] = useState<'idle' | 'uploading' | 'analyzing' | 'complete'>(
    'idle',
  )
  const [progress, setProgress] = useState(0)

  // Simulated Drag and Drop / Upload Flow
  const handleFileUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement> | React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      setUploadState('uploading')
      setProgress(0)

      // Simulate S3 File Upload
      const uploadInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(uploadInterval)
            setUploadState('analyzing')

            // Simulate AI Bedrock Analysis
            setTimeout(() => {
              setUploadState('complete')
            }, 3000)
            return 100
          }
          return prev + 15
        })
      }, 300)
    },
    [],
  )

  return (
    <div className="animate-in fade-in zoom-in-95 mx-auto flex max-w-4xl flex-col gap-8 duration-500">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-50">Create New Job</h1>
          <p className="mt-1 text-zinc-400">
            Upload a Job Description and let AI build the interview framework.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Left Column: Form Details */}
        <div className="flex flex-col gap-6">
          <Card className="flex flex-col gap-5 border-zinc-800 bg-zinc-900/50 p-6">
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-300">Job Title</label>
              <input
                type="text"
                placeholder="e.g. Senior Frontend Engineer"
                className="w-full rounded-md border border-zinc-800 bg-zinc-950 p-3 text-zinc-100 transition-all placeholder:text-zinc-600 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-300">Seniority</label>
              <Select>
                <SelectTrigger className="w-full border-zinc-800 bg-zinc-950 text-zinc-300">
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent className="border-zinc-800 bg-zinc-900 text-zinc-100">
                  <SelectItem value="junior">Junior (0-2 years)</SelectItem>
                  <SelectItem value="mid">Mid-Level (3-5 years)</SelectItem>
                  <SelectItem value="senior">Senior (5+ years)</SelectItem>
                  <SelectItem value="lead">Lead / Staff</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="mt-4 flex justify-end border-t border-zinc-800/50 pt-4">
              <Button
                disabled={uploadState !== 'complete'}
                className="bg-emerald-500 font-bold text-zinc-950 hover:bg-emerald-600"
              >
                Create Interview Blueprint
              </Button>
            </div>
          </Card>
        </div>

        {/* Right Column: Drag and Drop JD */}
        <div className="flex flex-col gap-6">
          <div
            className={`relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-12 transition-all duration-300 ${
              uploadState === 'idle'
                ? 'cursor-pointer border-zinc-700 hover:border-emerald-500/50 hover:bg-emerald-500/5'
                : 'border-zinc-800 bg-zinc-900/30'
            }`}
            onDragOver={(e) => e.preventDefault()}
            onDrop={uploadState === 'idle' ? handleFileUpload : undefined}
          >
            {uploadState === 'idle' && (
              <>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  title="Upload Job Description"
                  placeholder="Upload Job Description"
                  className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                  onChange={handleFileUpload}
                />
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-zinc-800 text-zinc-400">
                  <UploadCloud className="h-8 w-8" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-zinc-200">Upload Job Description</h3>
                <p className="text-center text-sm text-zinc-500">
                  Drag and drop your PDF or DOCX file here, or click to browse.
                </p>
              </>
            )}

            {uploadState === 'uploading' && (
              <div className="flex w-full flex-col items-center">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-blue-500/10 text-blue-400">
                  <UploadCloud className="h-8 w-8 animate-bounce" />
                </div>
                <h3 className="mb-4 text-lg font-semibold text-zinc-200">Uploading to S3...</h3>
                <Progress value={progress} className="h-2 w-full bg-zinc-800" />
                <p className="mt-2 text-xs text-zinc-500">{progress}% complete</p>
              </div>
            )}

            {uploadState === 'analyzing' && (
              <div className="flex w-full flex-col items-center">
                <div className="relative mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-orange-500/10 text-orange-400">
                  <div className="absolute inset-0 animate-ping rounded-full border border-orange-500/30" />
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
                <h3 className="text-lg font-semibold text-zinc-200">AI is Analyzing JD...</h3>
                <p className="mt-2 max-w-[250px] text-center text-sm text-zinc-500">
                  Extracting technical skills, soft skills, and required experience levels via AWS
                  Bedrock.
                </p>
              </div>
            )}

            {uploadState === 'complete' && (
              <div className="flex w-full flex-col items-center">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-emerald-400">Analysis Complete</h3>
                <div className="mt-2 flex items-center gap-2 rounded-full bg-zinc-800 px-3 py-1.5 text-sm text-zinc-300">
                  <FileText className="h-4 w-4 text-zinc-400" /> req_frontend_senior.pdf
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
