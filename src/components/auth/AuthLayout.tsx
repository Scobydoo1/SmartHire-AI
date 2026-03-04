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
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { BrandingPanel } from "./components/BrandingPanel";
import type { AuthLayoutProps } from "./types";

// Main layout component
export const AuthLayout = memo<AuthLayoutProps>(function AuthLayout({
  children,
}) {
  return (
    <div className="flex min-h-screen w-full bg-white dark:bg-zinc-950 font-sans text-zinc-900 dark:text-zinc-50 overflow-hidden">
      {/* Left: always-dark marketing / branding column */}
      <BrandingPanel />

      {/* Right: form column – follows active theme */}
      <main
        className="flex flex-col flex-1 items-center justify-center p-8 relative bg-white dark:bg-zinc-950"
        role="main"
      >
        {/* Theme toggle – top-right corner */}
        <div className="absolute top-4 right-4 z-20">
          <ThemeToggle variant="dropdown" />
        </div>

        <div className="w-full max-w-105 flex flex-col items-stretch z-10">
          {children}
        </div>
      </main>
    </div>
  );
});

AuthLayout.displayName = "AuthLayout";
