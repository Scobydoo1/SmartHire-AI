import React, { useState } from "react";

import { useNavigate } from "react-router-dom";
import { signUp, confirmSignUp } from "aws-amplify/auth";
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
import {
  Mail,
  Lock,
  User as UserIcon,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Full name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z
    .string()
    .min(8, {
      message: "Password must be at least 8 characters.",
    })
    .regex(/[a-z]/, { message: "Must contain at least one lowercase letter." })
    .regex(/[A-Z]/, { message: "Must contain at least one uppercase letter." })
    .regex(/[0-9]/, { message: "Must contain at least one number." })
    .regex(/[^A-Za-z0-9]/, {
      message: "Must contain at least one special character.",
    }),
});

const confirmSchema = z.object({
  code: z
    .string()
    .length(6, { message: "Verification code must be 6 digits." }),
});

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
    // Triggers validation on change so the strength bar feels lively
    mode: "onChange",
  });

  const confirmForm = useForm<z.infer<typeof confirmSchema>>({
    resolver: zodResolver(confirmSchema),
    defaultValues: {
      code: "",
    },
  });

  const passwordValue = form.watch("password");

  // Very basic password strength calculation for UI feedback
  const getPasswordStrength = (pass: string) => {
    let score = 0;
    if (pass.length > 7) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return score; // 0 to 4
  };

  const strength = getPasswordStrength(passwordValue);

  // 2. Define a submit handler.
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);

    try {
      const { isSignUpComplete, nextStep } = await signUp({
        username: values.email,
        password: values.password,
        options: {
          userAttributes: {
            email: values.email,
            name: values.name,
          },
        },
      });

      if (!isSignUpComplete && nextStep.signUpStep === "CONFIRM_SIGN_UP") {
        setRegisteredEmail(values.email);
        setIsConfirming(true);
        toast.info("Verification code sent to your email.");
      } else {
        toast.success("Account created successfully!");
        navigate("/login");
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to register";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onConfirm = async (values: z.infer<typeof confirmSchema>) => {
    setIsSubmitting(true);
    try {
      const { isSignUpComplete } = await confirmSignUp({
        username: registeredEmail,
        confirmationCode: values.code,
      });

      if (isSignUpComplete) {
        toast.success("Email verified successfully! You can now log in.");
        navigate("/login");
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to verify code";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isConfirming) {
    return (
      <AuthLayout>
        <div className="flex flex-col gap-2 mb-8 text-center md:text-left">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-50">
            Check your email
          </h2>
          <p className="text-zinc-400 text-sm">
            We've sent a 6-digit verification code to{" "}
            <span className="text-white font-medium">{registeredEmail}</span>.
          </p>
        </div>

        <Form {...confirmForm}>
          <form
            onSubmit={confirmForm.handleSubmit(onConfirm)}
            className="flex flex-col gap-5 animate-in fade-in slide-in-from-bottom-4 duration-500"
          >
            <FormField
              control={confirmForm.control}
              name="code"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className="text-zinc-300 ml-1">
                    Verification Code
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="123456"
                      className="bg-zinc-900 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-emerald-500/50 text-center tracking-widest text-lg"
                      maxLength={6}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-400 ml-1" />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-4 bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-bold h-11 transition-all"
            >
              {isSubmitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                "Verify Account"
              )}
            </Button>
          </form>
        </Form>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div className="flex flex-col items-center mb-8 md:hidden">
        <div className="w-10 h-10 mb-4 rounded-xl bg-emerald-500 flex items-center justify-center text-zinc-950 font-bold">
          SH
        </div>
        <h1 className="text-2xl font-bold text-zinc-100">SmartHire AI</h1>
      </div>

      <div className="flex flex-col gap-2 mb-8 text-center md:text-left">
        <h2 className="text-3xl font-bold tracking-tight text-zinc-50">
          Create an account
        </h2>
        <p className="text-zinc-400 text-sm">
          Enter your details below to request early access.
        </p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-5 animate-in fade-in slide-in-from-bottom-4 duration-500"
        >
          {/* Full Name Input */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel className="text-zinc-300 ml-1">Full Name</FormLabel>
                <FormControl>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <Input
                      placeholder="Jane Doe"
                      className="pl-10 bg-zinc-900 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-emerald-500/50"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage className="text-red-400 ml-1" />
              </FormItem>
            )}
          />

          {/* Email Input */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel className="text-zinc-300 ml-1">Work Email</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <Input
                      placeholder="name@company.com"
                      className="pl-10 bg-zinc-900 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-emerald-500/50"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage className="text-red-400 ml-1" />
              </FormItem>
            )}
          />

          {/* Password Input */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel className="text-zinc-300 ml-1">Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="pl-10 pr-10 bg-zinc-900 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-emerald-500/50"
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors flex items-center justify-center p-1"
                      title={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage className="text-red-400 ml-1" />

                {/* Password Strength Indicator */}
                {passwordValue.length > 0 && (
                  <div className="flex gap-1 mt-2 px-1 pt-1">
                    {[0, 1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                          i < strength
                            ? strength < 2
                              ? "bg-red-500"
                              : strength < 4
                                ? "bg-amber-500"
                                : "bg-emerald-500"
                            : "bg-zinc-800"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-4 bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-bold h-11 transition-all"
          >
            {isSubmitting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              "Create Account"
            )}
          </Button>

          <div className="mt-6 text-center text-sm text-zinc-500">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-emerald-500 hover:text-emerald-400 font-medium transition-colors"
            >
              Sign In Instead
            </a>
          </div>
        </form>
      </Form>
    </AuthLayout>
  );
};
