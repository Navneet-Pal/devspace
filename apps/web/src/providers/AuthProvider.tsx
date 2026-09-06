"use client";

import authService from "@/services/auth/service";
import { connectSocket, disconnectSocket } from "@/services/socket/socket";
import { useAuthStore } from "@/store/auth";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface AuthProviderProps {
  children: React.ReactNode;
}

const PUBLIC_ROUTES = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
];

const isPublicRoute = (pathname: string) => {
  return (
    pathname === "/" ||
    PUBLIC_ROUTES.includes(pathname) ||
    pathname.startsWith("/verify")
  );
};

export default function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter();
  const pathname = usePathname();

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const setAuth = useAuthStore((state) => state.setAuth);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const response = await authService.refresh();

        const { user, accessToken } = response.data;

        setAuth(user, accessToken);
        connectSocket(accessToken);
      } catch {
        disconnectSocket();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    return () => {
      disconnectSocket();
    };
  }, [setAuth]);

  useEffect(() => {
    if (loading) {
      return;
    }

    const protectedRoute = pathname.startsWith("/dashboard");

    if (!isAuthenticated && protectedRoute) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [isAuthenticated, loading, pathname, router]);

  if (loading) {
    return null;
  }

  const protectedRoute = pathname.startsWith("/dashboard");

  if (!isAuthenticated && protectedRoute) {
    return null;
  }

  return <>{children}</>;
}
