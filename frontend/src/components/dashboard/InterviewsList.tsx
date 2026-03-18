/**
 * InterviewsList Page — /interviews
 * Full history of all interviews (scheduled, completed, pending).
 * All data is mocked — ready for backend hookup.
 */

import { memo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Video, CheckCircle2, Clock, Search, Filter } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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
interface Interview {
  id: string
  jobTitle: string
  company: string
  status: 'scheduled' | 'completed' | 'pending'
  scheduledDate?: string
  completedDate?: string
  score?: number
  stage: string
  duration?: string
}

const allInterviews: Interview[] = [
  {
    id: '1',
    jobTitle: 'Senior Frontend Developer',
    company: 'TechCorp Inc.',
    status: 'scheduled',
    scheduledDate: '2026-03-20 at 09:00 AM',
    stage: 'Technical Interview',
    duration: '60 min',
  },
  {
    id: '2',
    jobTitle: 'Full Stack Engineer',
    company: 'StartupXYZ',
    status: 'completed',
    completedDate: '2026-03-01',
    score: 85,
    stage: 'Final Round',
    duration: '45 min',
  },
  {
    id: '3',
    jobTitle: 'React Developer',
    company: 'Digital Solutions',
    status: 'pending',
    stage: 'Initial Screening',
    duration: '30 min',
  },
  {
    id: '4',
    jobTitle: 'UI/UX Developer',
    company: 'Creative Agency',
    status: 'completed',
    completedDate: '2026-02-28',
    score: 92,
    stage: 'Behavioral Interview',
    duration: '40 min',
  },
  {
    id: '5',
    jobTitle: 'TypeScript Engineer',
    company: 'CloudBase',
    status: 'pending',
    stage: 'Initial Screening',
    duration: '30 min',
  },
  {
    id: '6',
    jobTitle: 'React Native Developer',
    company: 'MobileFirst Co.',
    status: 'completed',
    completedDate: '2026-02-10',
    score: 71,
    stage: 'Technical Screen',
    duration: '50 min',
  },
]

const statusConfig = {
  scheduled: { label: 'Scheduled', icon: Video, variant: 'secondary' as const },
  completed: { label: 'Completed', icon: CheckCircle2, variant: 'default' as const },
  pending: { label: 'Pending', icon: Clock, variant: 'outline' as const },
}

export const InterviewsList = memo(() => {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'scheduled' | 'completed' | 'pending'>('all')

  const filtered = allInterviews.filter(iv => {
    const matchSearch =
      iv.jobTitle.toLowerCase().includes(search.toLowerCase()) ||
      iv.company.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'all' || iv.status === filter
    return matchSearch && matchFilter
  })

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
                <BreadcrumbPage>Interviews</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="ml-auto">
            <ThemeToggle variant="dropdown" />
          </div>
        </header>

        <main className="flex flex-1 flex-col gap-6 p-4 pt-0">
          <div className="flex flex-col gap-2 py-4">
            <h1 className="text-3xl font-bold tracking-tight">All Interviews</h1>
            <p className="text-muted-foreground">Your complete interview history across all companies.</p>
          </div>

          {/* Filters */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by job or company..."
                className="pl-9"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground shrink-0" />
              <Select value={filter} onValueChange={v => setFilter(v as typeof filter)}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Interview Cards */}
          {filtered.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-3">
                <Search className="h-10 w-10 opacity-30" />
                <p>No interviews match your search.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="flex flex-col gap-3">
              {filtered.map(iv => {
                const cfg = statusConfig[iv.status]
                const Icon = cfg.icon
                return (
                  <Card key={iv.id} className="transition-colors hover:border-emerald-500/50">
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <CardTitle className="text-base">{iv.jobTitle}</CardTitle>
                          <CardDescription>{iv.company} · {iv.stage}</CardDescription>
                        </div>
                        <Badge variant={cfg.variant} className="flex items-center gap-1 shrink-0">
                          <Icon className="h-3 w-3" />
                          {cfg.label}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-3">
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        {iv.scheduledDate && <span>📅 {iv.scheduledDate}</span>}
                        {iv.completedDate && <span>✅ Completed {iv.completedDate}</span>}
                        {iv.duration && <span>⏱ {iv.duration}</span>}
                      </div>
                      {iv.score !== undefined && (
                        <div className="flex items-center gap-3">
                          <Progress value={iv.score} className="h-2 flex-1" />
                          <span className="text-sm font-semibold text-emerald-400 w-10 text-right">
                            {iv.score}%
                          </span>
                        </div>
                      )}
                      <div className="flex gap-2 pt-1">
                        {iv.status === 'scheduled' && (
                          <Button asChild size="sm" className="bg-emerald-500 hover:bg-emerald-600 text-black font-semibold">
                            <Link to="/interview"><Video className="mr-2 h-3.5 w-3.5" />Join Interview</Link>
                          </Button>
                        )}
                        {iv.status === 'completed' && (
                          <Button asChild size="sm" variant="outline">
                            <Link to={`/report/${iv.id}`}>View Report</Link>
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
})

InterviewsList.displayName = 'InterviewsList'
