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
import { projectKeys } from "@/services/project/keys";

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

  const deleteProject = useDeleteProject();

  const handleDelete = () => {
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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" size="icon">
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
