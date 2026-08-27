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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useWorkspaceMembers } from "@/hooks/workspaceMember/useWorkspaceMember";
import { useProjectMembers } from "@/hooks/projectMember/useProjectMember";
import { useAddProjectMember } from "@/hooks/projectMember/useProjectMember";

import { projectMemberKeys } from "@/services/projectMember/keys";

import type { ProjectRole } from "@/services/projectMember/types";
import { activityKeys } from "@/services/activity/keys";

interface AddProjectMemberDialogProps {
  workspaceId: string;
  projectId: string;
}

export const AddProjectMemberDialog = ({
  workspaceId,
  projectId,
}: AddProjectMemberDialogProps) => {
  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);
  const [userId, setUserId] = useState("");
  const [role, setRole] = useState<ProjectRole>("PROJECT_MEMBER");

  const { data: workspaceMembersData, isLoading: isWorkspaceMembersLoading } =
    useWorkspaceMembers(workspaceId);

  const { data: projectMembersData, isLoading: isProjectMembersLoading } =
    useProjectMembers(workspaceId, projectId);

  const addMember = useAddProjectMember();

  const workspaceMembers = workspaceMembersData?.data ?? [];

  const projectMembers = projectMembersData?.data ?? [];

  // Users who are already project members
  const projectMemberUserIds = new Set(
    projectMembers.map((member) => member.userId._id),
  );

  // Workspace members who can still be added
  const availableMembers = workspaceMembers.filter(
    (member) =>
      member.role !== "OWNER" && !projectMemberUserIds.has(member.userId._id),
  );

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!userId) {
      return;
    }

    addMember.mutate(
      {
        workspaceId,
        projectId,
        data: {
          userId,
          role,
        },
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: projectMemberKeys.list(workspaceId, projectId),
          });

          queryClient.invalidateQueries({
            queryKey: activityKeys.projectList(workspaceId, projectId),
          });

          setUserId("");
          setRole("PROJECT_MEMBER");
          setOpen(false);
        },
      },
    );
  };

  const isLoading = isWorkspaceMembersLoading || isProjectMembersLoading;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button>+ Add Member</Button>} />

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Project Member</DialogTitle>

          <DialogDescription>
            Add an existing workspace member to this project.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Workspace Member */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Workspace member</label>

            <Select
              value={userId}
              onValueChange={(value) => {
                if (value !== null) {
                  setUserId(value);
                }
              }}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    isLoading ? "Loading members..." : "Select a member"
                  }
                />
              </SelectTrigger>

              <SelectContent>
                {availableMembers.length === 0 ? (
                  <SelectItem value="no-members" disabled>
                    No members available
                  </SelectItem>
                ) : (
                  availableMembers.map((member) => (
                    <SelectItem
                      key={member.userId._id}
                      value={member.userId._id}
                    >
                      {member.userId.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Project Role */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Project role</label>

            <Select
              value={role}
              onValueChange={(value) => setRole(value as ProjectRole)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="PROJECT_ADMIN">Project Admin</SelectItem>

                <SelectItem value="PROJECT_MEMBER">Project Member</SelectItem>

                <SelectItem value="PROJECT_VIEWER">Project Viewer</SelectItem>
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

            <Button type="submit" disabled={!userId || addMember.isPending}>
              {addMember.isPending ? "Adding..." : "Add Member"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
