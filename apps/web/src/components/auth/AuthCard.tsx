import { ReactNode } from "react";
import { Card, CardContent } from "../ui/card";


interface AuthCardProps{
    children : ReactNode;
}

export default function AuthCard({children} : AuthCardProps ){

    return(
        <Card className="border-zinc-800 bg-zinc-950 shadow-2xl">
            <CardContent className="space-y-6 p-8 ">
                {children}
            </CardContent>
        </Card>
    );
}