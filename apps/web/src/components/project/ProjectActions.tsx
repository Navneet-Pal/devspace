"use client";

import { useRouter } from "next/navigation";
import { MoreHorizontal, Trash2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

import { useDeleteProject } from "@/hooks/project/useProject";
import { useWorkspaceMembers } from "@/hooks/workspaceMember/useWorkspaceMember";

import { projectKeys } from "@/services/project/keys";

import { useAuthStore } from "@/store/auth";

interface ProjectActionsProps {
  workspaceId: string;
  projectId: string;
}

export const ProjectActions = ({
  workspaceId,
  projectId,
}: ProjectActionsProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const user = useAuthStore((state) => state.user);

  const deleteProject = useDeleteProject();

  const { data: membersData, isLoading: isMembersLoading } =
    useWorkspaceMembers(workspaceId);

  const currentMember = user
    ? membersData?.data?.find((member) => member.userId._id === user._id)
    : undefined;

  const canManageProject =
    currentMember?.role === "OWNER" || currentMember?.role === "ADMIN";

  const handleDelete = () => {
    if (!canManageProject) {
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this project?",
    );

    if (!confirmed) {
      return;
    }

    deleteProject.mutate(
      {
        workspaceId,
        projectId,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: projectKeys.list(workspaceId),
          });

          queryClient.removeQueries({
            queryKey: projectKeys.detail(workspaceId, projectId),
          });

          router.push(`/dashboard/workspaces/${workspaceId}/projects`);
        },
      },
    );
  };

  // Do not show project-management actions
  // until the workspace role is known.
  if (isMembersLoading || !canManageProject) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" size="icon" aria-label="Project actions">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        }
      />

      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={handleDelete}
          disabled={deleteProject.isPending}
          className="text-destructive focus:text-destructive"
        >
          <Trash2 className="mr-2 h-4 w-4" />

          {deleteProject.isPending ? "Deleting..." : "Delete Project"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
