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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useUpdateProject } from "@/hooks/project/useProject";

import type { ProjectStatus } from "@/services/project/types";
import { projectKeys } from "@/services/project/keys";
import { activityKeys } from "@/services/activity/keys";

interface EditProjectDialogProps {
  workspaceId: string;
  projectId: string;
  name: string;
  description?: string;
  status: ProjectStatus;
}

export const EditProjectDialog = ({
  workspaceId,
  projectId,
  name,
  description,
  status,
}: EditProjectDialogProps) => {
  const [open, setOpen] = useState(false);

  const [projectName, setProjectName] = useState(name);

  const [projectDescription, setProjectDescription] = useState(
    description ?? "",
  );

  const [projectStatus, setProjectStatus] = useState<ProjectStatus>(status);

  const updateProject = useUpdateProject();

  const queryClient = useQueryClient();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!projectName.trim()) {
      return;
    }

    updateProject.mutate(
      {
        workspaceId,
        projectId,
        data: {
          name: projectName.trim(),
          description: projectDescription.trim() || undefined,
          status: projectStatus,
        },
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: projectKeys.detail(workspaceId, projectId),
          });

          queryClient.invalidateQueries({
            queryKey: projectKeys.list(workspaceId),
          });

          queryClient.invalidateQueries({
            queryKey: activityKeys.projectList(workspaceId, projectId),
          });

          setOpen(false);
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* FIX: DialogTrigger no longer wraps Button */}
      <DialogTrigger render={<Button variant="outline">Edit</Button>} />

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Project</DialogTitle>

          <DialogDescription>Update your project details.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Project name</label>

            <Input
              value={projectName}
              onChange={(event) => setProjectName(event.target.value)}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>

            <Textarea
              value={projectDescription}
              onChange={(event) => setProjectDescription(event.target.value)}
              rows={4}
            />
          </div>

          {/* Status */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Status</label>

            <Select
              value={projectStatus}
              onValueChange={(value) => {
                if (value !== null) {
                  setProjectStatus(value as ProjectStatus);
                }
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>

                <SelectItem value="Archived">Archived</SelectItem>
              </SelectContent>
            </Select>
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
              disabled={!projectName.trim() || updateProject.isPending}
            >
              {updateProject.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
