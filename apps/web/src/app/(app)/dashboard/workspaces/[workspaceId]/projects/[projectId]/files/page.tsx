"use client";

import { use, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { File as FileIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

import { useProjectMembers } from "@/hooks/projectMember/useProjectMember";
import { useDeleteProjectFile, useProjectFiles } from "@/hooks/file/useFile";

import { fileKeys } from "@/services/file/keys";
import { activityKeys } from "@/services/activity/keys";

import type { ProjectFile } from "@/services/file/types";
import type { ProjectRole } from "@/services/projectMember/types";
import { useAuthStore } from "@/store/auth";

import {
  hasProjectPermission,
  PROJECT_PERMISSION,
} from "@/utils/projectPermission";

import { FileList } from "@/components/file/FileList";
import { FileUploadDialog } from "@/components/file/FileUploadDialog";
import { FilePreviewDialog } from "@/components/file/FilePreviewDialog";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface FilesPageProps {
  params: Promise<{
    workspaceId: string;
    projectId: string;
  }>;
}

export default function FilesPage({ params }: FilesPageProps) {
  const { workspaceId, projectId } = use(params);

  const queryClient = useQueryClient();

  const [previewFile, setPreviewFile] = useState<ProjectFile | null>(null);

  const [deleteFile, setDeleteFile] = useState<ProjectFile | null>(null);

  const {
    data: filesData,
    isLoading,
    isError,
  } = useProjectFiles(workspaceId, projectId);

  const { data: projectMembersData } = useProjectMembers(
    workspaceId,
    projectId,
  );

  const deleteMutation = useDeleteProjectFile();

  const files = filesData?.data ?? [];

  const projectMembers = projectMembersData?.data ?? [];

  const user = useAuthStore((state) => state.user);

  const currentMember = user
    ? projectMembers.find((member) => member.userId._id === user._id)
    : undefined;

  const projectRole: ProjectRole | undefined = currentMember?.role;

  const canUpload =
    !!projectRole &&
    hasProjectPermission(projectRole, PROJECT_PERMISSION.FILE_UPLOAD);

  const canDelete =
    !!projectRole &&
    hasProjectPermission(projectRole, PROJECT_PERMISSION.FILE_DELETE);

  const handleDelete = () => {
    if (!deleteFile || !canDelete) {
      return;
    }

    deleteMutation.mutate(
      {
        workspaceId,
        projectId,
        fileId: deleteFile._id,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: fileKeys.projectList(workspaceId, projectId),
          });

          queryClient.invalidateQueries({
            queryKey: activityKeys.projectList(workspaceId, projectId),
          });

          queryClient.removeQueries({
            queryKey: fileKeys.detail(workspaceId, projectId, deleteFile._id),
          });

          setDeleteFile(null);
        },
      },
    );
  };

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-muted p-2">
              <FileIcon className="h-5 w-5" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold">Files</h2>

                {!isLoading && (
                  <Badge variant="secondary" className="text-xs">
                    {files.length}
                  </Badge>
                )}
              </div>

              <p className="mt-1 text-sm text-muted-foreground">
                Store and manage files for this project.
              </p>
            </div>
          </div>

          {canUpload && (
            <FileUploadDialog workspaceId={workspaceId} projectId={projectId} />
          )}
        </div>

        {/* Files */}
        <FileList
          files={files}
          canDelete={canDelete}
          isLoading={isLoading}
          isError={isError}
          onPreview={setPreviewFile}
          onDelete={setDeleteFile}
        />
      </div>

      {/* Preview */}
      <FilePreviewDialog
        file={previewFile}
        open={!!previewFile}
        onOpenChange={(open) => {
          if (!open) {
            setPreviewFile(null);
          }
        }}
      />

      {/* Delete confirmation */}
      <AlertDialog
        open={!!deleteFile}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteFile(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete file?</AlertDialogTitle>

            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-medium text-foreground">
                "{deleteFile?.originalName}"
              </span>
              ? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMutation.isPending}>
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete File"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
