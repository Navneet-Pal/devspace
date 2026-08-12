import type { ReactNode } from "react";
 
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/SideBar";

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      
      <Sidebar />

      <main className="flex flex-1 flex-col overflow-hidden">
        <Header />

        <div className="flex-1 overflow-y-auto p-6">{children}</div>
      </main>
    </div>
  );
}
