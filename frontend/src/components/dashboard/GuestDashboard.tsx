/**
 * GuestDashboard
 *
 * Landing page for unauthenticated candidates arriving via an invitation link.
 *
 * Layout is fully composable:
 *  - `showHeader`   – toggles the sticky page header (default: true)
 *  - `showFeatures` – toggles the features grid     (default: true)
 *  - `onJoin`       – override the default navigation handler
 *  - `className`    – extra classes on the outermost wrapper
 *
 * All layout sub-components live in `./guest/` and are independently
 * importable for testing or composition in other pages.
 */

import React, { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { TechBackground } from '@/components/auth/components/TechBackground'
import { GuestPageHeader } from './guest/GuestPageHeader'
import { GuestHeroText } from './guest/GuestHeroText'
import { GuestJoinForm } from './guest/GuestJoinForm'
import { GuestFeatures } from './guest/GuestFeatures'
import type { GuestDashboardProps } from './guest/types'

export const GuestDashboard: React.FC<GuestDashboardProps> = ({
  onJoin,
  showHeader = true,
  showFeatures = true,
  className,
}) => {
  const navigate = useNavigate()

  const handleJoin = useCallback(
    (code: string) => {
      if (onJoin) {
        onJoin(code)
      } else {
        navigate(`/interview?code=${encodeURIComponent(code)}`)
      }
    },
    [onJoin, navigate],
  )

  return (
    <div
      className={cn(
        'text-foreground relative flex min-h-screen flex-col bg-zinc-50 font-sans selection:bg-emerald-500/30 dark:bg-zinc-950',
        className,
      )}
    >
      {/* Full-bleed animated tech grid */}
      <TechBackground />

      {/* Sticky header — can be hidden for embedding scenarios */}
      {showHeader && <GuestPageHeader />}

      <main
        className="relative z-10 mx-auto flex w-full max-w-350 flex-1 flex-col overflow-hidden px-6 py-12 md:py-20 lg:px-12"
        id="main-content"
      >
        {/* ── Hero ── */}
        <div className="mt-4 flex w-full flex-col items-center justify-between gap-16 lg:mt-12 lg:flex-row lg:gap-8">
          <GuestHeroText />
          <GuestJoinForm onSubmit={handleJoin} />
        </div>

        {/* ── Features grid — can be hidden for compact embeds ── */}
        {showFeatures && <GuestFeatures />}
      </main>
    </div>
  )
}
