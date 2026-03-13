import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './lib/cognito' // Initialize AWS Amplify
import { InterviewWorkspace } from './components/interview/InterviewWorkspace'
import { DashboardHome } from './components/dashboard/DashboardHome'
import { JobCreation } from './components/dashboard/JobCreation'
import { CandidateReport } from './components/dashboard/CandidateReport'

import { GuestDashboard } from './components/dashboard/GuestDashboard'
import { CandidateDashboard } from './components/dashboard/CandidateDashboard'
import { RecruiterDashboard } from './components/dashboard/RecruiterDashboard'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import { Login } from './components/auth/Login'
import { Register } from './components/auth/Register'
import { ForgotPassword } from './components/auth/ForgotPassword'
import { Loader2 } from 'lucide-react'
import { useAuthStore, type User } from './store/authStore'
import { Toaster } from '@/components/ui/sonner'
import { useEffect } from 'react'
import { fetchAuthSession, fetchUserAttributes } from 'aws-amplify/auth'
import { Hub } from 'aws-amplify/utils'
import { ThemeProvider } from '@/components/theme'

// Root Route handler to direct users based on role
const RootRoute: React.FC = () => {
  const user = useAuthStore((state) => state.user)
  const isLoading = useAuthStore((state) => state.isLoading)

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center border bg-zinc-950 text-emerald-500">
        <Loader2 className="h-10 w-10 animate-spin" />
      </div>
    )
  }

  // Not authenticated - show guest dashboard
  if (!user) {
    return <GuestDashboard />
  }

  // Route based on user role
  switch (user.role) {
    case 'candidate':
      return <CandidateDashboard />

    case 'recruiter':
      return <RecruiterDashboard />

    case 'admin':
      return <DashboardHome />

    default:
      return <GuestDashboard />
  }
}

// AuthInitializer synchronizes Amplify auth state with Zustand
function normalizeRole(raw?: string): User['role'] {
  const r = (raw ?? '').toLowerCase()
  return r === 'recruiter' || r === 'admin' || r === 'candidate' ? r : 'candidate'
}

const AuthInitializer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const login = useAuthStore((state) => state.login)
  const logout = useAuthStore((state) => state.logout)

  useEffect(() => {
    const checkUserSession = async () => {
      try {
        const session = await fetchAuthSession()
        if (session.tokens) {
          const attributes = await fetchUserAttributes()
          const token = session.tokens.idToken?.toString() || ''

          const loggedUser: User = {
            id: attributes.sub || '',
            email: attributes.email || '',
            name: attributes.name || 'User',
            role: normalizeRole(attributes['custom:role']),
          }
          login(loggedUser, token)
        } else {
          logout()
        }
      } catch (error) {
        console.error('Auth session check failed:', error)
        logout()
      }
    }

    // Check session on component mount
    checkUserSession()

    // Listen to Amplify Auth Hub events (login/logout from other tabs/components)
    const unsubscribe = Hub.listen('auth', ({ payload }) => {
      switch (payload.event) {
        case 'signedIn':
          checkUserSession()
          break
        case 'signedOut':
          logout()
          break
        case 'tokenRefresh_failure':
          logout()
          break
      }
    })

    return unsubscribe
  }, [login, logout])

  return <>{children}</>
}

export function App() {
  return (
    <ThemeProvider defaultTheme="dark">
      <Toaster />
      <AuthInitializer>
        <BrowserRouter>
          <Routes>
            {/* Public Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* Root Conditional Route - Routes based on role */}
            <Route path="/" element={<RootRoute />} />

            {/* Recruiter/Admin Dashboard Routes (Protected) */}
            <Route
              path="/create-job"
              element={
                <ProtectedRoute allowedRoles={['recruiter', 'admin']}>
                  <JobCreation />
                </ProtectedRoute>
              }
            />
            <Route
              path="/report/:id"
              element={
                <ProtectedRoute allowedRoles={['recruiter', 'admin']}>
                  <CandidateReport />
                </ProtectedRoute>
              }
            />

            {/* Candidate Interview Route (Public & Isolated Layout) */}
            <Route path="/interview" element={<InterviewWorkspace />} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthInitializer>
    </ThemeProvider>
  )
}

export default App
