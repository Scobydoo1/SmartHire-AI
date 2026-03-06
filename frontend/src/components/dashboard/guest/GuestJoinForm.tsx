/**
 * GuestJoinForm
 *
 * Glassmorphic invite-code entry card rendered in the hero column.
 *
 * Performance notes:
 * - `handleChange` is memoised with `useCallback` so the `Input` never
 *   receives a new function reference on unrelated parent re-renders.
 * - `handleSubmit` is similarly memoised; it only changes when
 *   `inviteCode` or `onSubmit` changes.
 * - `useId()` generates a stable, SSR-safe id for the label↔input pair.
 */

import { memo, useCallback, useId, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { motion } from 'motion/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { GuestJoinFormProps } from './types'

export const GuestJoinForm = memo(function GuestJoinForm({ onSubmit }: GuestJoinFormProps) {
  const [inviteCode, setInviteCode] = useState('')
  const inputId = useId()

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInviteCode(e.target.value)
  }, [])

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      const trimmed = inviteCode.trim()
      if (trimmed) onSubmit(trimmed)
    },
    [inviteCode, onSubmit],
  )

  const isSubmitDisabled = !inviteCode.trim()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="w-full max-w-md"
    >
      <div className="group relative flex flex-col overflow-hidden rounded-3xl border border-zinc-200/80 bg-white/80 p-8 shadow-2xl shadow-zinc-200/50 backdrop-blur-xl dark:border-zinc-700/50 dark:bg-zinc-900/80 dark:shadow-emerald-900/10">
        {/* Subtle glass reflection line */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/50 to-transparent dark:via-white/10"
        />

        {/* Card header */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">Join Session</h2>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Enter your organisation's authorisation code to begin.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="relative z-10 flex flex-col gap-5"
          noValidate
          aria-label="Join interview session"
        >
          {/* Code input */}
          <div className="space-y-2">
            <label
              htmlFor={inputId}
              className="ml-1 text-xs font-semibold tracking-wider text-zinc-700 uppercase dark:text-zinc-300"
            >
              Authorisation Code
            </label>
            <Input
              id={inputId}
              autoComplete="off"
              autoFocus
              placeholder="e.g. INT-1234-ABCD"
              className="h-14 rounded-xl border-zinc-300 bg-white text-center text-lg tracking-widest text-zinc-900 uppercase shadow-sm transition-all placeholder:text-zinc-400 focus-visible:border-emerald-500 focus-visible:ring-emerald-500/40 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder:text-zinc-600"
              value={inviteCode}
              onChange={handleChange}
            />
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={isSubmitDisabled}
            aria-disabled={isSubmitDisabled}
            className="group h-14 w-full cursor-pointer rounded-xl bg-emerald-500 text-base font-bold text-zinc-950 shadow-[0_0_20px_rgba(16,185,129,0.2)] transition-all hover:bg-emerald-400 hover:shadow-[0_0_25px_rgba(16,185,129,0.4)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Initialize Environment
            <ArrowRight
              className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1"
              aria-hidden="true"
            />
          </Button>
        </form>
      </div>
    </motion.div>
  )
})
