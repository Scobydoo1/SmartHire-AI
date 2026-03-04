/**
 * Optimized ProtectedRoute Component
 * - Memoized to prevent unnecessary re-renders
 * - Added support for role-based access control
 * - Custom fallback loading component
 * - Better separation of loading states
 * - Proper accessibility attributes
 */

import React, { memo } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { Loader2 } from "lucide-react";
import type { ProtectedRouteProps } from "./types";

// Memoized loading component
const LoadingState = memo<{ message?: string }>(({ message }) => (
  <div
    className="flex h-screen w-full items-center justify-center bg-zinc-950 text-emerald-500"
    role="status"
    aria-live="polite"
  >
    <div className="flex flex-col items-center gap-4 animate-in fade-in duration-500">
      <Loader2 className="w-10 h-10 animate-spin" aria-hidden="true" />
      <p className="text-zinc-400 font-medium">
        {message || "Verifying Session..."}
      </p>
      <span className="sr-only">Loading, please wait</span>
    </div>
  </div>
));
LoadingState.displayName = "LoadingState";

// Memoized unauthorized component
const UnauthorizedState = memo<{ requiredRole?: string }>(
  ({ requiredRole }) => (
    <div
      className="flex h-screen w-full items-center justify-center bg-zinc-950"
      role="alert"
    >
      <div className="flex flex-col items-center gap-4 text-center max-w-md p-8">
        <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center">
          <svg
            className="w-8 h-8 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-zinc-50">Access Denied</h2>
        <p className="text-zinc-400">
          {requiredRole
            ? `You need ${requiredRole} role to access this page.`
            : "You don't have permission to access this page."}
        </p>
      </div>
    </div>
  ),
);
UnauthorizedState.displayName = "UnauthorizedState";

export const ProtectedRoute = memo<ProtectedRouteProps>(
  ({ children, fallback, requiredRole }) => {
    const user = useAuthStore((state) => state.user);
    const isLoading = useAuthStore((state) => state.isLoading);
    const location = useLocation();

    // Show loading state while verifying authentication
    if (isLoading) {
      return fallback ? <>{fallback}</> : <LoadingState />;
    }

    // Redirect to login if not authenticated
    if (!user) {
      return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Check role-based access if required
    if (requiredRole && user.role !== requiredRole) {
      return <UnauthorizedState requiredRole={requiredRole} />;
    }

    // Render protected content
    return <>{children}</>;
  },
);

ProtectedRoute.displayName = "ProtectedRoute";
