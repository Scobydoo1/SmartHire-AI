/**
 * BrandingPanel
 *
 * Left-hand marketing column shown on auth pages (Login, Register, …).
 * Follows the active theme – light or dark – via Tailwind dark: variants.
 */

import { memo, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Sparkles, Zap, ShieldCheck } from 'lucide-react'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Avatar seeds used to generate deterministic dicebear portraits. */
const AVATAR_SEEDS = [123, 246, 369, 492] as const

// ---------------------------------------------------------------------------
// FeaturePill
// ---------------------------------------------------------------------------

interface FeaturePillProps {
  icon: ReactNode
  label: string
}

const FeaturePill = memo(function FeaturePill({ icon, label }: FeaturePillProps) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200/60 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 dark:border-emerald-800/50 dark:bg-emerald-950/40 dark:text-emerald-400">
      {icon}
      {label}
    </span>
  )
})
FeaturePill.displayName = 'FeaturePill'

// ---------------------------------------------------------------------------
// BrandLogo
// ---------------------------------------------------------------------------

/** Logo mark + wordmark. Navigates to "/" on click. */
const BrandLogo = memo(function BrandLogo() {
  return (
    <Link
      to="/"
      className="group relative z-10 flex items-center gap-3 rounded focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none"
      aria-label="SmartHire AI – go to home"
    >
      <span
        className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 text-sm font-bold text-zinc-950 select-none"
        aria-hidden="true"
      >
        SH
      </span>
      <span className="text-2xl font-bold tracking-tight text-zinc-800 transition-colors group-hover:text-emerald-500 dark:text-zinc-100 dark:group-hover:text-emerald-400">
        SmartHire AI
      </span>
    </Link>
  )
})
BrandLogo.displayName = 'BrandLogo'

// ---------------------------------------------------------------------------
// SocialProof
// ---------------------------------------------------------------------------

/** Avatar stack with member-count copy. */
const SocialProof = memo(function SocialProof() {
  return (
    <div className="flex items-center gap-4">
      <div className="flex -space-x-3" aria-hidden="true">
        {AVATAR_SEEDS.map((seed) => (
          <div
            key={seed}
            className="h-9 w-9 overflow-hidden rounded-full border-2 border-white bg-zinc-200 ring-1 ring-zinc-200/50 dark:border-zinc-900 dark:bg-zinc-800 dark:ring-zinc-700/50"
          >
            <img
              src={`https://api.dicebear.com/7.x/notionists/svg?seed=${seed}&backgroundColor=18181b`}
              alt=""
              className="h-full w-full object-cover"
              loading="lazy"
              decoding="async"
            />
          </div>
        ))}
      </div>
      <div>
        <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">10,000+ teams</p>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">already hiring smarter</p>
      </div>
    </div>
  )
})
SocialProof.displayName = 'SocialProof'

// ---------------------------------------------------------------------------
// StatsRow
// ---------------------------------------------------------------------------

const STATS = [
  { value: '4×', label: 'Faster hiring' },
  { value: '98%', label: 'Accuracy' },
  { value: '60%', label: 'Cost reduction' },
] as const

const StatsRow = memo(function StatsRow() {
  return (
    <div className="grid grid-cols-3 gap-4">
      {STATS.map(({ value, label }) => (
        <div key={label} className="flex flex-col gap-0.5">
          <span className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
            {value}
          </span>
          <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{label}</span>
        </div>
      ))}
    </div>
  )
})
StatsRow.displayName = 'StatsRow'

// ---------------------------------------------------------------------------
// MarketingContent
// ---------------------------------------------------------------------------

const MarketingContent = memo(function MarketingContent() {
  return (
    <div className="relative z-10 flex max-w-sm flex-col gap-8">
      {/* Feature pills */}
      <div className="flex flex-wrap gap-2">
        <FeaturePill icon={<Sparkles className="h-3 w-3" />} label="AI-powered" />
        <FeaturePill icon={<Zap className="h-3 w-3" />} label="Real-time" />
        <FeaturePill icon={<ShieldCheck className="h-3 w-3" />} label="Bias-free" />
      </div>

      {/* Headline */}
      <div>
        <h1 className="mb-4 text-4xl leading-[1.1] font-extrabold tracking-tight text-zinc-900 lg:text-5xl dark:text-zinc-50">
          Recruitment,
          <br />
          <span className="bg-linear-to-r from-emerald-500 via-emerald-400 to-teal-400 bg-clip-text text-transparent">
            amplified by intelligence.
          </span>
        </h1>
        <p className="text-base leading-relaxed text-zinc-500 dark:text-zinc-400">
          Create precise engineering interviews in seconds. Let AI screen thousands of candidates so
          you can focus on building the team.
        </p>
      </div>

      {/* Emerald divider */}
      <div className="h-px bg-linear-to-r from-zinc-200 via-emerald-300/50 to-transparent dark:from-zinc-800 dark:via-emerald-700/30 dark:to-transparent" />

      {/* Stats */}
      <StatsRow />

      {/* Neutral divider */}
      <div className="h-px bg-linear-to-r from-zinc-200 to-transparent dark:from-zinc-800 dark:to-transparent" />

      {/* Social proof */}
      <SocialProof />
    </div>
  )
})
MarketingContent.displayName = 'MarketingContent'

// ---------------------------------------------------------------------------
// BrandingPanel
// ---------------------------------------------------------------------------

export const BrandingPanel = memo(function BrandingPanel() {
  return (
    <aside
      className="relative z-10 hidden h-full w-full max-w-125 shrink-0 flex-col items-start justify-center gap-14 py-12 text-zinc-900 lg:flex dark:text-zinc-50"
      aria-label="SmartHire AI branding"
    >
      <BrandLogo />
      <MarketingContent />
    </aside>
  )
})
BrandingPanel.displayName = 'BrandingPanel'
