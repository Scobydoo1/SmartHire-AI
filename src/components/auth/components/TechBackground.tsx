import { memo } from "react";

export const TechBackground = memo(function TechBackground() {
  return (
    <div
      className="absolute inset-0 z-0 overflow-hidden pointer-events-none"
      aria-hidden="true"
    >
      {/* Base surface */}
      <div className="absolute inset-0 bg-zinc-50 dark:bg-zinc-950" />

      {/* Dot grid – subtle in light, more visible in dark */}
      <div className="absolute inset-0 opacity-30 dark:opacity-[0.18] bg-[radial-gradient(circle_at_center,#94a3b8_1px,transparent_1px)] dark:bg-[radial-gradient(circle_at_center,#10b981_1px,transparent_1px)] bg-size-[28px_28px]" />

      {/* Primary ambient blob – emerald, top-left */}
      <div className="absolute -top-40 -left-40 w-160 h-160 rounded-full bg-emerald-400/20 dark:bg-emerald-500/25 blur-[120px]" />

      {/* Secondary ambient blob – indigo/violet, bottom-right */}
      <div className="absolute -bottom-40 -right-40 w-135 h-135 rounded-full bg-indigo-400/20 dark:bg-violet-600/20 blur-[100px]" />

      {/* Tertiary accent blob – sky, centre-right */}
      <div className="absolute top-1/3 right-1/4 w-80 h-80 rounded-full bg-sky-300/15 dark:bg-emerald-400/10 blur-[80px]" />

      {/* Dark-only deep glow – centre bottom */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-120 h-60 hidden dark:block rounded-full bg-emerald-600/15 blur-[90px]" />

      {/* Dark-only teal pulse – top-right area */}
      <div className="absolute top-20 right-0 w-75 h-75 hidden dark:block rounded-full bg-teal-500/10 blur-[70px]" />

      {/* Spinning ring – top-right */}
      <div className="absolute -top-24 -right-24 w-105 h-105 rounded-full border border-emerald-300/50 dark:border-emerald-500/30 animate-[spin_90s_linear_infinite]" />

      {/* Dashed orbit ring – bottom-left */}
      <div className="absolute -bottom-48 -left-24 w-175 h-175 rounded-full border border-dashed border-slate-200/60 dark:border-emerald-900/60 animate-[spin_150s_linear_infinite_reverse]" />

      {/* Vertical accent line */}
      <div className="absolute top-0 left-[38%] w-px h-full bg-linear-to-b from-transparent via-emerald-500/20 dark:via-emerald-400/30 to-transparent" />

      {/* Horizontal accent line */}
      <div className="absolute top-[62%] left-0 w-full h-px bg-linear-to-r from-transparent via-indigo-400/20 dark:via-emerald-500/20 to-transparent" />

      {/* Diamond markers */}
      <div className="absolute top-20 right-48 w-10 h-10 border-2 border-emerald-400/30 dark:border-emerald-400/40 rotate-45" />
      <div className="absolute bottom-32 left-40 w-5 h-5 border border-indigo-400/30 dark:border-emerald-500/30 rotate-45" />
      {/* Extra dark-mode diamond */}
      <div className="absolute top-1/2 right-16 w-3 h-3 hidden dark:block border border-teal-400/40 rotate-45" />

      {/* Radial vignette for readability */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_50%,transparent_30%,rgba(248,250,252,0.55)_100%)] dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_50%,transparent_20%,rgba(9,9,11,0.85)_100%)]" />
    </div>
  );
});

TechBackground.displayName = "TechBackground";
