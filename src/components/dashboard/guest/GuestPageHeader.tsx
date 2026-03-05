/**
 * GuestPageHeader
 *
 * Sticky glassmorphic top navigation shown on the guest landing page.
 * Extracted into its own file so it can be swapped or hidden via the
 * `showHeader` prop on `GuestDashboard` without touching layout logic.
 */

import { memo } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme/ThemeToggle'

export const GuestPageHeader = memo(function GuestPageHeader() {
  return (
    <header
      className="sticky top-0 z-50 flex w-full items-center justify-between border-b border-zinc-200/50 bg-white/80 px-6 py-4 backdrop-blur-xl transition-colors duration-300 md:px-12 dark:border-zinc-800/50 dark:bg-zinc-950/80"
      role="banner"
    >
      {/* Brand wordmark */}
      <Link to="/" aria-label="SmartHire AI Home" className="group flex items-center gap-3">
        <div
          aria-hidden="true"
          className="flex h-10 w-10 select-none items-center justify-center rounded-xl bg-emerald-500 text-sm font-bold text-zinc-950 shadow-[0_0_15px_rgba(16,185,129,0.4)] transition-transform duration-300 group-hover:scale-105"
        >
          SH
        </div>
        <span className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          SmartHire <span className="text-emerald-500">AI</span>
        </span>
      </Link>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <ThemeToggle variant="dropdown" />
        <Button
          asChild
          className="hidden cursor-pointer rounded-full bg-zinc-900 font-semibold text-zinc-50 shadow-sm transition-all hover:bg-zinc-800 sm:flex dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
        >
          <Link to="/login">Sign In</Link>
        </Button>
      </div>
    </header>
  )
})
