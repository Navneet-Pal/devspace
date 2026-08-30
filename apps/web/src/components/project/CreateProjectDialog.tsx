"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { useCreateProject } from "@/hooks/project/useProject";
import { useWorkspaceMembers } from "@/hooks/workspaceMember/useWorkspaceMember";
import { projectKeys } from "@/services/project/keys";

import { useAuthStore } from "@/store/auth";

interface CreateProjectDialogProps {
  workspaceId: string;
}

export const CreateProjectDialog = ({
  workspaceId,
}: CreateProjectDialogProps) => {
  const [open, setOpen] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const user = useAuthStore((state) => state.user);

  const createProject = useCreateProject();
  const queryClient = useQueryClient();

  const { data: membersData, isLoading: isMembersLoading } =
    useWorkspaceMembers(workspaceId);

  const currentMember = user
    ? membersData?.data?.find((member) => member.userId._id === user._id)
    : undefined;

  const canCreateProject =
    currentMember?.role === "OWNER" || currentMember?.role === "ADMIN";

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!canCreateProject || !name.trim()) {
      return;
    }

    createProject.mutate(
      {
        workspaceId,
        data: {
          name: name.trim(),
          description: description.trim() || undefined,
        },
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: projectKeys.list(workspaceId),
          });

          setName("");
          setDescription("");
          setOpen(false);
        },
      },
    );
  };

  // Do not expose the create-project action
  // while permission information is unavailable.
  if (isMembersLoading || !canCreateProject) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button>+ New Project</Button>} />

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Project</DialogTitle>

          <DialogDescription>
            Create a new project in this workspace.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div className="space-y-2">
            <label htmlFor="project-name" className="text-sm font-medium">
              Project name
            </label>

            <Input
              id="project-name"
              placeholder="e.g. DevSpace Web"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label
              htmlFor="project-description"
              className="text-sm font-medium"
            >
              Description
            </label>

            <Textarea
              id="project-description"
              placeholder="Describe what this project is about..."
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={4}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={!name.trim() || createProject.isPending}
            >
              {createProject.isPending ? "Creating..." : "Create Project"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
