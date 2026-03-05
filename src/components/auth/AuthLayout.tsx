/**
 * AuthLayout
 *
 * Shell layout for all authentication pages (Login, Register, …).
 *
 * Structure:
 *   <BrandingPanel />   – always-dark marketing column (hidden on mobile)
 *   <main>              – form panel; theme-aware (light / dark)
 *     <ThemeToggle />   – top-right corner
 *     {children}        – page-specific form content
 *   </main>
 */

import { memo } from 'react'
import { BrandingPanel } from './components/BrandingPanel'
import { TechBackground } from './components/TechBackground'
import { ThemeToggle } from '@/components/theme/ThemeToggle'
import type { AuthLayoutProps } from './types'

export const AuthLayout = memo<AuthLayoutProps>(function AuthLayout({ children }) {
  return (
    <div className="relative flex min-h-screen w-full overflow-hidden font-sans">
      {/* Full-bleed background */}
      <TechBackground />

      {/* Page content */}
      <div className="relative z-10 mx-auto flex w-full max-w-350 flex-1 items-center justify-center gap-8 px-6 py-10 sm:px-10 lg:justify-between lg:gap-20 lg:px-16">
        {/* Left: branding column */}
        <BrandingPanel />

        {/* Right: glassmorphic form card */}
        <main
          className="relative flex w-full max-w-105 shrink-0 flex-col items-center justify-center rounded-3xl border border-zinc-200/80 bg-white/80 px-8 py-10 shadow-xl shadow-zinc-200/60 backdrop-blur-xl sm:px-10 dark:border-zinc-700/50 dark:bg-zinc-900/80 dark:shadow-zinc-950/80"
          role="main"
        >
          {/* Theme toggle – top-right of card */}
          <div className="absolute top-4 right-4">
            <ThemeToggle variant="dropdown" />
          </div>

          <div className="flex w-full flex-col items-stretch">{children}</div>
        </main>
      </div>
    </div>
  )
})

AuthLayout.displayName = 'AuthLayout'
