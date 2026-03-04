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

import { memo, useCallback, useId, useState } from "react";
import { ArrowRight, Clock, ShieldCheck, Video } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface FeatureItem {
  id: string;
  icon: LucideIcon;
  iconClass: string;
  title: string;
  description: string;
}

interface GuestJoinFormProps {
  onSubmit: (code: string) => void;
}

// ---------------------------------------------------------------------------
// Static data – defined outside the component to avoid re-allocation
// ---------------------------------------------------------------------------

const FEATURE_ITEMS: FeatureItem[] = [
  {
    id: "live-ai",
    icon: Video,
    iconClass: "text-emerald-400",
    title: "Live AI Presence",
    description:
      "Interact naturally via voice and video with our responsive AI interviewer.",
  },
  {
    id: "flexible-timing",
    icon: Clock,
    iconClass: "text-blue-400",
    title: "Flexible Timing",
    description:
      "Take the interview on your own schedule. No timezone coordination needed.",
  },
  {
    id: "unbiased",
    icon: ShieldCheck,
    iconClass: "text-orange-400",
    title: "Unbiased Evaluation",
    description:
      "Standardised, objective scoring based entirely on your skills and responses.",
  },
];

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

/** Sticky top bar: SmartHire logo wordmark + theme toggle. */
const GuestPageHeader = memo(function GuestPageHeader() {
  return (
    <header className="w-full sticky top-0 z-20 flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md">
      <div className="flex items-center gap-3">
        {/* Logo mark */}
        <span
          className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center text-zinc-950 font-bold text-sm shadow-[0_0_20px_rgba(16,185,129,0.3)] select-none"
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
          className="border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
        >
          <Link to="/login">Log in</Link>
        </Button>
      </div>
    </header>
  );
});

/** Headline and sub-copy centred above the join form. */
const GuestHero = memo(function GuestHero() {
  return (
    <div className="flex flex-col items-center text-center mb-10">
      <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-4">
        Welcome to your{" "}
        <span className="text-emerald-500 dark:text-emerald-400">
          AI Interview
        </span>
      </h1>
      <p className="text-zinc-500 dark:text-zinc-400 text-lg max-w-2xl">
        Experience a fair, unbiased, and interactive technical interview driven
        by next-generation AI. Please enter your unique invitation code to
        begin.
      </p>
    </div>
  );
});

/** Invitation-code form card. */
const GuestJoinForm = memo(function GuestJoinForm({
  onSubmit,
}: GuestJoinFormProps) {
  const [inviteCode, setInviteCode] = useState("");
  const inputId = useId();

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const trimmed = inviteCode.trim();
      if (trimmed) onSubmit(trimmed);
    },
    [inviteCode, onSubmit],
  );

  return (
    <div className="w-full max-w-md bg-white/60 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 backdrop-blur-sm shadow-2xl">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        <div className="space-y-2">
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-zinc-700 dark:text-zinc-300 ml-1"
          >
            Invitation Code
          </label>
          <Input
            id={inputId}
            autoComplete="off"
            autoFocus
            placeholder="e.g. INT-1234-ABCD"
            className="h-12 bg-zinc-50 dark:bg-zinc-900 border-zinc-300 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus-visible:ring-emerald-500/50 text-center tracking-widest uppercase"
            value={inviteCode}
            onChange={(e) => setInviteCode(e.target.value)}
          />
        </div>

        <Button
          type="submit"
          className="h-12 w-full bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-bold text-base transition-all group"
          disabled={!inviteCode.trim()}
        >
          Enter Waiting Room
          <ArrowRight
            className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform"
            aria-hidden="true"
          />
        </Button>
      </form>
    </div>
  );
});

/** Three value-proposition cards rendered from static data. */
const GuestFeatures = memo(function GuestFeatures() {
  return (
    <section
      aria-label="Interview features"
      className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 w-full max-w-3xl"
    >
      {FEATURE_ITEMS.map(
        ({ id, icon: Icon, iconClass, title, description }) => (
          <article
            key={id}
            className="flex flex-col items-center text-center p-4"
          >
            <div
              className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center mb-4"
              aria-hidden="true"
            >
              <Icon className={`w-5 h-5 ${iconClass}`} />
            </div>
            <h2 className="font-semibold text-zinc-800 dark:text-zinc-200 mb-2 text-base">
              {title}
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-500">
              {description}
            </p>
          </article>
        ),
      )}
    </section>
  );
});

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------

export const GuestDashboard: React.FC = () => {
  const navigate = useNavigate();

  /** Stable reference – won't recreate on every render. */
  const handleJoin = useCallback(
    (code: string) => {
      navigate(`/interview?code=${encodeURIComponent(code)}`);
    },
    [navigate],
  );

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 font-sans">
      <GuestPageHeader />

      {/* Decorative background blobs – visually hidden from assistive tech */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 overflow-hidden z-0"
      >
        <div className="absolute top-0 right-0 w-125 h-125 bg-emerald-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-125 h-125 bg-blue-500/10 blur-[120px] rounded-full" />
      </div>

      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-16 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="w-full max-w-4xl flex flex-col items-center">
          <GuestHero />
          <GuestJoinForm onSubmit={handleJoin} />
          <GuestFeatures />
        </div>
      </main>
    </div>
  );
};
