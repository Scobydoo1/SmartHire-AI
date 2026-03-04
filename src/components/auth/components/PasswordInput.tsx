/**
 * Reusable Password Input Component with show/hide toggle
 * Optimized with React.memo for performance
 */

import React, { memo } from "react";
import { Input } from "@/components/ui/input";
import { Lock, Eye, EyeOff } from "lucide-react";
import { usePasswordToggle } from "../hooks";

interface PasswordInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type"
> {
  value: string;
  showIcon?: boolean;
  iconClassName?: string;
}

export const PasswordInput = memo<PasswordInputProps>(
  ({ value, showIcon = true, iconClassName = "", ...props }) => {
    const { showPassword, togglePassword } = usePasswordToggle();

    return (
      <div className="relative">
        {showIcon && (
          <Lock
            className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 dark:text-zinc-500 ${iconClassName}`}
          />
        )}
        <Input
          type={showPassword ? "text" : "password"}
          className={`${
            showIcon ? "pl-10" : ""
          } pr-10 bg-zinc-50 dark:bg-zinc-900 border-zinc-300 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus-visible:ring-emerald-500/50`}
          value={value}
          {...props}
        />
        <button
          type="button"
          onClick={togglePassword}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors flex items-center justify-center p-1"
          title={showPassword ? "Hide password" : "Show password"}
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? (
            <EyeOff className="w-4 h-4" />
          ) : (
            <Eye className="w-4 h-4" />
          )}
        </button>
      </div>
    );
  },
);

PasswordInput.displayName = "PasswordInput";
