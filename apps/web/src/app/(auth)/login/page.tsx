import AuthCard from "@/components/auth/AuthCard";
import AuthDivider from "@/components/auth/AuthDivider";
import AuthFooter from "@/components/auth/AuthFooter";
import AuthHeader from "@/components/auth/AuthHeader";
import LoginForm from "@/components/forms/LoginForm";

export default function Login(){

    return(
        <div>
            <AuthCard>
                <AuthHeader
                    title = "Welcome Back"
                    description = "Sign in to continue to Devspace."
                /> 

                <LoginForm/> 

                <AuthDivider text="OR" />

                <AuthFooter
                    text = "Don't have an account?"
                    linkText = "Create account"
                    href = "/register"
                />

            </AuthCard>
        </div>
    );
}