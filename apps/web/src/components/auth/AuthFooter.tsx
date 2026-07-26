import Link from "next/link";
import { ReactNode } from "react";

interface AuthFooterProps {
  text?: string;
  href: string;
  linkText: string;
  icon?: ReactNode;
}

export default function AuthFooter({
  text,
  href,
  linkText,
  icon,
}: AuthFooterProps) {
  return (
    <div className="text-center text-sm text-muted-foreground">
      {text && <span>{text} </span>}

      <Link
        href={href}
        className="inline-flex items-center justify-center gap-2 font-medium text-primary hover:underline"
      >
        {icon}
        <span>{linkText}</span>
      </Link>
    </div>
  );
}
