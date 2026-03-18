import { memo, useState, useCallback, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  Search, Filter, Eye, Download, ChevronUp, ChevronDown,
  CheckCircle2, Clock, XCircle, AlertCircle, Users,
  FileText, Video, Star, MoreHorizontal,
} from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogDescription,
} from '@/components/ui/dialog'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuTrigger, DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import {
  Breadcrumb, BreadcrumbItem, BreadcrumbLink,
  BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { SidebarProvider, SidebarTrigger, SidebarInset } from '@/components/ui/sidebar'
import { RecruiterAppSidebar } from './RecruiterAppSidebar'
import { ThemeToggle } from '@/components/theme'

// ── Types ────────────────────────────────────────────────────────────────────────
type CandidateStatus = 'pending' | 'reviewed' | 'shortlisted' | 'rejected'

interface TranscriptEntry {
  sender: 'ai' | 'user'
  text: string
}

interface Candidate {
  id: string
  name: string
  email: string
  jobTitle: string
  jobId: string
  status: CandidateStatus
  aiScore: number
  resumeScore: number
  interviewDate: string
  duration: number
  skills: string[]
  transcript: TranscriptEntry[]
  recordingKey: string | null
  suggestions: string[]
}

// ── Mock Data ──────────────────────────────────────────────────────────────────
const MOCK_CANDIDATES: Candidate[] = [
  {
    id: 'c1', name: 'Nguyen Van An', email: 'an.nguyen@email.com',
    jobTitle: 'Senior Frontend Developer', jobId: 'j1',
    status: 'shortlisted', aiScore: 87, resumeScore: 82,
    interviewDate: '2026-03-15', duration: 1823,
    skills: ['React', 'TypeScript', 'Node.js', 'GraphQL'],
    suggestions: ['Strong problem-solving', 'Good communication', 'Expand system design knowledge'],
    recordingKey: 'recordings/c1/session.webm',
    transcript: [
      { sender: 'ai',   text: "Hello! I'm your SmartHire AI interviewer. Let's start with a coding problem." },
      { sender: 'user', text: 'Sure, I am ready.' },
      { sender: 'ai',   text: 'Can you explain the difference between useMemo and useCallback in React?' },
      { sender: 'user', text: 'useMemo memoizes a computed value while useCallback memoizes a function reference to prevent unnecessary re-renders.' },
      { sender: 'ai',   text: 'Great answer! Can you walk me through a real use case?' },
      { sender: 'user', text: 'In a large list component, I use useMemo to avoid recalculating filtered data on every render when only unrelated state changes.' },
    ],
  },
  {
    id: 'c2', name: 'Tran Thi Bich', email: 'bich.tran@email.com',
    jobTitle: 'Full Stack Engineer', jobId: 'j2',
    status: 'reviewed', aiScore: 74, resumeScore: 71,
    interviewDate: '2026-03-16', duration: 2104,
    skills: ['Vue.js', 'Python', 'PostgreSQL', 'Docker'],
    suggestions: ['Good backend skills', 'Improve frontend knowledge', 'Practice system design'],
    recordingKey: 'recordings/c2/session.webm',
    transcript: [
      { sender: 'ai',   text: "Hello! I'm your SmartHire AI interviewer." },
      { sender: 'user', text: 'Hello, nice to meet you.' },
      { sender: 'ai',   text: 'Tell me about a challenging project you worked on.' },
      { sender: 'user', text: 'I built a real-time dashboard with WebSockets in Python and Vue.js that handled 10k concurrent users.' },
    ],
  },
  {
    id: 'c3', name: 'Le Minh Duc', email: 'duc.le@email.com',
    jobTitle: 'Senior Frontend Developer', jobId: 'j1',
    status: 'pending', aiScore: 61, resumeScore: 58,
    interviewDate: '2026-03-17', duration: 1456,
    skills: ['React', 'JavaScript', 'CSS'],
    suggestions: ['Needs TypeScript practice', 'Improve algorithmic thinking'],
    recordingKey: null,
    transcript: [
      { sender: 'ai',   text: "Hello! Let's start with a coding problem." },
      { sender: 'user', text: 'Ok I am ready.' },
      { sender: 'ai',   text: 'What is the virtual DOM and how does React use it?' },
      { sender: 'user', text: 'Virtual DOM is a lightweight copy of the real DOM. React uses it to diff changes and batch updates efficiently.' },
    ],
  },
  {
    id: 'c4', name: 'Pham Thi Lan', email: 'lan.pham@email.com',
    jobTitle: 'Product Manager', jobId: 'j3',
    status: 'rejected', aiScore: 45, resumeScore: 52,
    interviewDate: '2026-03-14', duration: 987,
    skills: ['Agile', 'Jira', 'Roadmapping'],
    suggestions: ['Communication needs improvement', 'Lacks technical depth'],
    recordingKey: 'recordings/c4/session.webm',
    transcript: [
      { sender: 'ai',   text: "Hello! I'm your SmartHire AI interviewer." },
      { sender: 'user', text: 'Hi.' },
      { sender: 'ai',   text: 'How do you prioritize a product backlog?' },
      { sender: 'user', text: 'I use a simple priority list.' },
    ],
  },
  {
    id: 'c5', name: 'Hoang Van Khanh', email: 'khanh.hoang@email.com',
    jobTitle: 'Full Stack Engineer', jobId: 'j2',
    status: 'shortlisted', aiScore: 91, resumeScore: 88,
    interviewDate: '2026-03-13', duration: 2340,
    skills: ['React', 'TypeScript', 'Go', 'Kubernetes', 'AWS'],
    suggestions: ['Excellent technical depth', 'Strong system design', 'Hire immediately'],
    recordingKey: 'recordings/c5/session.webm',
    transcript: [
      { sender: 'ai',   text: "Hello! Let's dive into system design." },
      { sender: 'user', text: 'Ready!' },
      { sender: 'ai',   text: 'Design a URL shortener service that handles 100M requests per day.' },
      { sender: 'user', text: 'I would use a distributed hash table with consistent hashing, Redis for caching, and a CDN for global distribution.' },
      { sender: 'ai',   text: 'How would you handle hash collisions?' },
      { sender: 'user', text: 'By appending an incrementing counter to the hash and retrying lookups, or using base62 encoding with enough entropy.' },
    ],
  },
]

const JOBS = [
  { id: 'all', title: 'All Positions' },
  { id: 'j1',  title: 'Senior Frontend Developer' },
  { id: 'j2',  title: 'Full Stack Engineer' },
  { id: 'j3',  title: 'Product Manager' },
]

// ── Helpers ──────────────────────────────────────────────────────────────────────
const fmt = (s: number) =>
  `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

const scoreColor = (n: number) =>
  n >= 80 ? 'text-emerald-400' : n >= 60 ? 'text-yellow-400' : 'text-red-400'

const STATUS_META: Record<CandidateStatus, { label: string; icon: React.ReactNode; variant: 'default' | 'secondary' | 'outline' | 'destructive' }> = {
  pending:     { label: 'Pending',     icon: <Clock       className="h-3 w-3" />, variant: 'secondary'   },
  reviewed:    { label: 'Reviewed',    icon: <AlertCircle className="h-3 w-3" />, variant: 'outline'     },
  shortlisted: { label: 'Shortlisted', icon: <CheckCircle2 className="h-3 w-3" />, variant: 'default'   },
  rejected:    { label: 'Rejected',    icon: <XCircle     className="h-3 w-3" />, variant: 'destructive' },
}

// ── SortIcon — declared OUTSIDE component to avoid re-creation on render ───────
const SortIcon = ({
  field, sortField, sortDir,
}: {
  field: 'name' | 'aiScore' | 'interviewDate'
  sortField: 'name' | 'aiScore' | 'interviewDate'
  sortDir: 'asc' | 'desc'
}) => {
  if (sortField !== field) return null
  return sortDir === 'asc'
    ? <ChevronUp   className="h-3 w-3 inline ml-1" />
    : <ChevronDown className="h-3 w-3 inline ml-1" />
}

// ── StatCard ────────────────────────────────────────────────────────────────────
const StatCard = memo(({ label, value, sub, icon: Icon, color }: {
  label: string; value: string | number; sub: string
  icon: React.ElementType; color: string
}) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium">{label}</CardTitle>
      <Icon className={`h-4 w-4 ${color}`} />
    </CardHeader>
    <CardContent>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
      <p className="text-xs text-muted-foreground">{sub}</p>
    </CardContent>
  </Card>
))
StatCard.displayName = 'StatCard'

// ── CandidateDetailDialog ────────────────────────────────────────────────────
const CandidateDetailDialog = memo(({ candidate, open, onClose, onStatusChange }: {
  candidate: Candidate | null
  open: boolean
  onClose: () => void
  onStatusChange: (id: string, status: CandidateStatus) => void
}) => {
  if (!candidate) return null
  const { label, icon, variant } = STATUS_META[candidate.status]

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose() }}>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-emerald-500/20 text-emerald-400 font-bold">
                {candidate.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-lg font-bold">{candidate.name}</p>
              <p className="text-sm text-muted-foreground">{candidate.email}</p>
            </div>
          </DialogTitle>
          <DialogDescription>
            {candidate.jobTitle} · {candidate.interviewDate} · {fmt(candidate.duration)}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 sm:grid-cols-3 mt-2">
          <Card className="bg-card/50">
            <CardContent className="pt-4 text-center">
              <p className={`text-3xl font-bold ${scoreColor(candidate.aiScore)}`}>{candidate.aiScore}%</p>
              <p className="text-xs text-muted-foreground mt-1">AI Interview Score</p>
            </CardContent>
          </Card>
          <Card className="bg-card/50">
            <CardContent className="pt-4 text-center">
              <p className={`text-3xl font-bold ${scoreColor(candidate.resumeScore)}`}>{candidate.resumeScore}%</p>
              <p className="text-xs text-muted-foreground mt-1">Resume Score</p>
            </CardContent>
          </Card>
          <Card className="bg-card/50">
            <CardContent className="pt-4 text-center">
              <p className="text-3xl font-bold text-blue-400">{fmt(candidate.duration)}</p>
              <p className="text-xs text-muted-foreground mt-1">Interview Duration</p>
            </CardContent>
          </Card>
        </div>

        <div>
          <p className="text-sm font-semibold mb-2">Detected Skills</p>
          <div className="flex flex-wrap gap-2">
            {candidate.skills.map((s) => (
              <Badge key={s} variant="outline" className="text-xs">{s}</Badge>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold mb-2">AI Feedback</p>
          <ul className="flex flex-col gap-2">
            {candidate.suggestions.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <Star className="h-3.5 w-3.5 mt-0.5 shrink-0 text-yellow-400" />
                {s}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold mb-2">Interview Transcript</p>
          <div className="flex flex-col gap-2 max-h-56 overflow-y-auto rounded-lg border border-border bg-muted/20 p-3">
            {candidate.transcript.map((t, i) => (
              <div key={i} className={`flex gap-2 text-sm ${t.sender === 'ai' ? 'text-blue-400' : 'text-foreground'}`}>
                <span className="shrink-0 font-semibold w-8">{t.sender === 'ai' ? 'AI' : 'You'}</span>
                <span>{t.text}</span>
              </div>
            ))}
          </div>
        </div>

        {candidate.recordingKey && (
          <div>
            <p className="text-sm font-semibold mb-2">Recording</p>
            <div className="flex items-center gap-3 rounded-lg border border-border bg-card/50 p-3">
              <Video className="h-5 w-5 text-emerald-400" />
              <p className="text-sm text-muted-foreground flex-1 truncate">{candidate.recordingKey}</p>
              <Button size="sm" variant="outline" onClick={() => toast.info('Video playback requires backend S3 URL')}>
                <Eye className="mr-2 h-3.5 w-3.5" /> Watch
              </Button>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between border-t border-border pt-4">
          <Badge variant={variant} className="gap-1">{icon}{label}</Badge>
          <div className="flex gap-2">
            {(['pending', 'reviewed', 'shortlisted', 'rejected'] as CandidateStatus[])
              .filter((s) => s !== candidate.status)
              .map((s) => (
                <Button
                  key={s}
                  size="sm"
                  variant={s === 'shortlisted' ? 'default' : s === 'rejected' ? 'destructive' : 'outline'}
                  onClick={() => { onStatusChange(candidate.id, s); onClose() }}
                >
                  {STATUS_META[s].label}
                </Button>
              ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
})
CandidateDetailDialog.displayName = 'CandidateDetailDialog'

// ── Main Page ───────────────────────────────────────────────────────────────────────
export const AdminCandidatesPage = memo(() => {
  const [candidates, setCandidates] = useState<Candidate[]>(MOCK_CANDIDATES)
  const [search, setSearch]         = useState('')
  const [jobFilter, setJobFilter]   = useState('all')
  const [statusFilter, setStatus]   = useState<CandidateStatus | 'all'>('all')
  const [sortField, setSortField]   = useState<'name' | 'aiScore' | 'interviewDate'>('interviewDate')
  const [sortDir, setSortDir]       = useState<'asc' | 'desc'>('desc')
  const [selected, setSelected]     = useState<Candidate | null>(null)

  const handleStatusChange = useCallback((id: string, status: CandidateStatus) => {
    setCandidates((prev) => prev.map((c) => c.id === id ? { ...c, status } : c))
    toast.success(`Candidate marked as ${STATUS_META[status].label}`)
  }, [])

  const toggleSort = useCallback((field: 'name' | 'aiScore' | 'interviewDate') => {
    if (sortField === field) {
      setSortDir((d) => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDir('desc')
    }
  }, [sortField])

  const filtered = useMemo(() => {
    return candidates
      .filter((c) => {
        const q = search.toLowerCase()
        return (
          (c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q)) &&
          (jobFilter === 'all' || c.jobId === jobFilter) &&
          (statusFilter === 'all' || c.status === statusFilter)
        )
      })
      .sort((a, b) => {
        let cmp = 0
        if (sortField === 'name')          cmp = a.name.localeCompare(b.name)
        if (sortField === 'aiScore')       cmp = a.aiScore - b.aiScore
        if (sortField === 'interviewDate') cmp = a.interviewDate.localeCompare(b.interviewDate)
        return sortDir === 'asc' ? cmp : -cmp
      })
  }, [candidates, search, jobFilter, statusFilter, sortField, sortDir])

  const stats = useMemo(() => ({
    total:       candidates.length,
    shortlisted: candidates.filter((c) => c.status === 'shortlisted').length,
    pending:     candidates.filter((c) => c.status === 'pending').length,
    avgScore:    Math.round(candidates.reduce((a, c) => a + c.aiScore, 0) / candidates.length),
  }), [candidates])

  return (
    <SidebarProvider>
      <RecruiterAppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem><BreadcrumbLink asChild><Link to="/">Home</Link></BreadcrumbLink></BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem><BreadcrumbPage>Candidates</BreadcrumbPage></BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="ml-auto"><ThemeToggle variant="dropdown" /></div>
        </header>

        <main className="flex flex-1 flex-col gap-6 p-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Candidates</h1>
            <p className="text-muted-foreground">Review AI interview results and manage candidate pipeline.</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Total Candidates" value={stats.total}          sub="All positions"        icon={Users}         color="text-blue-400" />
            <StatCard label="Shortlisted"      value={stats.shortlisted}    sub="Ready for next step"  icon={CheckCircle2}  color="text-emerald-400" />
            <StatCard label="Pending Review"   value={stats.pending}        sub="Needs attention"      icon={Clock}         color="text-yellow-400" />
            <StatCard label="Avg AI Score"     value={`${stats.avgScore}%`} sub="Across all interviews" icon={Star}         color="text-purple-400" />
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-48">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={jobFilter} onValueChange={setJobFilter}>
              <SelectTrigger className="w-52">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by job" />
              </SelectTrigger>
              <SelectContent>
                {JOBS.map((j) => <SelectItem key={j.id} value={j.id}>{j.title}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={(v) => setStatus(v as CandidateStatus | 'all')}>
              <SelectTrigger className="w-44">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {(Object.keys(STATUS_META) as CandidateStatus[]).map((s) => (
                  <SelectItem key={s} value={s}>{STATUS_META[s].label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={() => toast.info('Export coming after backend integration')}>
              <Download className="mr-2 h-4 w-4" /> Export CSV
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Candidate List</CardTitle>
              <CardDescription>{filtered.length} candidates found</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="cursor-pointer" onClick={() => toggleSort('name')}>
                      Candidate <SortIcon field="name" sortField={sortField} sortDir={sortDir} />
                    </TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="cursor-pointer text-right" onClick={() => toggleSort('aiScore')}>
                      AI Score <SortIcon field="aiScore" sortField={sortField} sortDir={sortDir} />
                    </TableHead>
                    <TableHead className="text-right">Resume</TableHead>
                    <TableHead className="cursor-pointer text-right" onClick={() => toggleSort('interviewDate')}>
                      Date <SortIcon field="interviewDate" sortField={sortField} sortDir={sortDir} />
                    </TableHead>
                    <TableHead className="text-right">Duration</TableHead>
                    <TableHead />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center text-muted-foreground py-12">
                        No candidates match your filters.
                      </TableCell>
                    </TableRow>
                  ) : filtered.map((c) => {
                    const { label, icon, variant } = STATUS_META[c.status]
                    return (
                      <TableRow key={c.id} className="cursor-pointer hover:bg-muted/40" onClick={() => setSelected(c)}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="text-xs bg-emerald-500/20 text-emerald-400">
                                {c.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-sm">{c.name}</p>
                              <p className="text-xs text-muted-foreground">{c.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">{c.jobTitle}</TableCell>
                        <TableCell>
                          <Badge variant={variant} className="gap-1 text-xs">{icon}{label}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <span className={`font-bold text-sm ${scoreColor(c.aiScore)}`}>{c.aiScore}%</span>
                        </TableCell>
                        <TableCell className="text-right">
                          <span className={`text-sm ${scoreColor(c.resumeScore)}`}>{c.resumeScore}%</span>
                        </TableCell>
                        <TableCell className="text-right text-sm text-muted-foreground">{c.interviewDate}</TableCell>
                        <TableCell className="text-right text-sm font-mono text-muted-foreground">{fmt(c.duration)}</TableCell>
                        <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => setSelected(c)}>
                                <Eye className="mr-2 h-4 w-4" /> View Details
                              </DropdownMenuItem>
                              {c.recordingKey && (
                                <DropdownMenuItem onClick={() => toast.info('Requires backend S3 URL')}>
                                  <Video className="mr-2 h-4 w-4" /> Watch Recording
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem onClick={() => toast.info('Transcript exported')}>
                                <FileText className="mr-2 h-4 w-4" /> Export Transcript
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => handleStatusChange(c.id, 'shortlisted')}
                                disabled={c.status === 'shortlisted'}
                                className="text-emerald-400"
                              >
                                <CheckCircle2 className="mr-2 h-4 w-4" /> Shortlist
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleStatusChange(c.id, 'rejected')}
                                disabled={c.status === 'rejected'}
                                className="text-red-400"
                              >
                                <XCircle className="mr-2 h-4 w-4" /> Reject
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </main>
      </SidebarInset>

      <CandidateDetailDialog
        candidate={selected}
        open={!!selected}
        onClose={() => setSelected(null)}
        onStatusChange={handleStatusChange}
      />
    </SidebarProvider>
  )
})
AdminCandidatesPage.displayName = 'AdminCandidatesPage'
