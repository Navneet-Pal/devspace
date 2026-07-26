"use client";

import AuthCard from "@/components/auth/AuthCard";
import AuthHeader from "@/components/auth/AuthHeader";
import Logo from "@/components/common/Logo";
import { Button } from "@/components/ui/Button";
import { BadgeCheck } from "lucide-react";
import Link from "next/link";

export default function EmailVerified(){
    return(
        <AuthCard>
            <div className="flex flex-col items-center gap-4">
                <Logo />
                <BadgeCheck className="h-12 w-12 text-green-500" />
            </div>

            <AuthHeader title="Your Account is Verified" description="Welcome to DevSpace. Your email has been confirmed and your workspace is ready to go." />

            <Button className="w-full h-10">
                <Link href="/login">Continue to Login</Link>
            </Button>

        </AuthCard>
    );
}