import React, { useState } from "react";
import { useAuth, type AuthUser } from "../../contexts/AuthContext";
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
import { Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(1, {
    message: "Password is required.",
  }),
});

const generateMockId = () =>
  "usr-" + Math.random().toString(36).substring(2, 11);

export const Login: React.FC = () => {
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);

    try {
      // Simulate network request
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Mock JWT token & User Response
      const mockToken =
        "jwt.header." +
        btoa(`{"sub":"123","email":"${values.email}"}`) +
        ".signature";
      const mockUser: AuthUser = {
        id: generateMockId(),
        email: values.email,
        role: "admin",
      };

      login(mockToken, mockUser);
      // useAuth `.login()` handles navigation to the redirect URI or '/'
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to login");
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      <div className="flex flex-col items-center mb-8 md:hidden">
        {/* Mobile-only logo */}
        <div className="w-10 h-10 mb-4 rounded-xl bg-emerald-500 flex items-center justify-center text-zinc-950 font-bold">
          SH
        </div>
        <h1 className="text-2xl font-bold text-zinc-100">SmartHire AI</h1>
      </div>

      <div className="flex flex-col gap-2 mb-8 text-center md:text-left">
        <h2 className="text-3xl font-bold tracking-tight text-zinc-50">
          Welcome back
        </h2>
        <p className="text-zinc-400 text-sm">
          Enter your credentials to access your workspace.
        </p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-5 animate-in fade-in slide-in-from-bottom-4 duration-500"
        >
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
                <div className="flex justify-between items-center ml-1">
                  <FormLabel className="text-zinc-300">Password</FormLabel>
                  <a
                    href="#"
                    className="text-xs text-emerald-500 hover:text-emerald-400 transition-colors"
                  >
                    Forgot password?
                  </a>
                </div>
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
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-bold h-11"
          >
            {isSubmitting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              "Sign In"
            )}
          </Button>

          <div className="mt-6 text-center text-sm text-zinc-500">
            Don't have an account?{" "}
            <a
              href="/register"
              className="text-emerald-500 hover:text-emerald-400 font-medium transition-colors"
            >
              Request early access
            </a>
          </div>
        </form>
      </Form>
    </AuthLayout>
  );
};
