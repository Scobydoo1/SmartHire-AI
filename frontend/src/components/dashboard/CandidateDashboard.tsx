/**
 * Comprehensive Candidate Dashboard with shadcn/ui v4
 * Optimized with Sidebar Component
 * Features:
 * - shadcn/ui Sidebar with collapsible navigation
 * - Breadcrumb navigation
 * - Minimalist widgets with real-time data
 * - Responsive design with mobile support
 * - Accessibility compliant
 * - Loading states and error handling
 */

import { memo, useState, useCallback, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Bell,
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  RefreshCw,
  TrendingUp,
  Video,
} from 'lucide-react'
import { toast } from 'sonner'
import { useAuthStore } from '@/store/authStore'

// UI Components
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
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

// Types
interface InterviewStatus {
  id: string
  jobTitle: string
  company: string
  status: 'scheduled' | 'completed' | 'pending'
  scheduledDate?: string
  completedDate?: string
  score?: number
  stage: string
}

interface DashboardStats {
  totalInterviews: number
  completedInterviews: number
  upcomingInterviews: number
  averageScore: number
}

// Mock Data Generator
const generateMockData = (): {
  stats: DashboardStats
  interviews: InterviewStatus[]
  notifications: Array<{
    id: string
    message: string
    time: string
    unread: boolean
  }>
} => {
  const interviews: InterviewStatus[] = [
    {
      id: '1',
      jobTitle: 'Senior Frontend Developer',
      company: 'TechCorp Inc.',
      status: 'scheduled',
      scheduledDate: '2026-03-06T14:00:00',
      stage: 'Technical Interview',
    },
    {
      id: '2',
      jobTitle: 'Full Stack Engineer',
      company: 'StartupXYZ',
      status: 'completed',
      completedDate: '2026-03-01T10:00:00',
      score: 85,
      stage: 'Final Round',
    },
    {
      id: '3',
      jobTitle: 'React Developer',
      company: 'Digital Solutions',
      status: 'pending',
      stage: 'Initial Screening',
    },
    {
      id: '4',
      jobTitle: 'UI/UX Developer',
      company: 'Creative Agency',
      status: 'completed',
      completedDate: '2026-02-28T15:30:00',
      score: 92,
      stage: 'Behavioral Interview',
    },
  ]

  const stats: DashboardStats = {
    totalInterviews: interviews.length,
    completedInterviews: interviews.filter((i) => i.status === 'completed').length,
    upcomingInterviews: interviews.filter((i) => i.status === 'scheduled').length,
    averageScore:
      interviews.filter((i) => i.score).reduce((acc, i) => acc + (i.score || 0), 0) /
      (interviews.filter((i) => i.score).length || 1),
  }

  const notifications = [
    {
      id: '1',
      message: 'Interview scheduled for Senior Frontend Developer',
      time: '2h ago',
      unread: true,
    },
    {
      id: '2',
      message: 'Your interview results are ready',
      time: '1d ago',
      unread: true,
    },
    {
      id: '3',
      message: 'New job opportunity matches your profile',
      time: '2d ago',
      unread: false,
    },
  ]

  return { stats, interviews, notifications }
}

// Memoized Components
// Stats Card Component
const StatsCard = memo(
  ({
    title,
    value,
    description,
    icon: Icon,
    trend,
    isLoading = false,
  }: {
    title: string
    value: string | number
    description: string
    icon: React.ElementType
    trend?: { value: number; isPositive: boolean }
    isLoading?: boolean
  }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="text-muted-foreground h-4 w-4" aria-hidden="true" />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <>
            <Skeleton className="mb-2 h-8 w-24" />
            <Skeleton className="h-4 w-32" />
          </>
        ) : (
          <>
            <div className="text-2xl font-bold">{value}</div>
            <p className="text-muted-foreground flex items-center gap-2 text-xs">
              {trend && (
                <span className={trend.isPositive ? 'text-emerald-500' : 'text-red-500'}>
                  <TrendingUp className="inline h-3 w-3" />
                  {trend.value}%
                </span>
              )}
              {description}
            </p>
          </>
        )}
      </CardContent>
    </Card>
  ),
)
StatsCard.displayName = 'StatsCard'

// Interview Table Component
const InterviewsTable = memo(
  ({ interviews, isLoading = false }: { interviews: InterviewStatus[]; isLoading?: boolean }) => (
    <Card>
      <CardHeader>
        <CardTitle>Recent Interviews</CardTitle>
        <CardDescription>Track your interview progress and upcoming sessions</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Position</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Stage</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {interviews.map((interview) => (
                <TableRow key={interview.id}>
                  <TableCell className="font-medium">{interview.jobTitle}</TableCell>
                  <TableCell>{interview.company}</TableCell>
                  <TableCell>{interview.stage}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        interview.status === 'completed'
                          ? 'default'
                          : interview.status === 'scheduled'
                            ? 'secondary'
                            : 'outline'
                      }
                    >
                      {interview.status === 'scheduled' && <Video className="mr-1 h-3 w-3" />}
                      {interview.status === 'completed' && (
                        <CheckCircle2 className="mr-1 h-3 w-3" />
                      )}
                      {interview.status === 'pending' && <Clock className="mr-1 h-3 w-3" />}
                      {interview.status.charAt(0).toUpperCase() + interview.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {interview.score ? (
                      <div className="flex items-center justify-end gap-2">
                        <Progress value={interview.score} className="h-2 w-16" />
                        <span className="text-sm font-medium">{interview.score}%</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  ),
)
InterviewsTable.displayName = 'InterviewsTable'

// Main Dashboard Component
export const CandidateDashboard = memo(() => {
  const [isLoading, setIsLoading] = useState(true)
  const [data, setData] = useState(generateMockData())
  const user = useAuthStore((state) => state.user)

  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const handleRefresh = useCallback(() => {
    setIsLoading(true)
    toast.promise(
      new Promise((resolve) => {
        setTimeout(() => {
          setData(generateMockData())
          setIsLoading(false)
          resolve(true)
        }, 1000)
      }),
      {
        loading: 'Refreshing dashboard...',
        success: 'Dashboard updated!',
        error: 'Failed to refresh dashboard',
      },
    )
  }, [])

  return (
    <SidebarProvider>
      <CandidateAppSidebar />
      <SidebarInset>
        {/* Header with Sidebar Trigger */}
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/">Home</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Dashboard</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle variant="dropdown" />
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRefresh}
              aria-label="Refresh dashboard"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
              <Bell className="h-4 w-4" />
              {data.notifications.filter((n) => n.unread).length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-xs font-bold text-zinc-950">
                  {data.notifications.filter((n) => n.unread).length}
                </span>
              )}
            </Button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="flex flex-col gap-2 py-4">
            <h1 className="text-3xl font-bold tracking-tight">Candidate Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back{user?.firstName ? `, ${user.firstName}` : ''}! Here's an overview of your
              interview status.
            </p>
          </div>

          {/* Stats Grid - Minimalist Widgets */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatsCard
              title="Total Interviews"
              value={data.stats.totalInterviews}
              description="All time"
              icon={FileText}
              isLoading={isLoading}
            />
            <StatsCard
              title="Completed"
              value={data.stats.completedInterviews}
              description="Successfully finished"
              icon={CheckCircle2}
              trend={{ value: 12, isPositive: true }}
              isLoading={isLoading}
            />
            <StatsCard
              title="Upcoming"
              value={data.stats.upcomingInterviews}
              description="Scheduled sessions"
              icon={Calendar}
              isLoading={isLoading}
            />
            <StatsCard
              title="Average Score"
              value={`${Math.round(data.stats.averageScore)}%`}
              description="Performance rating"
              icon={TrendingUp}
              trend={{ value: 5, isPositive: true }}
              isLoading={isLoading}
            />
          </div>

          {/* Interviews Table */}
          <InterviewsTable interviews={data.interviews} isLoading={isLoading} />

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks and shortcuts</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3">
              <Button asChild variant="default">
                <Link to="/interview">
                  <Video className="mr-2 h-4 w-4" />
                  Start Interview
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/schedule">
                  <Calendar className="mr-2 h-4 w-4" />
                  Schedule Interview
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/results">
                  <FileText className="mr-2 h-4 w-4" />
                  View Results
                </Link>
              </Button>
            </CardContent>
          </Card>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
})

CandidateDashboard.displayName = 'CandidateDashboard'
