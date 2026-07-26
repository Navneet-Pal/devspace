import { ReactNode } from "react";
import AuthShowcase from "./AuthShowcase";

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="grid min-h-screen w-full lg:grid-cols-2">
        <aside className="hidden border-r border-zinc-800 lg:block">
          <AuthShowcase />
        </aside>

        <section className="flex h-full items-center justify-center px-6 sm:px-10">
          <div className="w-full max-w-md">{children}</div>
        </section>
      </div>
    </main>
  );
}
