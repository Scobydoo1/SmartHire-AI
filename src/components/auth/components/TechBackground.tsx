import { memo } from 'react'

export const TechBackground = memo(function TechBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
      {/* Base surface */}
      <div className="absolute inset-0 bg-zinc-50 dark:bg-zinc-950" />

      {/* Dot grid – subtle in light, more visible in dark */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#94a3b8_1px,transparent_1px)] bg-size-[28px_28px] opacity-30 dark:bg-[radial-gradient(circle_at_center,#10b981_1px,transparent_1px)] dark:opacity-[0.18]" />

      {/* Primary ambient blob – emerald, top-left */}
      <div className="absolute -top-40 -left-40 h-160 w-160 rounded-full bg-emerald-400/20 blur-[120px] dark:bg-emerald-500/25" />

      {/* Secondary ambient blob – indigo/violet, bottom-right */}
      <div className="absolute -right-40 -bottom-40 h-135 w-135 rounded-full bg-indigo-400/20 blur-[100px] dark:bg-violet-600/20" />

      {/* Tertiary accent blob – sky, centre-right */}
      <div className="absolute top-1/3 right-1/4 h-80 w-80 rounded-full bg-sky-300/15 blur-[80px] dark:bg-emerald-400/10" />

      {/* Dark-only deep glow – centre bottom */}
      <div className="absolute bottom-0 left-1/2 hidden h-60 w-120 -translate-x-1/2 rounded-full bg-emerald-600/15 blur-[90px] dark:block" />

      {/* Dark-only teal pulse – top-right area */}
      <div className="absolute top-20 right-0 hidden h-75 w-75 rounded-full bg-teal-500/10 blur-[70px] dark:block" />

      {/* Spinning ring – top-right */}
      <div className="absolute -top-24 -right-24 h-105 w-105 animate-[spin_90s_linear_infinite] rounded-full border border-emerald-300/50 dark:border-emerald-500/30" />

      {/* Dashed orbit ring – bottom-left */}
      <div className="absolute -bottom-48 -left-24 h-175 w-175 animate-[spin_150s_linear_infinite_reverse] rounded-full border border-dashed border-slate-200/60 dark:border-emerald-900/60" />

      {/* Vertical accent line */}
      <div className="absolute top-0 left-[38%] h-full w-px bg-linear-to-b from-transparent via-emerald-500/20 to-transparent dark:via-emerald-400/30" />

      {/* Horizontal accent line */}
      <div className="absolute top-[62%] left-0 h-px w-full bg-linear-to-r from-transparent via-indigo-400/20 to-transparent dark:via-emerald-500/20" />

      {/* Diamond markers */}
      <div className="absolute top-20 right-48 h-10 w-10 rotate-45 border-2 border-emerald-400/30 dark:border-emerald-400/40" />
      <div className="absolute bottom-32 left-40 h-5 w-5 rotate-45 border border-indigo-400/30 dark:border-emerald-500/30" />
      {/* Extra dark-mode diamond */}
      <div className="absolute top-1/2 right-16 hidden h-3 w-3 rotate-45 border border-teal-400/40 dark:block" />

      {/* Radial vignette for readability */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_50%,transparent_30%,rgba(248,250,252,0.55)_100%)] dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_50%,transparent_20%,rgba(9,9,11,0.85)_100%)]" />
    </div>
  )
})

TechBackground.displayName = 'TechBackground'
