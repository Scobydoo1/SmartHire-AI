/**
 * GuestDashboard
 *
 * Landing page for unauthenticated candidates arriving via an invitation link.
 *
 * Layout structure:
 *   <GuestPageHeader>   – branding + theme toggle (sticky)
 *   <main>
 *     <GuestHero>       – headline + sub-copy
 *     <GuestJoinForm>   – invitation-code entry
 *     <GuestFeatures>   – value-prop cards
 *   </main>
 *   <GuestPageFooter>   – recruiter sign-in link
 *
 * Optimisations vs. original:
 * - Semantic HTML landmarks (<header>, <main>, <footer>) for a11y + SEO.
 * - Theme-aware colours via Tailwind's `dark:` variant – respects ThemeProvider.
 * - ThemeToggle integrated into the header.
 * - Sub-components wrapped in React.memo to prevent cascading re-renders.
 * - Feature data extracted to a typed constant → avoids referential churn.
 * - useCallback stabilises the form-submit handler.
 * - Accessible label linked to input via htmlFor/id pair.
 * - Background blobs isolated in a dedicated aria-hidden layer.
 */

import { memo, useCallback, useId, useState } from 'react'
import { ArrowRight, Clock, ShieldCheck, Video } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ThemeToggle } from '@/components/theme/ThemeToggle'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface FeatureItem {
  id: string
  icon: LucideIcon
  iconClass: string
  title: string
  description: string
}

interface GuestJoinFormProps {
  onSubmit: (code: string) => void
}

// ---------------------------------------------------------------------------
// Static data – defined outside the component to avoid re-allocation
// ---------------------------------------------------------------------------

const FEATURE_ITEMS: FeatureItem[] = [
  {
    id: 'live-ai',
    icon: Video,
    iconClass: 'text-emerald-400',
    title: 'Live AI Presence',
    description: 'Interact naturally via voice and video with our responsive AI interviewer.',
  },
  {
    id: 'flexible-timing',
    icon: Clock,
    iconClass: 'text-blue-400',
    title: 'Flexible Timing',
    description: 'Take the interview on your own schedule. No timezone coordination needed.',
  },
  {
    id: 'unbiased',
    icon: ShieldCheck,
    iconClass: 'text-orange-400',
    title: 'Unbiased Evaluation',
    description: 'Standardised, objective scoring based entirely on your skills and responses.',
  },
]

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

/** Sticky top bar: SmartHire logo wordmark + theme toggle. */
const GuestPageHeader = memo(function GuestPageHeader() {
  return (
    <header className="sticky top-0 z-20 flex w-full items-center justify-between border-b border-zinc-200 bg-white/80 px-6 py-4 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/80">
      <div className="flex items-center gap-3">
        {/* Logo mark */}
        <span
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500 text-sm font-bold text-zinc-950 shadow-[0_0_20px_rgba(16,185,129,0.3)] select-none"
          aria-hidden="true"
        >
          SH
        </span>
        <span className="text-base font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          SmartHire AI
        </span>
      </div>

      <div className="flex items-center gap-3">
        <ThemeToggle variant="dropdown" />
        <Button
          asChild
          variant="outline"
          size="sm"
          className="border-zinc-300 text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
        >
          <Link to="/login">Log in</Link>
        </Button>
      </div>
    </header>
  )
})

/** Headline and sub-copy centred above the join form. */
const GuestHero = memo(function GuestHero() {
  return (
    <div className="mb-10 flex flex-col items-center text-center">
      <h1 className="mb-4 text-4xl font-bold tracking-tight text-zinc-900 md:text-5xl dark:text-zinc-50">
        Welcome to your <span className="text-emerald-500 dark:text-emerald-400">AI Interview</span>
      </h1>
      <p className="max-w-2xl text-lg text-zinc-500 dark:text-zinc-400">
        Experience a fair, unbiased, and interactive technical interview driven by next-generation
        AI. Please enter your unique invitation code to begin.
      </p>
    </div>
  )
})

/** Invitation-code form card. */
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
    <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white/60 p-8 shadow-2xl backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-900/50">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        <div className="space-y-2">
          <label
            htmlFor={inputId}
            className="ml-1 text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Invitation Code
          </label>
          <Input
            id={inputId}
            autoComplete="off"
            autoFocus
            placeholder="e.g. INT-1234-ABCD"
            className="h-12 border-zinc-300 bg-zinc-50 text-center tracking-widest text-zinc-900 uppercase placeholder:text-zinc-400 focus-visible:ring-emerald-500/50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-600"
            value={inviteCode}
            onChange={(e) => setInviteCode(e.target.value)}
          />
        </div>

        <Button
          type="submit"
          className="group h-12 w-full bg-emerald-500 text-base font-bold text-zinc-950 transition-all hover:bg-emerald-600"
          disabled={!inviteCode.trim()}
        >
          Enter Waiting Room
          <ArrowRight
            className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1"
            aria-hidden="true"
          />
        </Button>
      </form>
    </div>
  )
})

/** Three value-proposition cards rendered from static data. */
const GuestFeatures = memo(function GuestFeatures() {
  return (
    <section
      aria-label="Interview features"
      className="mt-16 grid w-full max-w-3xl grid-cols-1 gap-6 md:grid-cols-3"
    >
      {FEATURE_ITEMS.map(({ id, icon: Icon, iconClass, title, description }) => (
        <article key={id} className="flex flex-col items-center p-4 text-center">
          <div
            className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900"
            aria-hidden="true"
          >
            <Icon className={`h-5 w-5 ${iconClass}`} />
          </div>
          <h2 className="mb-2 text-base font-semibold text-zinc-800 dark:text-zinc-200">{title}</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-500">{description}</p>
        </article>
      ))}
    </section>
  )
})

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------

export const GuestDashboard: React.FC = () => {
  const navigate = useNavigate()

  /** Stable reference – won't recreate on every render. */
  const handleJoin = useCallback(
    (code: string) => {
      navigate(`/interview?code=${encodeURIComponent(code)}`)
    },
    [navigate],
  )

  return (
    <div className="flex min-h-screen flex-col bg-white font-sans text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50">
      <GuestPageHeader />

      {/* Decorative background blobs – visually hidden from assistive tech */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute top-0 right-0 h-125 w-125 rounded-full bg-emerald-500/10 blur-[120px]" />
        <div className="absolute bottom-0 left-0 h-125 w-125 rounded-full bg-blue-500/10 blur-[120px]" />
      </div>

      <main className="animate-in fade-in slide-in-from-bottom-8 relative z-10 flex flex-1 flex-col items-center justify-center px-6 py-16 duration-700">
        <div className="flex w-full max-w-4xl flex-col items-center">
          <GuestHero />
          <GuestJoinForm onSubmit={handleJoin} />
          <GuestFeatures />
        </div>
      </main>
    </div>
  )
}
