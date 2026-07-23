import AuthLayout from "@/components/auth/AuthLayout";
import { ReactNode } from "react";

interface LayoutProps{
    children : ReactNode;
}


export default function Layout({children}: LayoutProps){
    return(
        <AuthLayout>
            {children}
        </AuthLayout>
    );
}