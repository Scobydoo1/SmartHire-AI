/**
 * Recruiter Dashboard Component
 * Optimized with Sidebar Component
 * Features:
 * - shadcn/ui Sidebar with collapsible navigation
 * - Job postings management
 * - Candidate pipeline overview
 * - Interview scheduling
 * - Analytics and reporting
 */

import { memo, useState, useCallback, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Bell,
  Briefcase,
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  RefreshCw,
  TrendingUp,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/store/authStore";

// UI Components
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { RecruiterAppSidebar } from "./RecruiterAppSidebar";
import { ThemeToggle } from "@/components/theme";

// Types
interface JobPosting {
  id: string;
  title: string;
  department: string;
  status: "active" | "paused" | "closed";
  applicants: number;
  interviewed: number;
  hired: number;
  postedDate: string;
}

interface RecruiterStats {
  activeJobs: number;
  totalApplicants: number;
  interviewsScheduled: number;
  hireRate: number;
}

// Mock Data Generator
const generateMockData = (): {
  stats: RecruiterStats;
  jobs: JobPosting[];
  notifications: Array<{
    id: string;
    message: string;
    time: string;
    unread: boolean;
  }>;
} => {
  const jobs: JobPosting[] = [
    {
      id: "1",
      title: "Senior Frontend Developer",
      department: "Engineering",
      status: "active",
      applicants: 45,
      interviewed: 12,
      hired: 2,
      postedDate: "2026-02-15",
    },
    {
      id: "2",
      title: "Full Stack Engineer",
      department: "Engineering",
      status: "active",
      applicants: 38,
      interviewed: 8,
      hired: 1,
      postedDate: "2026-02-20",
    },
    {
      id: "3",
      title: "Product Manager",
      department: "Product",
      status: "active",
      applicants: 52,
      interviewed: 15,
      hired: 3,
      postedDate: "2026-02-10",
    },
    {
      id: "4",
      title: "UX Designer",
      department: "Design",
      status: "paused",
      applicants: 28,
      interviewed: 5,
      hired: 0,
      postedDate: "2026-01-25",
    },
  ];

  const stats: RecruiterStats = {
    activeJobs: jobs.filter((j) => j.status === "active").length,
    totalApplicants: jobs.reduce((acc, j) => acc + j.applicants, 0),
    interviewsScheduled: jobs.reduce((acc, j) => acc + j.interviewed, 0),
    hireRate: Math.round(
      (jobs.reduce((acc, j) => acc + j.hired, 0) /
        jobs.reduce((acc, j) => acc + j.applicants, 0)) *
        100,
    ),
  };

  const notifications = [
    {
      id: "1",
      message: "New application for Senior Frontend Developer",
      time: "10m ago",
      unread: true,
    },
    {
      id: "2",
      message: "Interview scheduled with candidate John Doe",
      time: "1h ago",
      unread: true,
    },
    {
      id: "3",
      message: "Candidate accepted offer for Product Manager",
      time: "3h ago",
      unread: false,
    },
  ];

  return { stats, jobs, notifications };
};

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
    title: string;
    value: string | number;
    description: string;
    icon: React.ElementType;
    trend?: { value: number; isPositive: boolean };
    isLoading?: boolean;
  }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <>
            <Skeleton className="h-8 w-24 mb-2" />
            <Skeleton className="h-4 w-32" />
          </>
        ) : (
          <>
            <div className="text-2xl font-bold">{value}</div>
            <p className="text-xs text-muted-foreground flex items-center gap-2">
              {trend && (
                <span
                  className={
                    trend.isPositive ? "text-emerald-500" : "text-red-500"
                  }
                >
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
);
StatsCard.displayName = "StatsCard";

// Jobs Table Component
const JobsTable = memo(
  ({
    jobs,
    isLoading = false,
  }: {
    jobs: JobPosting[];
    isLoading?: boolean;
  }) => (
    <Card>
      <CardHeader>
        <CardTitle>Active Job Postings</CardTitle>
        <CardDescription>Manage your recruitment pipeline</CardDescription>
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
                <TableHead>Job Title</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Applicants</TableHead>
                <TableHead className="text-right">Interviewed</TableHead>
                <TableHead className="text-right">Hired</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {jobs.map((job) => (
                <TableRow key={job.id}>
                  <TableCell className="font-medium">{job.title}</TableCell>
                  <TableCell>{job.department}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        job.status === "active"
                          ? "default"
                          : job.status === "paused"
                            ? "secondary"
                            : "outline"
                      }
                    >
                      {job.status === "active" && (
                        <CheckCircle2 className="mr-1 h-3 w-3" />
                      )}
                      {job.status === "paused" && (
                        <Clock className="mr-1 h-3 w-3" />
                      )}
                      {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">{job.applicants}</TableCell>
                  <TableCell className="text-right">
                    {job.interviewed}
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="font-semibold text-emerald-500">
                      {job.hired}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  ),
);
JobsTable.displayName = "JobsTable";

// Main Dashboard Component
export const RecruiterDashboard = memo(() => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(generateMockData());
  const user = useAuthStore((state) => state.user);
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleRefresh = useCallback(() => {
    setIsLoading(true);
    toast.promise(
      new Promise((resolve) => {
        setTimeout(() => {
          setData(generateMockData());
          setIsLoading(false);
          resolve(true);
        }, 1000);
      }),
      {
        loading: "Refreshing dashboard...",
        success: "Dashboard updated!",
        error: "Failed to refresh dashboard",
      },
    );
  }, []);

  return (
    <SidebarProvider>
      <RecruiterAppSidebar />
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
                <BreadcrumbPage>
                  {isAdmin ? "Admin" : "Recruiter"} Dashboard
                </BreadcrumbPage>
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
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              aria-label="Notifications"
            >
              <Bell className="h-4 w-4" />
              {data.notifications.filter((n) => n.unread).length > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-emerald-500 text-xs font-bold flex items-center justify-center text-zinc-950">
                  {data.notifications.filter((n) => n.unread).length}
                </span>
              )}
            </Button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="flex flex-col gap-2 py-4">
            <h1 className="text-3xl font-bold tracking-tight">
              {isAdmin ? "Admin" : "Recruiter"} Dashboard
            </h1>
            <p className="text-muted-foreground">
              Manage your recruitment pipeline and track hiring metrics.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatsCard
              title="Active Jobs"
              value={data.stats.activeJobs}
              description="Currently hiring"
              icon={Briefcase}
              isLoading={isLoading}
            />
            <StatsCard
              title="Total Applicants"
              value={data.stats.totalApplicants}
              description="Across all positions"
              icon={Users}
              trend={{ value: 12, isPositive: true }}
              isLoading={isLoading}
            />
            <StatsCard
              title="Interviews Scheduled"
              value={data.stats.interviewsScheduled}
              description="This month"
              icon={Calendar}
              isLoading={isLoading}
            />
            <StatsCard
              title="Hire Rate"
              value={`${data.stats.hireRate}%`}
              description="Success rate"
              icon={TrendingUp}
              trend={{ value: 5, isPositive: true }}
              isLoading={isLoading}
            />
          </div>

          <JobsTable jobs={data.jobs} isLoading={isLoading} />

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common recruitment tasks</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3">
              <Button asChild variant="default">
                <Link to="/create-job">
                  <Briefcase className="mr-2 h-4 w-4" />
                  Create Job Posting
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/schedule">
                  <Calendar className="mr-2 h-4 w-4" />
                  Schedule Interviews
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/reports">
                  <FileText className="mr-2 h-4 w-4" />
                  View Reports
                </Link>
              </Button>
            </CardContent>
          </Card>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
});

RecruiterDashboard.displayName = "RecruiterDashboard";
