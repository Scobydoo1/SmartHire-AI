/**
 * GuestFeatures
 *
 * Three-column feature grid shown below the hero.
 *
 * Accepts an optional `items` prop so the list can be overridden or
 * extended without modifying this component — useful for A/B testing
 * or white-labelling.
 *
 * Animation variants are defined in `config.ts` (outside the component)
 * so motion objects are stable across renders.
 */

import { memo } from 'react'
import { motion } from 'motion/react'
import { FEATURE_ITEMS, featureCardVariants } from './config'
import type { GuestFeaturesProps } from './types'

export const GuestFeatures = memo(function GuestFeatures({
  items = FEATURE_ITEMS,
}: GuestFeaturesProps) {
  return (
    <section
      aria-label="Platform features overview"
      className="relative z-10 mt-20 w-full border-t border-zinc-200/50 pt-16 lg:mt-32 dark:border-zinc-800/80"
    >
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-8 md:grid-cols-3">
        {items.map(({ id, icon: Icon, title, description }, index) => (
          <motion.article
            key={id}
            variants={featureCardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={index}
            className="group flex flex-col items-center rounded-3xl p-6 text-center transition-colors duration-300 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/30"
          >
            {/* Icon container */}
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-zinc-200/80 bg-white text-emerald-500 shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:text-emerald-400 group-hover:shadow-[0_0_20px_rgba(16,185,129,0.15)] dark:border-zinc-800 dark:bg-zinc-900">
              <Icon className="h-6 w-6" aria-hidden="true" />
            </div>

            <h3 className="mb-3 text-lg font-bold text-zinc-900 dark:text-zinc-50">{title}</h3>
            <p className="text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
              {description}
            </p>
          </motion.article>
        ))}
      </div>
    </section>
  )
})
