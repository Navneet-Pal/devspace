"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

interface NavItemProps {
  title: string;
  href: string;
  icon: React.ElementType;
}

export const NavItem = ({
  title,
  href,
  icon: Icon,
}: NavItemProps) => {
  const pathname = usePathname();

  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
        isActive
          ? "bg-primary text-primary-foreground"
          : "text-muted-foreground hover:bg-accent hover:text-foreground",
      )}
    >
      <Icon className="h-5 w-5 shrink-0" />

      <span>{title}</span>
    </Link>
  );
};