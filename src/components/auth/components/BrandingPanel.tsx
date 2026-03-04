/**
 * BrandingPanel
 *
 * Left-hand marketing column shown on auth pages (Login, Register, …).
 * Follows the active theme – light or dark – via Tailwind dark: variants.
 */

import { memo, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { Sparkles, Zap, ShieldCheck } from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Avatar seeds used to generate deterministic dicebear portraits. */
const AVATAR_SEEDS = [123, 246, 369, 492] as const;

// ---------------------------------------------------------------------------
// FeaturePill
// ---------------------------------------------------------------------------

interface FeaturePillProps {
  icon: ReactNode;
  label: string;
}

const FeaturePill = memo(function FeaturePill({
  icon,
  label,
}: FeaturePillProps) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/50">
      {icon}
      {label}
    </span>
  );
});
FeaturePill.displayName = "FeaturePill";

// ---------------------------------------------------------------------------
// BrandLogo
// ---------------------------------------------------------------------------

/** Logo mark + wordmark. Navigates to "/" on click. */
const BrandLogo = memo(function BrandLogo() {
  return (
    <Link
      to="/"
      className="relative z-10 flex items-center gap-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded"
      aria-label="SmartHire AI – go to home"
    >
      <span
        className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-zinc-950 font-bold text-sm select-none"
        aria-hidden="true"
      >
        SH
      </span>
      <span className="font-bold text-2xl tracking-tight text-zinc-800 dark:text-zinc-100 group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors">
        SmartHire AI
      </span>
    </Link>
  );
});
BrandLogo.displayName = "BrandLogo";

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
            className="w-9 h-9 rounded-full border-2 border-white dark:border-zinc-900 bg-zinc-200 dark:bg-zinc-800 overflow-hidden ring-1 ring-zinc-200/50 dark:ring-zinc-700/50"
          >
            <img
              src={`https://api.dicebear.com/7.x/notionists/svg?seed=${seed}&backgroundColor=18181b`}
              alt=""
              className="w-full h-full object-cover"
              loading="lazy"
              decoding="async"
            />
          </div>
        ))}
      </div>
      <div>
        <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
          10,000+ teams
        </p>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          already hiring smarter
        </p>
      </div>
    </div>
  );
});
SocialProof.displayName = "SocialProof";

// ---------------------------------------------------------------------------
// StatsRow
// ---------------------------------------------------------------------------

const STATS = [
  { value: "4×", label: "Faster hiring" },
  { value: "98%", label: "Accuracy" },
  { value: "60%", label: "Cost reduction" },
] as const;

const StatsRow = memo(function StatsRow() {
  return (
    <div className="grid grid-cols-3 gap-4">
      {STATS.map(({ value, label }) => (
        <div key={label} className="flex flex-col gap-0.5">
          <span className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">
            {value}
          </span>
          <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
            {label}
          </span>
        </div>
      ))}
    </div>
  );
});
StatsRow.displayName = "StatsRow";

// ---------------------------------------------------------------------------
// MarketingContent
// ---------------------------------------------------------------------------

const MarketingContent = memo(function MarketingContent() {
  return (
    <div className="relative z-10 flex flex-col gap-8 max-w-sm">
      {/* Feature pills */}
      <div className="flex flex-wrap gap-2">
        <FeaturePill
          icon={<Sparkles className="w-3 h-3" />}
          label="AI-powered"
        />
        <FeaturePill icon={<Zap className="w-3 h-3" />} label="Real-time" />
        <FeaturePill
          icon={<ShieldCheck className="w-3 h-3" />}
          label="Bias-free"
        />
      </div>

      {/* Headline */}
      <div>
        <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.1] text-zinc-900 dark:text-zinc-50 mb-4">
          Recruitment,
          <br />
          <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-500 via-emerald-400 to-teal-400">
            amplified by intelligence.
          </span>
        </h1>
        <p className="text-base text-zinc-500 dark:text-zinc-400 leading-relaxed">
          Create precise engineering interviews in seconds. Let AI screen
          thousands of candidates so you can focus on building the team.
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
  );
});
MarketingContent.displayName = "MarketingContent";

// ---------------------------------------------------------------------------
// BrandingPanel
// ---------------------------------------------------------------------------

export const BrandingPanel = memo(function BrandingPanel() {
  return (
    <aside
      className="hidden lg:flex flex-col w-full max-w-125 h-full py-12 justify-center gap-14 items-start text-zinc-900 dark:text-zinc-50 shrink-0 relative z-10"
      aria-label="SmartHire AI branding"
    >
      <BrandLogo />
      <MarketingContent />
    </aside>
  );
});
BrandingPanel.displayName = "BrandingPanel";
