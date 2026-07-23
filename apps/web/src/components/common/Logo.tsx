import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  className?: string;
  showWordmark?: boolean;
}

export default function Logo({
  className = "",
  showWordmark = true,
}: LogoProps) {
  return (
    <Link
      href="/"
      className={`inline-flex items-center gap-3 ${className}`}
    >
      <Image
        src="/dsLogo.png"
        alt="DevSpace Logo"
        width={44}
        height={44}
        priority
        className="h-11 w-11 object-contain"
      />

      {showWordmark && (
        <span className="text-xl font-bold tracking-tight text-white">
          DevSpace
        </span>
      )}
    </Link>
  );
}