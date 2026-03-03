import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./lib/cognito"; // Initialize AWS Amplify
import { InterviewWorkspace } from "./components/interview/InterviewWorkspace";
import { DashboardHome } from "./components/dashboard/DashboardHome";
import { LayoutDashboard, PlusCircle, FileBarChart } from "lucide-react";
import { JobCreation } from "./components/dashboard/JobCreation";
import { CandidateReport } from "./components/dashboard/CandidateReport";

import { GuestDashboard } from "./components/dashboard/GuestDashboard";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { Login } from "./components/auth/Login";
import { Register } from "./components/auth/Register";
import { LogOut, Loader2 } from "lucide-react";
import { useAuthStore, type User } from "./store/authStore";
import { Toaster } from "@/components/ui/sonner";
import { useEffect } from "react";
import {
  fetchAuthSession,
  fetchUserAttributes,
  signOut,
} from "aws-amplify/auth";
import { Hub } from "aws-amplify/utils";

// Admin Layout Shell
const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const user = useAuthStore((state) => state.user);
  return (
    <div className="flex h-screen w-full bg-zinc-950 text-zinc-50 overflow-hidden font-sans">
      <nav className="w-64 border-r border-zinc-800 bg-zinc-950/50 flex flex-col p-4 gap-4">
        <div className="font-bold text-xl text-zinc-100 mb-6 flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-emerald-500 flex items-center justify-center text-zinc-950 text-sm">
            SH
          </div>
          SmartHire Admin
        </div>

        <div className="flex flex-col gap-2 flex-grow">
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

        <div className="border-t border-zinc-800 pt-4 mt-auto">
          <div className="px-3 pb-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
            {user?.email || "Account"}
          </div>
          <button
            onClick={async () => {
              try {
                await signOut();
              } catch (err) {
                console.error("Error signing out:", err);
              }
            }}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-zinc-800 text-sm font-medium text-zinc-300 hover:text-red-400 transition-colors text-left"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
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

// Root Route handler to direct users to Guest or Admin Dashboard based on auth status
const RootRoute: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  const isLoading = useAuthStore((state) => state.isLoading);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-zinc-950 text-emerald-500 border">
        <Loader2 className="w-10 h-10 animate-spin" />
      </div>
    );
  }

  if (user) {
    return (
      <AdminLayout>
        <DashboardHome />
      </AdminLayout>
    );
  }

  return <GuestDashboard />;
};

// AuthInitializer synchronizes Amplify auth state with Zustand
const AuthInitializer: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const login = useAuthStore((state) => state.login);
  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    const checkUserSession = async () => {
      try {
        const session = await fetchAuthSession();
        if (session.tokens) {
          const attributes = await fetchUserAttributes();
          const token = session.tokens.idToken?.toString() || "";

          const loggedUser: User = {
            id: attributes.sub || "",
            email: attributes.email || "",
            firstName: attributes.given_name || "User",
            lastName: attributes.family_name || "",
            role: "admin",
          };
          login(loggedUser, token);
        } else {
          logout();
        }
      } catch (error) {
        console.error("Auth session check failed:", error);
        logout();
      }
    };

    // Check session on component mount
    checkUserSession();

    // Listen to Amplify Auth Hub events (login/logout from other tabs/components)
    const unsubscribe = Hub.listen("auth", ({ payload }) => {
      switch (payload.event) {
        case "signedIn":
          checkUserSession();
          break;
        case "signedOut":
          logout();
          break;
        case "tokenRefresh_failure":
          logout();
          break;
      }
    });

    return unsubscribe;
  }, [login, logout]);

  return <>{children}</>;
};

export function App() {
  return (
    <div className="dark">
      <Toaster />
      <AuthInitializer>
        <BrowserRouter>
          <Routes>
            {/* Public Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Root Conditional Route */}
            <Route path="/" element={<RootRoute />} />

            {/* Admin Dashboard Routes (Protected) */}
            <Route
              path="/create-job"
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <JobCreation />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/report/:id"
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <CandidateReport />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />

            {/* Candidate Interview Route (Public & Isolated Layout) */}
            <Route path="/interview" element={<InterviewWorkspace />} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthInitializer>
    </div>
  );
}

export default App;
