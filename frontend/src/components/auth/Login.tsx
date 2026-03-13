/**
 * Optimized Login Component
 * - Uses custom hooks for auth logic separation
 * - Implements reusable components
 * - Memoized callbacks and values for performance
 * - Better accessibility with ARIA attributes
 */

import { memo, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { AuthLayout } from './AuthLayout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Mail, Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

// Import custom hooks and components
import { useAuthLogin, useSocialAuth } from './hooks'
import { PasswordInput, SocialLoginButton, FormDivider, MobileLogo } from './components'
import type { LoginFormData } from './types'

const formSchema = z.object({
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
  password: z.string().min(1, {
    message: 'Password is required.',
  }),
})

// Memoized header component
const LoginHeader = memo(() => (
  <div role="heading" aria-level={1} className="mb-8 flex flex-col gap-2 text-center md:text-left">
    <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
      Welcome back
    </h2>
    <p className="text-sm text-zinc-500 dark:text-zinc-400">
      Enter your credentials to access your workspace.
    </p>
  </div>
))
LoginHeader.displayName = 'LoginHeader'

// Memoized footer component
const LoginFooter = memo(() => (
  <div className="mt-6 text-center text-sm text-zinc-500">
    Don't have an account?{' '}
    <Link
      to="/register"
      className="font-medium text-emerald-500 transition-colors hover:text-emerald-400"
    >
      Request early access
    </Link>
  </div>
))
LoginFooter.displayName = 'LoginFooter'

export const Login = memo(() => {
  // Custom hooks for auth logic
  const { isSubmitting, onSubmit } = useAuthLogin()
  const { signInWithProvider } = useSocialAuth()

  // Form setup
  const form = useForm<LoginFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  // Memoized handlers
  const handleFormSubmit = useCallback(
    (values: LoginFormData) => {
      onSubmit(values)
    },
    [onSubmit],
  )

  const handleGoogleLogin = useCallback(() => {
    signInWithProvider('Google')
  }, [signInWithProvider])

  return (
    <AuthLayout>
      <MobileLogo />
      <LoginHeader />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleFormSubmit)}
          className="animate-in fade-in slide-in-from-bottom-4 flex flex-col gap-5 duration-500"
          noValidate
        >
          {/* Email Input */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel htmlFor="email" className="ml-1 text-zinc-700 dark:text-zinc-300">
                  Work Email
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Mail
                      className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-zinc-400 dark:text-zinc-500"
                      aria-hidden="true"
                    />
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@company.com"
                      autoComplete="email"
                      className="border-zinc-300 bg-zinc-50 pl-10 text-zinc-900 placeholder:text-zinc-400 focus-visible:ring-emerald-500/50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-600"
                      aria-invalid={!!form.formState.errors.email}
                      aria-describedby={form.formState.errors.email ? 'email-error' : undefined}
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage id="email-error" className="ml-1 text-red-400" />
              </FormItem>
            )}
          />

          {/* Password Input */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <div className="ml-1 flex items-center justify-between">
                  <FormLabel htmlFor="password" className="text-zinc-700 dark:text-zinc-300">
                    Password
                  </FormLabel>
                  <Link
                    to="/forgot-password"
                    className="text-xs text-emerald-600 transition-colors hover:text-emerald-500 dark:text-emerald-500 dark:hover:text-emerald-400"
                    aria-label="Forgot password?"
                  >
                    Forgot password?
                  </Link>
                </div>
                <FormControl>
                  <PasswordInput
                    id="password"
                    placeholder="••••••••"
                    autoComplete="current-password"
                    aria-invalid={!!form.formState.errors.password}
                    aria-describedby={form.formState.errors.password ? 'password-error' : undefined}
                    {...field}
                  />
                </FormControl>
                <FormMessage id="password-error" className="ml-1 text-red-400" />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 h-11 w-full bg-emerald-500 font-bold text-zinc-950 hover:bg-emerald-600"
            aria-busy={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" aria-hidden="true" />
                <span className="sr-only">Signing in...</span>
              </>
            ) : (
              'Sign In'
            )}
          </Button>

          <FormDivider />

          <SocialLoginButton provider="Google" onClick={handleGoogleLogin} />

          <LoginFooter />
        </form>
      </Form>
    </AuthLayout>
  )
})

Login.displayName = 'Login'
