/**
 * BrandingPanel
 *
 * Left-hand marketing column shown on auth pages (Login, Register, …).
 * Follows the active theme – light or dark – via Tailwind dark: variants.
 *
 * Sub-component tree:
 *   <BrandingPanel>
 *     <GlowEffects />        – decorative ambient blobs (aria-hidden)
 *     <BrandLogo />          – logo mark + wordmark, links to "/"
 *     <MarketingContent>
 *       <SocialProof />      – avatar stack + member count
 *     </MarketingContent>
 *   </BrandingPanel>
 */

import { memo } from "react";
import { Link } from "react-router-dom";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Avatar seeds used to generate deterministic dicebear portraits. */
const AVATAR_SEEDS = [123, 246, 369, 492] as const;

// ---------------------------------------------------------------------------
// GlowEffects
// ---------------------------------------------------------------------------

/** Decorative ambient colour blobs. Purely visual – hidden from a11y tree. */
const GlowEffects = memo(function GlowEffects() {
  return (
    <div aria-hidden="true" className="pointer-events-none">
      <div className="absolute top-0 right-0 w-100 h-100 bg-emerald-500/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-0 left-0 w-100 h-100 bg-blue-500/10 blur-[120px] rounded-full" />
    </div>
  );
});
GlowEffects.displayName = "GlowEffects";

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
    <div className="flex gap-4 items-center">
      {/* Avatar stack */}
      <div className="flex -space-x-4" aria-hidden="true">
        {AVATAR_SEEDS.map((seed) => (
          <div
            key={seed}
            className="w-10 h-10 rounded-full border-2 border-zinc-200 dark:border-zinc-950 bg-zinc-300 dark:bg-zinc-800 flex items-center justify-center overflow-hidden"
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

      <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
        Join{" "}
        <strong className="font-bold text-zinc-800 dark:text-zinc-200">
          10,000+
        </strong>{" "}
        elite engineering teams.
      </p>
    </div>
  );
});
SocialProof.displayName = "SocialProof";

// ---------------------------------------------------------------------------
// MarketingContent
// ---------------------------------------------------------------------------

/** Hero headline, sub-copy and social-proof block. */
const MarketingContent = memo(function MarketingContent() {
  return (
    <div className="relative z-10 max-w-md mt-auto mb-auto">
      <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-6 leading-tight text-zinc-900 dark:text-zinc-50">
        Recruitment, <br />
        <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-400 to-emerald-600">
          amplified by intelligence.
        </span>
      </h1>

      <p className="text-zinc-500 dark:text-zinc-400 text-lg leading-relaxed mb-8">
        Create precise engineering interviews in seconds. Analyse thousands of
        candidates autonomously. Let AI handle the screening, so you can focus
        on building the team.
      </p>

      <SocialProof />
    </div>
  );
});
MarketingContent.displayName = "MarketingContent";

// ---------------------------------------------------------------------------
// BrandingPanel  (public export)
// ---------------------------------------------------------------------------

/**
 * Full left-panel branding column for auth pages.
 *
 * @example
 * ```tsx
 * <BrandingPanel />
 * ```
 */
export const BrandingPanel = memo(function BrandingPanel() {
  return (
    <aside
      className="hidden md:flex flex-col relative w-1/2 p-12 border-r border-zinc-200 dark:border-zinc-900 justify-between items-start bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 overflow-hidden"
      aria-label="SmartHire AI branding"
    >
      <GlowEffects />
      <BrandLogo />
      <MarketingContent />
    </aside>
  );
});
BrandingPanel.displayName = "BrandingPanel";
