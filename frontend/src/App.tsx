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
import { ScheduleInterview } from './components/dashboard/ScheduleInterview'
import { ResultsList } from './components/dashboard/ResultsList'
import { InterviewsList } from './components/dashboard/InterviewsList'
import { ResumePage } from './components/dashboard/ResumePage'
import { SettingsPage } from './components/dashboard/SettingsPage'
import { ProfilePage } from './components/dashboard/ProfilePage'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import { Login } from './components/auth/Login'
import { Register } from './components/auth/Register'
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

  if (!user) return <GuestDashboard />

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

          let userRole: 'admin' | 'recruiter' | 'candidate' = 'candidate'
          if (attributes['custom:role']) {
            const role = attributes['custom:role']
            if (role === 'admin' || role === 'recruiter' || role === 'candidate') {
              userRole = role
            }
          }

          const loggedUser: User = {
            id: attributes.sub || '',
            email: attributes.email || '',
            firstName: attributes.given_name || 'User',
            lastName: attributes.family_name || '',
            role: userRole,
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

    checkUserSession()

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

            {/* Root — role-based redirect */}
            <Route path="/" element={<RootRoute />} />

            {/* Candidate Routes (Protected) */}
            <Route
              path="/schedule"
              element={
                <ProtectedRoute allowedRoles={['candidate']}>
                  <ScheduleInterview />
                </ProtectedRoute>
              }
            />
            <Route
              path="/results"
              element={
                <ProtectedRoute allowedRoles={['candidate']}>
                  <ResultsList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/interviews"
              element={
                <ProtectedRoute allowedRoles={['candidate']}>
                  <InterviewsList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/resume"
              element={
                <ProtectedRoute allowedRoles={['candidate']}>
                  <ResumePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute allowedRoles={['candidate', 'recruiter', 'admin']}>
                  <SettingsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute allowedRoles={['candidate', 'recruiter', 'admin']}>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />

            {/* Recruiter/Admin Routes (Protected) */}
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
                <ProtectedRoute allowedRoles={['recruiter', 'admin', 'candidate']}>
                  <CandidateReport />
                </ProtectedRoute>
              }
            />

            {/* Interview (Public & Isolated) */}
            <Route path="/interview" element={<InterviewWorkspace />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthInitializer>
    </ThemeProvider>
  )
}

export default App
