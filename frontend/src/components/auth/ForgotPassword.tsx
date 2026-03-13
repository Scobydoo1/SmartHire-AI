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
import { Mail, ArrowLeft, Loader2 } from 'lucide-react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

import { useForgotPassword } from './hooks'
import { PasswordInput, PasswordStrengthIndicator, MobileLogo } from './components'

const requestSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
})

const confirmSchema = z
  .object({
    code: z.string().length(6, { message: 'Code must be exactly 6 digits.' }),
    newPassword: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters.' })
      .regex(/[a-z]/, { message: 'Must contain at least one lowercase letter.' })
      .regex(/[A-Z]/, { message: 'Must contain at least one uppercase letter.' })
      .regex(/[0-9]/, { message: 'Must contain at least one number.' })
      .regex(/[^A-Za-z0-9]/, { message: 'Must contain at least one special character.' }),
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  })

type RequestFormData = z.infer<typeof requestSchema>
type ConfirmFormData = z.infer<typeof confirmSchema>

// Request Step Component
interface RequestStepProps {
  isSubmitting: boolean
  onRequest: (email: string) => Promise<void>
}

const RequestStep = memo<RequestStepProps>(({ isSubmitting, onRequest }) => {
  const form = useForm<RequestFormData>({
    resolver: zodResolver(requestSchema),
    defaultValues: { email: '' },
  })

  const handleSubmit = useCallback(
    ({ email }: RequestFormData) => {
      onRequest(email)
    },
    [onRequest],
  )

  return (
    <>
      <div className="mb-8 flex flex-col gap-2 text-center md:text-left">
        <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Forgot password?
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Enter your email address and we'll send you a reset code.
        </p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="animate-in fade-in slide-in-from-bottom-4 flex flex-col gap-5 duration-500"
          noValidate
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel htmlFor="fp-email" className="ml-1 text-zinc-700 dark:text-zinc-300">
                  Email address
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Mail
                      className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-zinc-400 dark:text-zinc-500"
                      aria-hidden="true"
                    />
                    <Input
                      id="fp-email"
                      type="email"
                      placeholder="name@company.com"
                      autoComplete="email"
                      className="border-zinc-300 bg-zinc-50 pl-10 text-zinc-900 placeholder:text-zinc-400 focus-visible:ring-emerald-500/50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-600"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage className="ml-1 text-red-400" />
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
                <span className="sr-only">Sending...</span>
              </>
            ) : (
              'Send reset code'
            )}
          </Button>
        </form>
      </Form>

      <div className="mt-6 text-center text-sm">
        <Link
          to="/login"
          className="inline-flex items-center gap-1 font-medium text-emerald-500 transition-colors hover:text-emerald-400"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to login
        </Link>
      </div>
    </>
  )
})
RequestStep.displayName = 'RequestStep'

// Confirm Step Component
interface ConfirmStepProps {
  pendingEmail: string
  isSubmitting: boolean
  onConfirm: (code: string, newPassword: string) => Promise<void>
}

const ConfirmStep = memo<ConfirmStepProps>(({ pendingEmail, isSubmitting, onConfirm }) => {
  const form = useForm<ConfirmFormData>({
    resolver: zodResolver(confirmSchema),
    defaultValues: { code: '', newPassword: '', confirmPassword: '' },
    mode: 'onChange',
  })

  const newPasswordValue = useWatch({
    control: form.control,
    name: 'newPassword',
    defaultValue: '',
  })

  const handleSubmit = useCallback(
    ({ code, newPassword }: ConfirmFormData) => {
      onConfirm(code, newPassword)
    },
    [onConfirm],
  )

  return (
    <>
      <div className="mb-8 flex flex-col gap-2 text-center md:text-left">
        <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Set new password
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Enter the code sent to{' '}
          <span className="font-medium text-zinc-900 dark:text-white">{pendingEmail}</span> and
          choose a new password.
        </p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="animate-in fade-in slide-in-from-bottom-4 flex flex-col gap-5 duration-500"
          noValidate
        >
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel htmlFor="fp-code" className="ml-1 text-zinc-700 dark:text-zinc-300">
                  Verification code
                </FormLabel>
                <FormControl>
                  <Input
                    id="fp-code"
                    placeholder="123456"
                    className="border-zinc-300 bg-zinc-50 text-center text-lg tracking-widest text-zinc-900 placeholder:text-zinc-400 focus-visible:ring-emerald-500/50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-600"
                    maxLength={6}
                    autoComplete="one-time-code"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="ml-1 text-red-400" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel
                  htmlFor="fp-new-password"
                  className="ml-1 text-zinc-700 dark:text-zinc-300"
                >
                  New password
                </FormLabel>
                <FormControl>
                  <PasswordInput id="fp-new-password" placeholder="••••••••" {...field} />
                </FormControl>
                <PasswordStrengthIndicator password={newPasswordValue} />
                <FormMessage className="ml-1 text-red-400" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel
                  htmlFor="fp-confirm-password"
                  className="ml-1 text-zinc-700 dark:text-zinc-300"
                >
                  Confirm password
                </FormLabel>
                <FormControl>
                  <PasswordInput id="fp-confirm-password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage className="ml-1 text-red-400" />
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
                <span className="sr-only">Resetting...</span>
              </>
            ) : (
              'Reset password'
            )}
          </Button>
        </form>
      </Form>
    </>
  )
})
ConfirmStep.displayName = 'ConfirmStep'

// Main ForgotPassword Component
export const ForgotPassword = memo(() => {
  const { step, pendingEmail, isSubmitting, requestReset, confirmReset } = useForgotPassword()

  return (
    <AuthLayout>
      <MobileLogo />
      {step === 'REQUEST' ? (
        <RequestStep isSubmitting={isSubmitting} onRequest={requestReset} />
      ) : (
        <ConfirmStep
          pendingEmail={pendingEmail}
          isSubmitting={isSubmitting}
          onConfirm={confirmReset}
        />
      )}
    </AuthLayout>
  )
})
ForgotPassword.displayName = 'ForgotPassword'
