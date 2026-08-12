"use client";

import { Bell, Plus } from "lucide-react";
import { Button } from "../ui/button";
import { SearchBar } from "@/components/common/SearchBar"; 

export const Header = () => {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b bg-background px-6">
      <div>
        <h1 className="text-xl font-semibold">Dashboard</h1>

        <p className="text-sm text-muted-foreground">Welcome back 👋</p>
      </div>

      <div className="flex items-center gap-3">
        <SearchBar />

        <Button size="icon" variant="outline">
          <Bell className="h-4 w-4" />
        </Button>

        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create
        </Button>
      </div>
    </header>
  );
};
