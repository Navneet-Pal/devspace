"use client";

import authService from "@/services/auth/service";
import { useAuthStore } from "@/store/auth";
import { useEffect, useState } from "react"; 

interface AuthProviderProps {
  children: React.ReactNode;
}

export default function AuthProvider({
  children,
}: AuthProviderProps) {
  const { setAuth } = useAuthStore();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const response = await authService.refresh();
      
        setAuth(
          response.data.user,
          response.data.accessToken
        );
      } catch (error) {
        // User is not logged in or refresh token is invalid.
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, [setAuth]);

  if (loading) {
    return null;
  }

  return <>{children}</>;
}