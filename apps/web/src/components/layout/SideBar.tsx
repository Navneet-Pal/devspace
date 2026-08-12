"use client";

import Link from "next/link";

import { navigation } from "@/constants/navigation";
import { NavItem } from "./NavItem";
import { WorkspaceSwitcher } from "./WorkspaceSwitcher";

export const Sidebar = () => {
  return (
    <aside className="flex h-screen w-72 flex-col border-r bg-background">
      {/* Logo */}
      <div className="border-b px-6 py-5">
        <Link href="/dashboard">
          <h1 className="text-2xl font-bold tracking-tight">DevSpace</h1>
        </Link>
      </div>

      {/* Workspace Switcher */}
      <div className="border-b p-4">
        <WorkspaceSwitcher />
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {navigation.map((item) => (
          <NavItem key={item.href} {...item} />
        ))}
      </nav>

      {/* Bottom */}
      <div className="border-t p-4">
        <div className="rounded-xl border bg-card p-4">
          <p className="text-sm font-medium">Navneet</p>

          <p className="text-xs text-muted-foreground">navneet@example.com</p>
        </div>
      </div>
    </aside>
  );
};
