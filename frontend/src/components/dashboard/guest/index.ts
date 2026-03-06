/**
 * Public API for the GuestDashboard feature module.
 *
 * Import the main page component:
 *   import { GuestDashboard } from '@/components/dashboard/guest'
 *
 * Import individual sub-components for composition or testing:
 *   import { GuestPageHeader, GuestFeatures } from '@/components/dashboard/guest'
 *
 * Import data / config for overrides:
 *   import { FEATURE_ITEMS } from '@/components/dashboard/guest'
 */

// Sub-components
export { GuestPageHeader } from './GuestPageHeader'
export { GuestHeroText } from './GuestHeroText'
export { GuestJoinForm } from './GuestJoinForm'
export { GuestFeatures } from './GuestFeatures'

// Static data & variants
export { FEATURE_ITEMS, fadeInUpVariants, fadeInVariants, featureCardVariants } from './config'

// TypeScript types
export type {
  FeatureItem,
  GuestJoinFormProps,
  GuestFeaturesProps,
  GuestDashboardProps,
} from './types'
