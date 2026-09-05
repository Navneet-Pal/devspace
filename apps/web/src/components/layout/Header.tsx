"use client";

import { Bell } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

export const Header = () => {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b bg-background px-6">
      <div
        onClick={() => router.push("/dashboard")}
        role="button"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            router.push("/dashboard");
          }
        }}
        className="cursor-pointer"
      >
        <h1 className="text-xl font-semibold">Dashboard</h1>

        <p className="text-sm text-muted-foreground">Welcome back 👋</p>
      </div>

      <div className="flex items-center gap-3">
        <Button size="icon" variant="outline">
          <Bell className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
};
