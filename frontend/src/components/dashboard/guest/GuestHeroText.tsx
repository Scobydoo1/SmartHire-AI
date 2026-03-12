/**
 * GuestHeroText
 *
 * Left (or centred on mobile) hero copy block on the guest landing page.
 *
 * Headline animation (HackQuest-style):
 *  1. Each word in "The Future Of" is wrapped in an overflow-hidden mask and
 *     slides up into view sequentially (word-reveal stagger).
 *  2. "Tech Interviews" uses an animated sweeping gradient shimmer that loops
 *     indefinitely, giving a live / glowing feel.
 *
 * Animation variants for badge + sub-copy are imported from `config.ts`.
 */

import { memo } from 'react'
import { motion } from 'motion/react'
import { fadeInVariants } from './config'

/** Words that reveal one-by-one via the slide-up mask technique. */
const HEADLINE_WORDS = ['The', 'Future', 'Of']

/** Stagger delay per word (seconds). */
const WORD_STAGGER = 0.08
/** Base delay before the headline starts (after the badge appears). */
const HEADLINE_DELAY = 0.35

export const GuestHeroText = memo(function GuestHeroText() {
  return (
    <div className="flex w-full max-w-2xl flex-col text-center lg:text-left">
      {/* ── "Systems Online" badge ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="mx-auto mb-6 inline-flex w-max items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-sm font-medium text-emerald-600 lg:mx-0 dark:text-emerald-400"
      >
        <span className="relative flex h-2 w-2" aria-hidden="true">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
        </span>
        Systems Online
      </motion.div>

      {/* ── Headline ── */}
      <h1 className="mb-6 text-5xl leading-[1.1] font-bold tracking-tighter lg:text-7xl">
        {/*
          Word-mask reveal:
          Each word sits inside an `overflow-hidden` span so the sliding
          motion.span is clipped — producing the "word rising into view" look.
        */}
        <span className="inline-flex flex-wrap justify-center gap-x-4 text-zinc-900 lg:justify-start dark:text-zinc-50">
          {HEADLINE_WORDS.map((word, i) => (
            <span key={word} className="inline-block overflow-hidden pb-1 leading-none">
              <motion.span
                className="inline-block"
                initial={{ y: '110%', opacity: 0 }}
                animate={{ y: '0%', opacity: 1 }}
                transition={{
                  delay: HEADLINE_DELAY + i * WORD_STAGGER,
                  duration: 0.55,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                {word}
              </motion.span>
            </span>
          ))}
        </span>

        <br />

        {/*
          Animated shimmer gradient for "Tech Interviews".
          The gradient is wider than the element and translated via a CSS
          @keyframes so it sweeps left-to-right in a loop.
        */}
        <span className="inline-block overflow-hidden pb-1 leading-none">
          <motion.span
            className="animate-gradient-x inline-block bg-linear-to-r from-emerald-400 via-teal-300 to-emerald-500 bg-size-[200%_auto] bg-clip-text text-transparent"
            initial={{ y: '110%', opacity: 0 }}
            animate={{ y: '0%', opacity: 1 }}
            transition={{
              delay: HEADLINE_DELAY + HEADLINE_WORDS.length * WORD_STAGGER,
              duration: 0.65,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            Tech Interviews
          </motion.span>
        </span>
      </h1>

      {/* ── Sub-copy ── */}
      <motion.p
        variants={fadeInVariants}
        initial="hidden"
        animate="visible"
        custom={HEADLINE_DELAY + (HEADLINE_WORDS.length + 1) * WORD_STAGGER + 0.2}
        className="mx-auto mb-8 max-w-xl text-lg leading-relaxed text-zinc-600 lg:mx-0 dark:text-zinc-400"
      >
        Experience a fair, unbiased, and interactive technical evaluation driven by next-generation
        AI. Zero bias. Maximum signal.
      </motion.p>
    </div>
  )
})
