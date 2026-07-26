"use client";

import AuthCard from "@/components/auth/AuthCard";
import AuthFooter from "@/components/auth/AuthFooter";
import AuthHeader from "@/components/auth/AuthHeader";
import Logo from "@/components/common/Logo";
import ResetPasswordForm from "@/components/forms/ResetPasswordForm";
import { ArrowLeft, ShieldCheck } from "lucide-react";


export default function ResetPassword(){
    return(
        <AuthCard>
            <div className="flex flex-col items-center gap-4">
                <Logo/>
                <ShieldCheck className="w-16 h-16 text-zinc-100 " />
            </div>

            <AuthHeader title="Set a New Password" description="Choose a strong password you haven't used before to secure your account." />

            <ResetPasswordForm />

            <AuthFooter linkText="Back to login" href="/login"  icon={<ArrowLeft className="h-4 w-4" />} /> 
        </AuthCard>
    );
}

