/**
 * Reusable Password Input Component with show/hide toggle
 * Optimized with React.memo for performance
 */

import React, { memo } from 'react'
import { Input } from '@/components/ui/input'
import { Lock, Eye, EyeOff } from 'lucide-react'
import { usePasswordToggle } from '../hooks'

interface PasswordInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  value: string
  showIcon?: boolean
  iconClassName?: string
}

export const PasswordInput = memo<PasswordInputProps>(
  ({ value, showIcon = true, iconClassName = '', ...props }) => {
    const { showPassword, togglePassword } = usePasswordToggle()

    return (
      <div className="relative">
        {showIcon && (
          <Lock
            className={`absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-zinc-400 dark:text-zinc-500 ${iconClassName}`}
          />
        )}
        <Input
          type={showPassword ? 'text' : 'password'}
          className={`${
            showIcon ? 'pl-10' : ''
          } border-zinc-300 bg-zinc-50 pr-10 text-zinc-900 placeholder:text-zinc-400 focus-visible:ring-emerald-500/50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-600`}
          value={value}
          {...props}
        />
        <button
          type="button"
          onClick={togglePassword}
          className="absolute top-1/2 right-3 flex -translate-y-1/2 items-center justify-center p-1 text-zinc-400 transition-colors hover:text-zinc-700 dark:text-zinc-500 dark:hover:text-zinc-300"
          title={showPassword ? 'Hide password' : 'Show password'}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    )
  },
)

PasswordInput.displayName = 'PasswordInput'
