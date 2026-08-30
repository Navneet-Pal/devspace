"use client";

import Link from "next/link";
import { usePathname, useParams } from "next/navigation";

import { globalNavigation, workspaceNavigation } from "@/constants/navigation";

import { useAuthStore } from "@/store/auth";

import { useWorkspaceMembers } from "@/hooks/workspaceMember/useWorkspaceMember";

import { NavItem } from "./NavItem";
import { WorkspaceSwitcher } from "./WorkspaceSwitcher";

export const Sidebar = () => {
  const pathname = usePathname();
  const params = useParams();

  const user = useAuthStore((state) => state.user);

  const workspaceId = params.workspaceId as string | undefined;

  const isWorkspaceRoute =
    pathname.startsWith("/dashboard/workspaces/") && !!workspaceId;

  const { data: membersData } = useWorkspaceMembers(
    isWorkspaceRoute ? workspaceId : "",
  );

  const currentMember = user
    ? membersData?.data?.find((member) => member.userId._id === user._id)
    : undefined;

  const canManageInvitations =
    currentMember?.role === "OWNER" || currentMember?.role === "ADMIN";

  const navigation = isWorkspaceRoute
    ? workspaceNavigation
        .filter((item) => item.title !== "Invitations" || canManageInvitations)
        .map((item) => ({
          ...item,
          href:
            item.href === ""
              ? `/dashboard/workspaces/${workspaceId}`
              : `/dashboard/workspaces/${workspaceId}${item.href}`,
        }))
    : globalNavigation;

  return (
    <aside className="flex h-screen w-72 flex-col border-r bg-background">
      {/* Logo */}
      <div className="border-b px-6 py-5">
        <Link href="/dashboard">
          <h1 className="text-2xl font-bold tracking-tight">DevSpace</h1>
        </Link>
      </div>

      {/* Workspace Switcher */}
      {isWorkspaceRoute && (
        <div className="border-b p-4">
          <WorkspaceSwitcher />
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {navigation.map((item) => (
          <NavItem key={item.title} {...item} />
        ))}
      </nav>

      {/* Current User */}
      <div className="border-t p-4">
        <div className="rounded-xl border bg-card p-4">
          <p className="truncate text-sm font-medium">{user?.name ?? "User"}</p>

          <p className="truncate text-xs text-muted-foreground">
            {user?.email ?? ""}
          </p>
        </div>
      </div>
    </aside>
  );
};
  