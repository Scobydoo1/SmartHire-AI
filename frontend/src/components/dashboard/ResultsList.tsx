/**
 * ResultsList Page — /results
 * Shows all completed interviews with scores and links to full report.
 * All data is mocked — ready for backend hookup.
 */

import { memo } from 'react'
import { Link } from 'react-router-dom'
import { FileText, TrendingUp, CheckCircle2, Award } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
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

// --- Mock Data ---
interface InterviewResult {
  id: string
  jobTitle: string
  company: string
  completedDate: string
  overallScore: number
  technicalScore: number
  communicationScore: number
  problemSolvingScore: number
  stage: string
  outcome: 'passed' | 'failed' | 'pending'
}

const mockResults: InterviewResult[] = [
  {
    id: '1',
    jobTitle: 'Full Stack Engineer',
    company: 'StartupXYZ',
    completedDate: '2026-03-01',
    overallScore: 85,
    technicalScore: 88,
    communicationScore: 90,
    problemSolvingScore: 76,
    stage: 'Final Round',
    outcome: 'passed',
  },
  {
    id: '2',
    jobTitle: 'UI/UX Developer',
    company: 'Creative Agency',
    completedDate: '2026-02-28',
    overallScore: 92,
    technicalScore: 95,
    communicationScore: 92,
    problemSolvingScore: 88,
    stage: 'Behavioral Interview',
    outcome: 'passed',
  },
  {
    id: '3',
    jobTitle: 'React Developer',
    company: 'Digital Solutions',
    completedDate: '2026-02-15',
    overallScore: 54,
    technicalScore: 50,
    communicationScore: 65,
    problemSolvingScore: 48,
    stage: 'Technical Screen',
    outcome: 'failed',
  },
]

const outcomeConfig = {
  passed: { label: 'Passed', class: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
  failed: { label: 'Failed', class: 'bg-red-500/10 text-red-400 border-red-500/30' },
  pending: { label: 'Pending Review', class: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30' },
}

const scoreColor = (score: number) => {
  if (score >= 80) return 'text-emerald-400'
  if (score >= 60) return 'text-yellow-400'
  return 'text-red-400'
}

const ScoreBar = ({ label, value }: { label: string; value: number }) => (
  <div className="flex flex-col gap-1">
    <div className="flex justify-between text-xs">
      <span className="text-muted-foreground">{label}</span>
      <span className={`font-semibold ${scoreColor(value)}`}>{value}%</span>
    </div>
    <Progress value={value} className="h-1.5" />
  </div>
)

export const ResultsList = memo(() => {
  const avgScore = Math.round(mockResults.reduce((a, r) => a + r.overallScore, 0) / mockResults.length)
  const passed = mockResults.filter(r => r.outcome === 'passed').length

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
                <BreadcrumbPage>Results</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="ml-auto">
            <ThemeToggle variant="dropdown" />
          </div>
        </header>

        <main className="flex flex-1 flex-col gap-6 p-4 pt-0">
          <div className="flex flex-col gap-2 py-4">
            <h1 className="text-3xl font-bold tracking-tight">Interview Results</h1>
            <p className="text-muted-foreground">Review your completed interview scores and AI feedback.</p>
          </div>

          {/* Summary Row */}
          <div className="grid gap-4 sm:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Total Completed</CardTitle>
                <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockResults.length}</div>
                <p className="text-xs text-muted-foreground">All time</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Passed</CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-emerald-400">{passed}</div>
                <p className="text-xs text-muted-foreground">Out of {mockResults.length}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${scoreColor(avgScore)}`}>{avgScore}%</div>
                <p className="text-xs text-muted-foreground">Across all interviews</p>
              </CardContent>
            </Card>
          </div>

          {/* Results Cards */}
          <div className="flex flex-col gap-4">
            {mockResults.map(result => (
              <Card key={result.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <CardTitle className="text-lg">{result.jobTitle}</CardTitle>
                      <CardDescription>{result.company} · {result.stage} · {result.completedDate}</CardDescription>
                    </div>
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <span className={`rounded border px-2.5 py-0.5 text-xs font-bold ${outcomeConfig[result.outcome].class}`}>
                        {outcomeConfig[result.outcome].label}
                      </span>
                      <span className={`text-3xl font-bold ${scoreColor(result.overallScore)}`}>
                        {result.overallScore}%
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                  <ScoreBar label="Technical" value={result.technicalScore} />
                  <ScoreBar label="Communication" value={result.communicationScore} />
                  <ScoreBar label="Problem Solving" value={result.problemSolvingScore} />
                  <div className="pt-2">
                    <Button asChild variant="outline" size="sm" className="gap-2">
                      <Link to={`/report/${result.id}`}>
                        <FileText className="h-4 w-4" />
                        View Full Report
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
})

ResultsList.displayName = 'ResultsList'
