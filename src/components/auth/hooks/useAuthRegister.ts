/**
 * Custom hook for registration authentication logic
 * Handles signup and email confirmation flow
 */

import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { signUp, confirmSignUp } from "aws-amplify/auth";
import { toast } from "sonner";
import type { RegisterFormData, ConfirmFormData } from "../types";

interface UseAuthRegisterReturn {
  isSubmitting: boolean;
  isConfirming: boolean;
  registeredEmail: string;
  onSubmit: (data: RegisterFormData) => Promise<void>;
  onConfirm: (data: ConfirmFormData) => Promise<void>;
  error: string | null;
  clearError: () => void;
}

export const useAuthRegister = (): UseAuthRegisterReturn => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [error, setError] = useState<string | null>(null);

  const onSubmit = useCallback(
    async (values: RegisterFormData) => {
      setIsSubmitting(true);
      setError(null);

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
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setIsSubmitting(false);
      }
    },
    [navigate],
  );

  const onConfirm = useCallback(
    async (values: ConfirmFormData) => {
      setIsSubmitting(true);
      setError(null);

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
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setIsSubmitting(false);
      }
    },
    [registeredEmail, navigate],
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    isSubmitting,
    isConfirming,
    registeredEmail,
    onSubmit,
    onConfirm,
    error,
    clearError,
  };
};
