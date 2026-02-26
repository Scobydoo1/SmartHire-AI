import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { InterviewWorkspace } from "./components/interview/InterviewWorkspace";
import { DashboardHome } from "./components/dashboard/DashboardHome";
import { LayoutDashboard, PlusCircle, FileBarChart } from "lucide-react";
import { JobCreation } from "./components/dashboard/JobCreation";
import { CandidateReport } from "./components/dashboard/CandidateReport";

// Admin Layout Shell
const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex h-screen w-full bg-zinc-950 text-zinc-50 overflow-hidden font-sans">
      <nav className="w-64 border-r border-zinc-800 bg-zinc-950/50 flex flex-col p-4 gap-4">
        <div className="font-bold text-xl text-zinc-100 mb-6 flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-emerald-500 flex items-center justify-center text-zinc-950 text-sm">
            SH
          </div>
          SmartHire Admin
        </div>

        <div className="flex flex-col gap-2">
          <a
            href="/"
            className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-zinc-800 text-sm font-medium text-zinc-300 hover:text-zinc-50 transition-colors"
          >
            <LayoutDashboard className="w-4 h-4" /> Dashboard
          </a>
          <a
            href="/create-job"
            className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-zinc-800 text-sm font-medium text-zinc-300 hover:text-zinc-50 transition-colors"
          >
            <PlusCircle className="w-4 h-4" /> Create Job
          </a>
          <a
            href="/report/demo"
            className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-zinc-800 text-sm font-medium text-zinc-300 hover:text-zinc-50 transition-colors"
          >
            <FileBarChart className="w-4 h-4" /> View Report
          </a>
        </div>
      </nav>

      <main className="flex-1 overflow-auto bg-zinc-950 relative">
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative z-10 w-full h-full p-8">{children}</div>
      </main>
    </div>
  );
};

export function App() {
  return (
    <div className="dark">
      <BrowserRouter>
        <Routes>
          {/* Admin Dashboard Routes */}
          <Route
            path="/"
            element={
              <AdminLayout>
                <DashboardHome />
              </AdminLayout>
            }
          />
          <Route
            path="/create-job"
            element={
              <AdminLayout>
                <JobCreation />
              </AdminLayout>
            }
          />
          <Route
            path="/report/:id"
            element={
              <AdminLayout>
                <CandidateReport />
              </AdminLayout>
            }
          />

          {/* Candidate Interview Route (Isolated Layout) */}
          <Route path="/interview" element={<InterviewWorkspace />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
