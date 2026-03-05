/**
 * GuestDashboard
 *
 * Landing page for unauthenticated candidates arriving via an invitation link.
 *
 * Design Strategy: HackQuest-Inspired Landing Page + Auth Theme
 * - Sticky glassmorphic top navigation header
 * - Full-bleed `TechBackground` base
 * - Open, spacious Hero layout balancing text and interactive join form
 * - Auth-aligned colors (emerald-500, zinc-950/zinc-50)
 */

import { memo, useCallback, useId, useState } from 'react'
import { ArrowRight, Clock, ShieldCheck, Video } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ThemeToggle } from '@/components/theme/ThemeToggle'
import { motion } from 'motion/react'
import { TechBackground } from '@/components/auth/components/TechBackground'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface FeatureItem {
  id: string
  icon: LucideIcon
  title: string
  description: string
}

interface GuestJoinFormProps {
  onSubmit: (code: string) => void
}

// ---------------------------------------------------------------------------
// Static data
// ---------------------------------------------------------------------------

const FEATURE_ITEMS: FeatureItem[] = [
  {
    id: 'live-ai',
    icon: Video,
    title: 'Live AI Presence',
    description: 'Interact naturally via voice and video with our responsive AI interviewer.',
  },
  {
    id: 'flexible-timing',
    icon: Clock,
    title: 'Flexible Timing',
    description: 'Take the interview on your own schedule. No timezone coordination needed.',
  },
  {
    id: 'unbiased',
    icon: ShieldCheck,
    title: 'Unbiased Evaluation',
    description: 'Standardized, objective scoring based entirely on your skills and responses.',
  },
]

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

const GuestPageHeader = memo(function GuestPageHeader() {
  return (
    <header className="sticky top-0 z-50 flex w-full items-center justify-between border-b border-zinc-200/50 bg-white/80 px-6 py-4 backdrop-blur-xl transition-colors duration-300 md:px-12 dark:border-zinc-800/50 dark:bg-zinc-950/80">
      <Link to="/" className="group flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500 text-sm font-bold text-zinc-950 shadow-[0_0_15px_rgba(16,185,129,0.4)] transition-transform duration-300 select-none group-hover:scale-105">
          SH
        </div>
        <span className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          SmartHire <span className="text-emerald-500">AI</span>
        </span>
      </Link>

      <div className="flex items-center gap-4">
        <ThemeToggle variant="dropdown" />
        <Button
          asChild
          className="hidden rounded-full bg-zinc-900 font-semibold text-zinc-50 shadow-sm transition-all hover:bg-zinc-800 sm:flex dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
        >
          <Link to="/login">Sign In</Link>
        </Button>
      </div>
    </header>
  )
})

const GuestHeroText = memo(function GuestHeroText() {
  return (
    <div className="flex w-full max-w-2xl flex-col text-center lg:text-left">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto mb-6 inline-flex w-max items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-sm font-medium text-emerald-600 lg:mx-0 dark:text-emerald-400"
      >
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
        </span>
        Systems Online
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-6 text-5xl leading-[1.1] font-bold tracking-tighter text-zinc-900 lg:text-7xl dark:text-zinc-50"
      >
        The Future Of <br />
        <span className="bg-gradient-to-r from-emerald-500 to-teal-400 bg-clip-text text-transparent">
          Tech Interviews
        </span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mx-auto mb-8 max-w-xl text-lg leading-relaxed text-zinc-600 lg:mx-0 dark:text-zinc-400"
      >
        Experience a fair, unbiased, and interactive technical evaluation driven by next-generation
        AI. Zero bias. Maximum signal.
      </motion.p>
    </div>
  )
})

const GuestJoinForm = memo(function GuestJoinForm({ onSubmit }: GuestJoinFormProps) {
  const [inviteCode, setInviteCode] = useState('')
  const inputId = useId()

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      const trimmed = inviteCode.trim()
      if (trimmed) onSubmit(trimmed)
    },
    [inviteCode, onSubmit],
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="w-full max-w-md"
    >
      <div className="group relative flex flex-col overflow-hidden rounded-3xl border border-zinc-200/80 bg-white/80 p-8 shadow-2xl shadow-zinc-200/50 backdrop-blur-xl dark:border-zinc-700/50 dark:bg-zinc-900/80 dark:shadow-emerald-900/10">
        {/* Subtle glass reflection effect */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent dark:via-white/10" />

        <div className="mb-6">
          <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">Join Session</h3>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Enter your organization's authorization code to begin.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="relative z-10 flex flex-col gap-5" noValidate>
          <div className="space-y-2">
            <label
              htmlFor={inputId}
              className="ml-1 text-xs font-semibold tracking-wider text-zinc-700 uppercase dark:text-zinc-300"
            >
              Authorization Code
            </label>
            <Input
              id={inputId}
              autoComplete="off"
              autoFocus
              placeholder="e.g. INT-1234-ABCD"
              className="h-14 rounded-xl border-zinc-300 bg-white text-center text-lg tracking-widest text-zinc-900 uppercase shadow-sm transition-all placeholder:text-zinc-400 focus-visible:border-emerald-500 focus-visible:ring-emerald-500/40 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder:text-zinc-600"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
            />
          </div>

          <Button
            type="submit"
            className="group h-14 w-full rounded-xl bg-emerald-500 text-base font-bold text-zinc-950 shadow-[0_0_20px_rgba(16,185,129,0.2)] transition-all hover:bg-emerald-400 hover:shadow-[0_0_25px_rgba(16,185,129,0.4)]"
            disabled={!inviteCode.trim()}
          >
            Initialize Environment
            <ArrowRight
              className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1"
              aria-hidden="true"
            />
          </Button>
        </form>
      </div>
    </motion.div>
  )
})

const GuestFeatures = memo(function GuestFeatures() {
  return (
    <section
      aria-label="Features overview"
      className="relative z-10 mt-20 w-full border-t border-zinc-200/50 pt-16 lg:mt-32 dark:border-zinc-800/80"
    >
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-8 md:grid-cols-3">
        {FEATURE_ITEMS.map(({ id, icon: Icon, title, description }, index) => (
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.15 }}
            key={id}
            className="group flex flex-col items-center rounded-3xl p-6 text-center transition-colors duration-300 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/30"
          >
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-zinc-200/80 bg-white text-emerald-500 shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:text-emerald-400 group-hover:shadow-[0_0_20px_rgba(16,185,129,0.15)] dark:border-zinc-800 dark:bg-zinc-900">
              <Icon className="h-6 w-6" />
            </div>
            <h2 className="mb-3 text-lg font-bold text-zinc-900 dark:text-zinc-50">{title}</h2>
            <p className="text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
              {description}
            </p>
          </motion.article>
        ))}
      </div>
    </section>
  )
})

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------

export const GuestDashboard: React.FC = () => {
  const navigate = useNavigate()

  const handleJoin = useCallback(
    (code: string) => {
      navigate(`/interview?code=${encodeURIComponent(code)}`)
    },
    [navigate],
  )

  return (
    <div className="text-foreground relative flex min-h-screen flex-col bg-zinc-50 font-sans selection:bg-emerald-500/30 dark:bg-zinc-950">
      {/* Global Auth Tech Background */}
      <TechBackground />

      {/* Sticky Header */}
      <GuestPageHeader />

      <main className="relative z-10 mx-auto flex w-full max-w-[1400px] flex-1 flex-col overflow-hidden px-6 py-12 md:py-20 lg:px-12">
        {/* Hero Section */}
        <div className="mt-4 flex w-full flex-col items-center justify-between gap-16 lg:mt-12 lg:flex-row lg:gap-8">
          <GuestHeroText />
          <GuestJoinForm onSubmit={handleJoin} />
        </div>

        {/* Features Section */}
        <GuestFeatures />
      </main>
    </div>
  )
}
