"use client";

import AuthCard from "@/components/auth/AuthCard";
import AuthDivider from "@/components/auth/AuthDivider";
import AuthFooter from "@/components/auth/AuthFooter";
import AuthHeader from "@/components/auth/AuthHeader";
import RegisterForm from "@/components/forms/RegisterForm";
 
export default function Register(){

    return(
        <AuthCard>
            <AuthHeader
                title = "Create Your Account"
                description="Start collaborating with your team in minutes."
            />

            <RegisterForm />

            <AuthDivider text="OR" />

            <AuthFooter
                text="Already have an account?"
                linkText ="Sign in"
                href = "/login"
            />
        </AuthCard>
    );
}