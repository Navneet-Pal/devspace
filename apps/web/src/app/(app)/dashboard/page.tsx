"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation"; 
import { useMyWorkspaces } from "@/hooks/workspace/useWorkspace";

export default function DashboardPage() {
  const router = useRouter();

  const { data, isLoading } = useMyWorkspaces();

  useEffect(() => {
    if (isLoading) return;

    const workspaces = data?.data ?? [];

    if (workspaces.length > 0) {
      router.replace(`/dashboard/workspaces/${workspaces[0]._id}`);
    } else {
      router.replace("/workspaces");
    }
  }, [data, isLoading, router]);

  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      Loading dashboard...
    </div>
  );
}
