"use client";

import {
  ChevronDown,
  LayoutDashboard,
  ListTodo,
  LogOut,
  Mail,
  Settings,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { useAuthStore } from "@/store/auth";
import authService from "@/services/auth/service";

import Button from "../common/button";
import Container from "../common/container";

const NAV_LINKS = [
  {
    label: "Dashboard",
    href: "/dashboard",
  },
  {
    label: "Workspaces",
    href: "/dashboard/workspaces",
  },
  {
    label: "My Tasks",
    href: "/dashboard/tasks",
  },
  {
    label: "Invitations",
    href: "/dashboard/invitations",
  },
  {
    label: "Settings",
    href: "/dashboard/settings",
  },
];

export default function Navbar() {
  const router = useRouter();

  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const getInitials = (name: string) => {
    return (
      name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part.charAt(0).toUpperCase())
        .join("") || "U"
    );
  };

  const handleProtectedNavigation = (href: string) => {
    setIsMenuOpen(false);

    if (isAuthenticated) {
      router.push(href);
      return;
    }

    router.push(`/login?redirect=${encodeURIComponent(href)}`);
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);

      await authService.logout();

      clearAuth();
      setIsMenuOpen(false);

      router.replace("/login");
    } catch {
      toast.error("Failed to log out.");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800/80 bg-[#09090B]/80 backdrop-blur-xl">
      <Container>
        <nav className="flex h-18 items-center justify-between gap-6">
          {/* Logo */}
          <Link href="/" className="shrink-0 text-2xl font-bold text-white">
            DevSpace
          </Link>

          {/* Navigation */}
          <div className="hidden items-center gap-8 lg:flex">
            {NAV_LINKS.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => handleProtectedNavigation(item.href)}
                className="text-sm font-medium text-zinc-400 transition-colors hover:text-white"
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            {!isAuthenticated ? (
              <>
                <Button variant="primary" onClick={() => router.push("/login")}>
                  Login
                </Button>

                <Button
                  variant="secondary"
                  onClick={() => router.push("/register")}
                >
                  Get Started
                </Button>
              </>
            ) : (
              <div ref={menuRef} className="relative">
                {/* User trigger */}
                <button
                  type="button"
                  onClick={() => setIsMenuOpen((open) => !open)}
                  aria-expanded={isMenuOpen}
                  aria-haspopup="menu"
                  className="inline-flex h-12 items-center gap-3 rounded-full border border-zinc-700 bg-zinc-900/80 px-3 transition-colors hover:bg-zinc-800"
                >
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="h-9 w-9 shrink-0 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-sm font-semibold text-black">
                      {getInitials(user?.name ?? "User")}
                    </div>
                  )}

                  <span className="whitespace-nowrap text-sm font-medium text-white">
                    {user?.name ?? "User"}
                  </span>

                  <ChevronDown
                    className={`h-4 w-4 shrink-0 text-zinc-400 transition-transform duration-200 ${
                      isMenuOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Dropdown */}
                {isMenuOpen && (
                  <div
                    role="menu"
                    className="absolute right-0 top-[calc(100%+10px)] z-50 w-64 overflow-hidden rounded-2xl border border-zinc-800 bg-[#111113] p-2 shadow-2xl"
                  >
                    {/* User info */}
                    <div className="flex items-center gap-3 rounded-xl px-3 py-3">
                      {user?.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-sm font-semibold text-black">
                          {getInitials(user?.name ?? "User")}
                        </div>
                      )}

                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-white">
                          {user?.name ?? "User"}
                        </p>

                        <p className="truncate text-xs text-zinc-500">
                          {user?.email ?? ""}
                        </p>
                      </div>
                    </div>

                    <div className="my-2 border-t border-zinc-800" />

                    {/* Dashboard */}
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => handleProtectedNavigation("/dashboard")}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-white"
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      Dashboard
                    </button>

                    {/* Workspaces */}
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() =>
                        handleProtectedNavigation("/dashboard/workspaces")
                      }
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-white"
                    >
                      <Users className="h-4 w-4" />
                      Workspaces
                    </button>

                    {/* My Tasks */}
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() =>
                        handleProtectedNavigation("/dashboard/tasks")
                      }
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-white"
                    >
                      <ListTodo className="h-4 w-4" />
                      My Tasks
                    </button>

                    {/* Invitations */}
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() =>
                        handleProtectedNavigation("/dashboard/invitations")
                      }
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-white"
                    >
                      <Mail className="h-4 w-4" />
                      Invitations
                    </button>

                    {/* Settings */}
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() =>
                        handleProtectedNavigation("/dashboard/settings")
                      }
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-white"
                    >
                      <Settings className="h-4 w-4" />
                      Settings
                    </button>

                    <div className="my-2 border-t border-zinc-800" />

                    {/* Logout */}
                    <button
                      type="button"
                      role="menuitem"
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-red-400 transition-colors hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <LogOut className="h-4 w-4" />
                      {isLoggingOut ? "Logging out..." : "Log out"}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </nav>
      </Container>
    </header>
  );
}
