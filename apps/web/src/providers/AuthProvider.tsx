"use client";

import authService from "@/services/auth/service"; 
import { connectSocket, disconnectSocket } from "@/services/socket/socket";
import { useAuthStore } from "@/store/auth";
import { useEffect, useState } from "react";

interface AuthProviderProps {
  children: React.ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const { setAuth } = useAuthStore();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const response = await authService.refresh();

        const { user, accessToken } = response.data;

        setAuth(user, accessToken);

        connectSocket(accessToken);
      } catch (error) {
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

  if (loading) {
    return null;
  }

  return <>{children}</>;
}
