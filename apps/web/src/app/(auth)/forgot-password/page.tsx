"use client";

import AuthCard from "@/components/auth/AuthCard";
import AuthFooter from "@/components/auth/AuthFooter";
import AuthHeader from "@/components/auth/AuthHeader";
import Logo from "@/components/common/Logo";
import ForgotPasswordForm from "@/components/forms/ForgotPasswordForm";
import { ArrowLeft, KeyRound } from "lucide-react";

export default function ForgotPassword() {
  return (
    <AuthCard>
      <div className="flex flex-col items-center gap-8">
        <Logo /> 
        <KeyRound  className="h-12 w-12 text-zinc-100 " />
      </div>

      <AuthHeader
        title="Forgot Your Password?"
        description="No worries. Enter the email linked to your account and we'll send you a link to reset it."
      />

      <ForgotPasswordForm />

      <AuthFooter text="" linkText="Back to login" href="/login" icon={<ArrowLeft className="h-4 w-4"/>  } />
    </AuthCard>
  );
}
