/**
 * GuestDashboard – static data and shared animation variants.
 *
 * Defining motion variants and static arrays **outside** any component avoids
 * re-creating identical objects on every render, giving a small but real
 * performance win and making the values trivially unit-testable.
 */

import { Clock, ShieldCheck, Video } from 'lucide-react'
import type { FeatureItem } from './types'

// ---------------------------------------------------------------------------
// Static data
// ---------------------------------------------------------------------------

export const FEATURE_ITEMS: FeatureItem[] = [
  {
    id: 'live-ai',
    icon: Video,
    title: 'Live AI Presence',
    description:
      'Interact naturally via voice and video with our responsive AI interviewer.',
  },
  {
    id: 'flexible-timing',
    icon: Clock,
    title: 'Flexible Timing',
    description:
      'Take the interview on your own schedule. No timezone coordination needed.',
  },
  {
    id: 'unbiased',
    icon: ShieldCheck,
    title: 'Unbiased Evaluation',
    description:
      'Standardized, objective scoring based entirely on your skills and responses.',
  },
]

// ---------------------------------------------------------------------------
// Framer Motion / motion-react variants
//
// Using the `custom` prop + variant functions lets a single variant object
// encode the stagger delay without needing inline `transition` objects
// scattered across every JSX element.
// ---------------------------------------------------------------------------

/** Fade in while sliding up. Pass a numeric delay (seconds) via `custom`. */
export const fadeInUpVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay },
  }),
}

/** Simple fade-in only. Pass a numeric delay (seconds) via `custom`. */
export const fadeInVariants = {
  hidden: { opacity: 0 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    transition: { duration: 0.5, delay },
  }),
}

/** Feature card entrance — whileInView stagger. Pass index as `custom`. */
export const featureCardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (index: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: index * 0.15 },
  }),
}
