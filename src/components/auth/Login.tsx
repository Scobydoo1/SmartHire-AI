/**
 * Optimized Login Component
 * - Uses custom hooks for auth logic separation
 * - Implements reusable components
 * - Memoized callbacks and values for performance
 * - Better accessibility with ARIA attributes
 */

import { memo, useCallback } from "react";
import { Link } from "react-router-dom";
import { AuthLayout } from "./AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Mail, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// Import custom hooks and components
import { useAuthLogin, useSocialAuth } from "./hooks";
import {
  PasswordInput,
  SocialLoginButton,
  FormDivider,
  MobileLogo,
} from "./components";
import type { LoginFormData } from "./types";

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(1, {
    message: "Password is required.",
  }),
});

// Memoized header component
const LoginHeader = memo(() => (
  <div
    role="heading"
    aria-level={1}
    className="flex flex-col gap-2 mb-8 text-center md:text-left"
  >
    <h2 className="text-3xl font-bold tracking-tight text-zinc-50">
      Welcome back
    </h2>
    <p className="text-zinc-400 text-sm">
      Enter your credentials to access your workspace.
    </p>
  </div>
));
LoginHeader.displayName = "LoginHeader";

// Memoized footer component
const LoginFooter = memo(() => (
  <div className="mt-6 text-center text-sm text-zinc-500">
    Don't have an account?{" "}
    <Link
      to="/register"
      className="text-emerald-500 hover:text-emerald-400 font-medium transition-colors"
    >
      Request early access
    </Link>
  </div>
));
LoginFooter.displayName = "LoginFooter";

export const Login = memo(() => {
  // Custom hooks for auth logic
  const { isSubmitting, onSubmit } = useAuthLogin();
  const { signInWithProvider } = useSocialAuth();

  // Form setup
  const form = useForm<LoginFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Memoized handlers
  const handleFormSubmit = useCallback(
    (values: LoginFormData) => {
      onSubmit(values);
    },
    [onSubmit],
  );

  const handleGoogleLogin = useCallback(() => {
    signInWithProvider("Google");
  }, [signInWithProvider]);

  return (
    <AuthLayout>
      <MobileLogo />
      <LoginHeader />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleFormSubmit)}
          className="flex flex-col gap-5 animate-in fade-in slide-in-from-bottom-4 duration-500"
          noValidate
        >
          {/* Email Input */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel htmlFor="email" className="text-zinc-300 ml-1">
                  Work Email
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Mail
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500"
                      aria-hidden="true"
                    />
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@company.com"
                      autoComplete="email"
                      className="pl-10 bg-zinc-900 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-emerald-500/50"
                      aria-invalid={!!form.formState.errors.email}
                      aria-describedby={
                        form.formState.errors.email ? "email-error" : undefined
                      }
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage id="email-error" className="text-red-400 ml-1" />
              </FormItem>
            )}
          />

          {/* Password Input */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <div className="flex justify-between items-center ml-1">
                  <FormLabel htmlFor="password" className="text-zinc-300">
                    Password
                  </FormLabel>
                  <Link
                    to="#"
                    className="text-xs text-emerald-500 hover:text-emerald-400 transition-colors"
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
                    aria-describedby={
                      form.formState.errors.password
                        ? "password-error"
                        : undefined
                    }
                    {...field}
                  />
                </FormControl>
                <FormMessage
                  id="password-error"
                  className="text-red-400 ml-1"
                />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-bold h-11"
            aria-busy={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2
                  className="w-5 h-5 animate-spin mr-2"
                  aria-hidden="true"
                />
                <span className="sr-only">Signing in...</span>
              </>
            ) : (
              "Sign In"
            )}
          </Button>

          <FormDivider />

          <SocialLoginButton provider="Google" onClick={handleGoogleLogin} />

          <LoginFooter />
        </form>
      </Form>
    </AuthLayout>
  );
});

Login.displayName = "Login";
