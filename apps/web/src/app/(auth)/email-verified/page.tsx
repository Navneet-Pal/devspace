"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { BadgeCheck, Loader2, XCircle } from "lucide-react";
import { toast } from "sonner";

import AuthCard from "@/components/auth/AuthCard";
import AuthHeader from "@/components/auth/AuthHeader";
import Logo from "@/components/common/Logo";
import { Button } from "@/components/ui/Button";

import { useVerifyEmail } from "@/hooks/auth/useVerifyEmail";

export default function EmailVerified() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const token = searchParams.get("token");

  const {
    mutate,
    isPending,
    isSuccess,
    isError,
    data,
    error,
  } = useVerifyEmail();

  useEffect(() => {
    if (!token) {
      toast.error("Verification token is missing.");
      return;
    }

    mutate(token, {
      onSuccess: () => {
        toast.success("Email verified successfully.");

        setTimeout(() => {
          router.replace("/login");
        }, 2000);
      },

      onError: (error) => {
        toast.error(
          error.response?.data.message ?? "Verification failed."
        );
      },
    });
  }, [token, mutate, router]);

  if (isPending) {
    return (
      <AuthCard>
        <div className="flex flex-col items-center gap-4">
          <Logo />
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>

        <AuthHeader
          title="Verifying your email..."
          description="Please wait while we verify your account."
        />
      </AuthCard>
    );
  }

  if (isError) {
    return (
      <AuthCard>
        <div className="flex flex-col items-center gap-4">
          <Logo />
          <XCircle className="h-12 w-12 text-red-500" />
        </div>

        <AuthHeader
          title="Verification Failed"
          description={
            error.response?.data.message ??
            "Your verification link is invalid or has expired."
          }
        />

        <Button
          className="w-full h-10"
          onClick={() => router.push("/login")}
        >
          Back to Login
        </Button>
      </AuthCard>
    );
  }

  if (isSuccess) {
    return (
      <AuthCard>
        <div className="flex flex-col items-center gap-4">
          <Logo />
          <BadgeCheck className="h-12 w-12 text-green-500" />
        </div>

        <AuthHeader
          title="Your Account is Verified"
          description={
            data.message ??
            "Welcome to DevSpace. Your email has been confirmed."
          }
        />

        <Button
          className="w-full h-10"
          onClick={() => router.push("/login")}
        >
          Continue to Login
        </Button>
      </AuthCard>
    );
  }

  return null;
}