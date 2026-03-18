/**
 * ResumePage — /resume
 * Candidate can view, upload, and manage their resume.
 * Upload is UI-only (mock) — ready for backend/S3 hookup.
 */

import { memo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { FileText, Upload, Trash2, Eye, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { SidebarProvider, SidebarTrigger, SidebarInset } from '@/components/ui/sidebar'
import { CandidateAppSidebar } from './CandidateAppSidebar'
import { ThemeToggle } from '@/components/theme'

// --- Mock existing resume ---
const mockResume = {
  name: 'Sarah_Jenkins_Resume_2026.pdf',
  uploadedAt: '2026-02-20',
  size: '245 KB',
  analysisScore: 82,
  skills: ['React', 'TypeScript', 'Node.js', 'CSS', 'Git', 'REST APIs'],
  suggestions: [
    'Add measurable impact to your project descriptions (e.g., improved performance by X%)',
    'Include a summary section at the top',
    'List certifications if available',
  ],
}

export const ResumePage = memo(() => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [uploaded, setUploaded] = useState(false)
  const [fileName, setFileName] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.type !== 'application/pdf') {
      toast.error('Only PDF files are supported.')
      return
    }
    setFileName(file.name)
    setUploading(true)
    // Simulate upload delay
    setTimeout(() => {
      setUploading(false)
      setUploaded(true)
      toast.success(`${file.name} uploaded successfully!`)
    }, 1500)
  }

  const handleDelete = () => {
    setUploaded(false)
    setFileName(null)
    toast.info('Resume removed.')
  }

  return (
    <SidebarProvider>
      <CandidateAppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild><Link to="/">Home</Link></BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Resume</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="ml-auto">
            <ThemeToggle variant="dropdown" />
          </div>
        </header>

        <main className="flex flex-1 flex-col gap-6 p-4 pt-0">
          <div className="flex flex-col gap-2 py-4">
            <h1 className="text-3xl font-bold tracking-tight">My Resume</h1>
            <p className="text-muted-foreground">Upload and manage your resume. Our AI will analyze it for you.</p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Upload Section */}
            <div className="flex flex-col gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="h-5 w-5 text-emerald-500" />
                    Upload Resume
                  </CardTitle>
                  <CardDescription>PDF only. Max 5MB. Replaces your current resume.</CardDescription>
                </CardHeader>
                <CardContent>
                  <input
                    ref={inputRef}
                    type="file"
                    accept=".pdf"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <div
                    onClick={() => inputRef.current?.click()}
                    className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 p-10 transition-colors hover:border-emerald-500/60 hover:bg-emerald-500/5"
                  >
                    {uploading ? (
                      <>
                        <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
                        <p className="mt-3 text-sm text-muted-foreground">Uploading {fileName}...</p>
                      </>
                    ) : uploaded ? (
                      <>
                        <CheckCircle2 className="h-10 w-10 text-emerald-500" />
                        <p className="mt-3 text-sm font-medium text-emerald-400">{fileName}</p>
                        <p className="text-xs text-muted-foreground">Click to replace</p>
                      </>
                    ) : (
                      <>
                        <Upload className="h-10 w-10 text-muted-foreground/50" />
                        <p className="mt-3 text-sm font-medium">Click to upload PDF</p>
                        <p className="text-xs text-muted-foreground">or drag and drop</p>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Current Resume */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-emerald-500" />
                    Current Resume
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between rounded-lg border p-3">
                    <div className="flex items-center gap-3">
                      <FileText className="h-8 w-8 text-red-400" />
                      <div>
                        <p className="text-sm font-medium">{mockResume.name}</p>
                        <p className="text-xs text-muted-foreground">{mockResume.size} · Uploaded {mockResume.uploadedAt}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="icon" variant="ghost" onClick={() => toast.info('Preview coming soon!')}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" className="text-red-400 hover:text-red-300" onClick={handleDelete}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* AI Analysis */}
            <div className="flex flex-col gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>AI Resume Analysis</CardTitle>
                  <CardDescription>Score based on job-market compatibility.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <span className="text-4xl font-bold text-emerald-400">{mockResume.analysisScore}%</span>
                    <Badge variant="secondary">Good Match</Badge>
                  </div>
                  <Progress value={mockResume.analysisScore} className="h-2" />

                  <div>
                    <p className="mb-2 text-sm font-semibold">Detected Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {mockResume.skills.map(skill => (
                        <Badge key={skill} variant="outline" className="text-xs">{skill}</Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="mb-2 text-sm font-semibold">Suggestions</p>
                    <ul className="flex flex-col gap-2">
                      {mockResume.suggestions.map((s, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <span className="mt-0.5 h-4 w-4 shrink-0 rounded-full bg-yellow-500/20 text-yellow-400 flex items-center justify-center text-xs">!</span>
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
})

ResumePage.displayName = 'ResumePage'
