"use client";

import { ReactNode } from "react";
import DashboardHeader from "../header/DashboardHeader";
import DashboardSidebar from "../sidebar/DashboardSidebar";
import { useAuthStore } from "@/store/auth";

interface DashboardLayoutProps {
  children: ReactNode;
}
export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, accessToken, isAuthenticated } = useAuthStore();

console.log(user);
console.log(accessToken);
console.log(isAuthenticated);
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <DashboardSidebar />

      <div className="flex flex-1 flex-col overflow-hidden">
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
