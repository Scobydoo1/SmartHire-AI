import React from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PlayCircle, Clock, CheckCircle2 } from "lucide-react";

export const DashboardHome: React.FC = () => {
  // Mock Active Sessions
  const activeSessions = [
    {
      id: "INT-001",
      candidate: "Sarah Jenkins",
      role: "Senior Frontend Engineer",
      status: "Live",
      progress: "45m elapsed",
    },
    {
      id: "INT-002",
      candidate: "Michael Chen",
      role: "Backend Developer",
      status: "Live",
      progress: "12m elapsed",
    },
    {
      id: "INT-003",
      candidate: "Elena Rodriguez",
      role: "DevOps Engineer",
      status: "Completed",
      progress: "Finished",
    },
    {
      id: "INT-004",
      candidate: "James Smith",
      role: "Fullstack Developer",
      status: "Scheduled",
      progress: "In 2 hours",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-8 animate-in fade-in zoom-in-95 duration-500">
      {/* Header Section */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-50">
            Overview
          </h1>
          <p className="text-zinc-400 mt-1">
            Monitor real-time interview sessions and view scheduled events.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* KPI Cards */}
        <Card className="p-6 bg-zinc-900/50 border-zinc-800">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-500/10 rounded-lg text-emerald-500">
              <PlayCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-400">Live Sessions</p>
              <h3 className="text-2xl font-bold text-zinc-50">2</h3>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-zinc-900/50 border-zinc-800">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 rounded-lg text-blue-500">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-400">
                Scheduled Today
              </p>
              <h3 className="text-2xl font-bold text-zinc-50">5</h3>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-zinc-900/50 border-zinc-800">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-zinc-800 rounded-lg text-zinc-300">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-400">
                Completed (Week)
              </p>
              <h3 className="text-2xl font-bold text-zinc-50">24</h3>
            </div>
          </div>
        </Card>
      </div>

      {/* Active Sessions Table */}
      <Card className="bg-zinc-900/40 border-zinc-800 overflow-hidden">
        <div className="p-6 border-b border-zinc-800">
          <h2 className="text-lg font-semibold text-zinc-100">
            Live & Recent Sessions
          </h2>
        </div>

        <div className="px-6 pb-6 pt-2">
          <Table>
            <TableHeader>
              <TableRow className="border-zinc-800 hover:bg-transparent">
                <TableHead className="text-zinc-400">Candidate</TableHead>
                <TableHead className="text-zinc-400">Role</TableHead>
                <TableHead className="text-zinc-400">Status</TableHead>
                <TableHead className="text-zinc-400 text-right">
                  Details
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activeSessions.map((session) => (
                <TableRow
                  key={session.id}
                  className="border-zinc-800/50 hover:bg-zinc-800/50 transition-colors"
                >
                  <TableCell className="font-medium text-zinc-200">
                    {session.candidate}
                  </TableCell>
                  <TableCell className="text-zinc-400">
                    {session.role}
                  </TableCell>
                  <TableCell>
                    {session.status === "Live" && (
                      <Badge
                        variant="outline"
                        className="bg-emerald-500/10 border-emerald-500/30 text-emerald-400 gap-1.5 px-2.5"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Live
                      </Badge>
                    )}
                    {session.status === "Completed" && (
                      <Badge
                        variant="outline"
                        className="bg-zinc-800 border-zinc-700 text-zinc-300"
                      >
                        Completed
                      </Badge>
                    )}
                    {session.status === "Scheduled" && (
                      <Badge
                        variant="outline"
                        className="bg-blue-500/10 border-blue-500/30 text-blue-400"
                      >
                        Scheduled
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right text-zinc-500 text-sm">
                    {session.status === "Completed" ? (
                      <Link
                        to={`/report/${session.id}`}
                        className="text-emerald-500 hover:text-emerald-400 font-medium"
                      >
                        View Report
                      </Link>
                    ) : (
                      session.progress
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
};
