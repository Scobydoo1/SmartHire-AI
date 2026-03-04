/**
 * Optimized AuthLayout Component
 * - Memoized to prevent unnecessary re-renders
 * - Split into smaller sub-components for better performance
 * - Uses semantic HTML for accessibility
 */

import React, { memo } from "react";
import type { AuthLayoutProps } from "./types";

// Memoized glow effects component
const GlowEffects = memo(() => (
  <>
    <div className="absolute top-0 right-0 w-100 h-100 bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />
    <div className="absolute bottom-0 left-0 w-100 h-100 bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />
  </>
));
GlowEffects.displayName = "GlowEffects";

// Memoized logo component
const Logo = memo(() => (
  <div className="relative z-10 flex items-center gap-3">
    <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-zinc-950 font-bold text-sm">
      SH
    </div>
    <span className="font-bold text-2xl tracking-tight text-zinc-100">
      SmartHire AI
    </span>
  </div>
));
Logo.displayName = "Logo";

// Memoized user avatars component
const SocialProof = memo(() => (
  <div className="flex gap-4 items-center">
    <div className="flex -space-x-4">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="w-10 h-10 rounded-full border-2 border-zinc-950 bg-zinc-800 flex items-center justify-center text-xs text-zinc-500 overflow-hidden"
        >
          <img
            src={`https://api.dicebear.com/7.x/notionists/svg?seed=${i * 123}&backgroundColor=18181b`}
            alt={`User avatar ${i}`}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      ))}
    </div>
    <div className="text-sm font-medium text-zinc-400">
      Join <span className="text-zinc-200">10,000+</span> elite engineering
      teams.
    </div>
  </div>
));
SocialProof.displayName = "SocialProof";

// Memoized marketing content component
const MarketingContent = memo(() => (
  <div className="relative z-10 max-w-md mt-auto mb-auto">
    <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-6 leading-tight">
      Recruitment, <br />
      <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-400 to-emerald-600">
        amplified by intelligence.
      </span>
    </h1>
    <p className="text-zinc-400 text-lg leading-relaxed mb-8">
      Create precise engineering interviews in seconds. Analyze thousands of
      candidates autonomously. Let AI handle the screening, so you can focus on
      building the team.
    </p>
    <SocialProof />
  </div>
));
MarketingContent.displayName = "MarketingContent";

// Memoized branding panel component
const BrandingPanel = memo(() => (
  <aside
    className="hidden md:flex flex-col relative w-1/2 p-12 border-r border-zinc-900 justify-between items-start"
    aria-label="Branding and information"
  >
    <GlowEffects />
    <Logo />
    <MarketingContent />
  </aside>
));
BrandingPanel.displayName = "BrandingPanel";

// Main layout component
export const AuthLayout = memo<AuthLayoutProps>(({ children }) => {
  return (
    <div className="flex min-h-screen w-full bg-zinc-950 font-sans text-zinc-50 overflow-hidden">
      <BrandingPanel />

      {/* Form content panel */}
      <main
        className="flex flex-col flex-1 items-center justify-center p-8 relative"
        role="main"
      >
        <div className="w-full max-w-105 flex flex-col items-stretch z-10">
          {children}
        </div>
      </main>
    </div>
  );
});

AuthLayout.displayName = "AuthLayout";
