"use client";

import AuthCard from "@/components/auth/AuthCard";
import AuthFooter from "@/components/auth/AuthFooter";
import AuthHeader from "@/components/auth/AuthHeader";
import Logo from "@/components/common/Logo";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, MailCheck, RotateCw } from "lucide-react";


export default function VerifyEmail(){
    return(
        <AuthCard>
            <div className="flex flex-col items-center gap-4">
                <Logo />
                <MailCheck className="w-12 h-12 text-zinc-100" />
            </div>

            <AuthHeader title ="Check your Email" description="We 've sent a link to nav*****@company.com. Click the link in the email to continue." />
            
            <div className="p-3 border-border bg-muted/30 bg-zinc900/50 rounded-3xl">
                <p className="text-sm text-center text-zinc-400">Didn't get it? Check your spam folder or resend the email below.</p>
            </div>

            <Button className="w-full h-10">
                <RotateCw className="h-4 w-4"/>
                <span>Resend Email</span>
            </Button>

            <AuthFooter icon={<ArrowLeft className="w-4 h-4" />}  href="/login" linkText="Back to login" />

        </AuthCard> 
    );
}
