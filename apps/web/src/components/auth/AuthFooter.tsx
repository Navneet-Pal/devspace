import Link from "next/link";

interface AuthFooterProps{
    text : string;
    href: string;
    linkText : string;
}

export default function AuthFooter({text,href,linkText} : AuthFooterProps){

    return(
        <p className="text-center text-sm text-muted-foreground">
            {text}{" "}

            <Link href ={href} className="font-medium text-primary hover:underline">
                {linkText}
            </Link>
        </p>

    );
}