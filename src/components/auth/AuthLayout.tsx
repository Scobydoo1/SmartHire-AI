/**
 * AuthLayout
 *
 * Shell layout for all authentication pages (Login, Register, …).
 *
 * Structure:
 *   <BrandingPanel />   – always-dark marketing column (hidden on mobile)
 *   <main>              – form panel; theme-aware (light / dark)
 *     <ThemeToggle />   – top-right corner
 *     {children}        – page-specific form content
 *   </main>
 */

import { memo } from "react";
import { BrandingPanel } from "./components/BrandingPanel";
import { TechBackground } from "./components/TechBackground";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import type { AuthLayoutProps } from "./types";

export const AuthLayout = memo<AuthLayoutProps>(function AuthLayout({
  children,
}) {
  return (
    <div className="relative flex min-h-screen w-full font-sans overflow-hidden">
      {/* Full-bleed background */}
      <TechBackground />

      {/* Page content */}
      <div className="relative z-10 flex flex-1 w-full max-w-350 mx-auto px-6 sm:px-10 lg:px-16 py-10 gap-8 lg:gap-20 items-center justify-center lg:justify-between">
        {/* Left: branding column */}
        <BrandingPanel />

        {/* Right: glassmorphic form card */}
        <main
          className="relative flex flex-col items-center justify-center w-full max-w-105 shrink-0 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-zinc-200/80 dark:border-zinc-700/50 rounded-3xl shadow-xl shadow-zinc-200/60 dark:shadow-zinc-950/80 px-8 py-10 sm:px-10"
          role="main"
        >
          {/* Theme toggle – top-right of card */}
          <div className="absolute top-4 right-4">
            <ThemeToggle variant="dropdown" />
          </div>

          <div className="w-full flex flex-col items-stretch">{children}</div>
        </main>
      </div>
    </div>
  );
});

AuthLayout.displayName = "AuthLayout";
