/**
 * Optimized Register Component
 * - Split into confirmation and registration sub-components
 * - Uses custom hooks for auth logic separation
 * - Implements memoization for performance
 * - Better accessibility and type safety
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
import { Mail, User as UserIcon, Loader2 } from 'lucide-react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

// Import custom hooks and components
import { useAuthRegister } from './hooks'
import { PasswordInput, PasswordStrengthIndicator, MobileLogo } from './components'
import type { RegisterFormData, ConfirmFormData } from './types'

const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Full name must be at least 2 characters.',
  }),
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
  password: z
    .string()
    .min(8, {
      message: 'Password must be at least 8 characters.',
    })
    .regex(/[a-z]/, { message: 'Must contain at least one lowercase letter.' })
    .regex(/[A-Z]/, { message: 'Must contain at least one uppercase letter.' })
    .regex(/[0-9]/, { message: 'Must contain at least one number.' })
    .regex(/[^A-Za-z0-9]/, {
      message: 'Must contain at least one special character.',
    }),
})

const confirmSchema = z.object({
  code: z.string().length(6, { message: 'Verification code must be 6 digits.' }),
})

// Confirmation Step Component
interface ConfirmationStepProps {
  registeredEmail: string
  isSubmitting: boolean
  onConfirm: (data: ConfirmFormData) => Promise<void>
}

const ConfirmationStep = memo<ConfirmationStepProps>(
  ({ registeredEmail, isSubmitting, onConfirm }) => {
    const confirmForm = useForm<ConfirmFormData>({
      resolver: zodResolver(confirmSchema),
      defaultValues: {
        code: '',
      },
    })

    const handleConfirmSubmit = useCallback(
      (values: ConfirmFormData) => {
        onConfirm(values)
      },
      [onConfirm],
    )

    return (
      <>
        <div className="mb-8 flex flex-col gap-2 text-center md:text-left">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Check your email
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            We've sent a 6-digit verification code to{' '}
            <span className="font-medium text-zinc-900 dark:text-white">{registeredEmail}</span>.
          </p>
        </div>

        <Form {...confirmForm}>
          <form
            onSubmit={confirmForm.handleSubmit(handleConfirmSubmit)}
            className="animate-in fade-in slide-in-from-bottom-4 flex flex-col gap-5 duration-500"
            noValidate
          >
            <FormField
              control={confirmForm.control}
              name="code"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel htmlFor="code" className="ml-1 text-zinc-700 dark:text-zinc-300">
                    Verification Code
                  </FormLabel>
                  <FormControl>
                    <Input
                      id="code"
                      placeholder="123456"
                      className="border-zinc-300 bg-zinc-50 text-center text-lg tracking-widest text-zinc-900 placeholder:text-zinc-400 focus-visible:ring-emerald-500/50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-600"
                      maxLength={6}
                      autoComplete="one-time-code"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      aria-invalid={!!confirmForm.formState.errors.code}
                      aria-describedby={
                        confirmForm.formState.errors.code ? 'code-error' : undefined
                      }
                      {...field}
                    />
                  </FormControl>
                  <FormMessage id="code-error" className="ml-1 text-red-400" />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={isSubmitting}
              className="mt-4 h-11 w-full bg-emerald-500 font-bold text-zinc-950 transition-all hover:bg-emerald-600"
              aria-busy={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" aria-hidden="true" />
                  <span className="sr-only">Verifying...</span>
                </>
              ) : (
                'Verify Account'
              )}
            </Button>
          </form>
        </Form>
      </>
    )
  },
)
ConfirmationStep.displayName = 'ConfirmationStep'

// Registration Header Component
const RegistrationHeader = memo(() => (
  <div className="mb-8 flex flex-col gap-2 text-center md:text-left">
    <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
      Create an account
    </h2>
    <p className="text-sm text-zinc-500 dark:text-zinc-400">
      Enter your details below to request early access.
    </p>
  </div>
))
RegistrationHeader.displayName = 'RegistrationHeader'

// Registration Footer Component
const RegistrationFooter = memo(() => (
  <div className="mt-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
    Already have an account?{' '}
    <Link
      to="/login"
      className="font-medium text-emerald-500 transition-colors hover:text-emerald-400"
    >
      Sign In Instead
    </Link>
  </div>
))
RegistrationFooter.displayName = 'RegistrationFooter'

// Main Register Component
export const Register = memo(() => {
  const { isSubmitting, isConfirming, registeredEmail, onSubmit, onConfirm } = useAuthRegister()

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
    mode: 'onChange',
  })

  // Watch password field for strength indicator using useWatch (React Compiler compatible)
  const passwordValue = useWatch({
    control: form.control,
    name: 'password',
    defaultValue: '',
  })

  const handleFormSubmit = useCallback(
    (values: RegisterFormData) => {
      onSubmit(values)
    },
    [onSubmit],
  )

  // Render confirmation step if in confirming state
  if (isConfirming) {
    return (
      <AuthLayout>
        <ConfirmationStep
          registeredEmail={registeredEmail}
          isSubmitting={isSubmitting}
          onConfirm={onConfirm}
        />
      </AuthLayout>
    )
  }

  // Render registration form
  return (
    <AuthLayout>
      <MobileLogo />
      <RegistrationHeader />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleFormSubmit)}
          className="animate-in fade-in slide-in-from-bottom-4 flex flex-col gap-5 duration-500"
          noValidate
        >
          {/* Full Name Input */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel htmlFor="name" className="ml-1 text-zinc-700 dark:text-zinc-300">
                  Full Name
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <UserIcon
                      className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-zinc-400 dark:text-zinc-500"
                      aria-hidden="true"
                    />
                    <Input
                      id="name"
                      placeholder="Jane Doe"
                      autoComplete="name"
                      className="border-zinc-300 bg-zinc-50 pl-10 text-zinc-900 placeholder:text-zinc-400 focus-visible:ring-emerald-500/50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-600"
                      aria-invalid={!!form.formState.errors.name}
                      aria-describedby={form.formState.errors.name ? 'name-error' : undefined}
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage id="name-error" className="ml-1 text-red-400" />
              </FormItem>
            )}
          />

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

          {/* Password Input with Strength Indicator */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel htmlFor="password" className="ml-1 text-zinc-700 dark:text-zinc-300">
                  Password
                </FormLabel>
                <FormControl>
                  <PasswordInput
                    id="password"
                    placeholder="••••••••"
                    autoComplete="new-password"
                    aria-invalid={!!form.formState.errors.password}
                    aria-describedby={
                      form.formState.errors.password || passwordValue.length > 0
                        ? 'password-error password-strength'
                        : undefined
                    }
                    {...field}
                  />
                </FormControl>
                <FormMessage id="password-error" className="ml-1 text-red-400" />

                {/* Password Strength Indicator */}
                <PasswordStrengthIndicator password={passwordValue} className="px-1 pt-1" />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={isSubmitting}
            className="mt-4 h-11 w-full bg-emerald-500 font-bold text-zinc-950 transition-all hover:bg-emerald-600"
            aria-busy={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" aria-hidden="true" />
                <span className="sr-only">Creating account...</span>
              </>
            ) : (
              'Create Account'
            )}
          </Button>

          <RegistrationFooter />
        </form>
      </Form>
    </AuthLayout>
  )
})

Register.displayName = 'Register'
