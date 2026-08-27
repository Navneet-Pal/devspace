"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Pencil, Save, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

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

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { useAuthStore } from "@/store/auth";

import { useProjectMembers } from "@/hooks/projectMember/useProjectMember";
import {
  useDeleteDocument,
  useDocument,
  useUpdateDocument,
} from "@/hooks/document/useDocument";

import { documentKeys } from "@/services/document/keys";
import { activityKeys } from "@/services/activity/keys";

import type { ProjectRole } from "@/services/projectMember/types";

import {
  hasProjectPermission,
  PROJECT_PERMISSION,
} from "@/utils/projectPermission";

interface DocumentPageProps {
  params: Promise<{
    workspaceId: string;
    projectId: string;
    documentId: string;
  }>;
}

export default function DocumentPage({ params }: DocumentPageProps) {
  const { workspaceId, projectId, documentId } = use(params);

  const router = useRouter();
  const queryClient = useQueryClient();

  const [isEditing, setIsEditing] = useState(false);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [deleteOpen, setDeleteOpen] = useState(false);

  const user = useAuthStore((state) => state.user);

  const { data: projectMembersData } = useProjectMembers(
    workspaceId,
    projectId,
  );

  const { data, isLoading, isError } = useDocument(
    workspaceId,
    projectId,
    documentId,
  );

  const updateDocument = useUpdateDocument();

  const deleteDocument = useDeleteDocument();

  const document = data?.data;

  const projectMembers = projectMembersData?.data ?? [];

  const currentProjectMember = user
    ? projectMembers.find((member) => member.userId._id === user._id)
    : undefined;

  const projectRole: ProjectRole | undefined = currentProjectMember?.role;

  const canEditDocument =
    !!projectRole &&
    hasProjectPermission(projectRole, PROJECT_PERMISSION.DOCUMENT_UPDATE);

  const canDeleteDocument =
    !!projectRole &&
    hasProjectPermission(projectRole, PROJECT_PERMISSION.DOCUMENT_DELETE);

  const startEditing = () => {
    if (!document || !canEditDocument) {
      return;
    }

    setTitle(document.title);
    setContent(document.content);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    if (!document) {
      return;
    }

    setTitle(document.title);
    setContent(document.content);
    setIsEditing(false);
  };

  const handleSave = () => {
    if (!document || !canEditDocument) {
      return;
    }

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      return;
    }

    updateDocument.mutate(
      {
        workspaceId,
        projectId,
        documentId,
        data: {
          title: trimmedTitle,
          content,
        },
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: documentKeys.projectList(workspaceId, projectId),
          });

          queryClient.invalidateQueries({
            queryKey: documentKeys.detail(workspaceId, projectId, documentId),
          });

          queryClient.invalidateQueries({
            queryKey: activityKeys.projectList(workspaceId, projectId),
          });

          setIsEditing(false);
        },
      },
    );
  };

  const handleDelete = () => {
    if (!canDeleteDocument) {
      return;
    }

    deleteDocument.mutate(
      {
        workspaceId,
        projectId,
        documentId,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: documentKeys.projectList(workspaceId, projectId),
          });

          queryClient.invalidateQueries({
            queryKey: activityKeys.projectList(workspaceId, projectId),
          });

          queryClient.removeQueries({
            queryKey: documentKeys.detail(workspaceId, projectId, documentId),
          });

          setDeleteOpen(false);

          router.push(
            `/dashboard/workspaces/${workspaceId}/projects/${projectId}/documentation`,
          );
        },
      },
    );
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading document...</p>
      </div>
    );
  }

  if (isError || !document) {
    return (
      <div className="space-y-4">
        <Button
          variant="ghost"
          onClick={() =>
            router.push(
              `/dashboard/workspaces/${workspaceId}/projects/${projectId}/documentation`,
            )
          }
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Documentation
        </Button>

        <Card>
          <CardContent className="flex min-h-[250px] items-center justify-center">
            <p className="text-sm text-destructive">Failed to load document.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Top actions */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Button
            variant="ghost"
            onClick={() =>
              router.push(
                `/dashboard/workspaces/${workspaceId}/projects/${projectId}/documentation`,
              )
            }
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Documentation
          </Button>

          <div className="flex items-center gap-2">
            {!isEditing && canEditDocument && (
              <Button onClick={startEditing}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </Button>
            )}

            {isEditing && canEditDocument && (
              <>
                <Button
                  variant="outline"
                  onClick={handleCancelEdit}
                  disabled={updateDocument.isPending}
                >
                  Cancel
                </Button>

                <Button
                  onClick={handleSave}
                  disabled={!title.trim() || updateDocument.isPending}
                >
                  <Save className="mr-2 h-4 w-4" />

                  {updateDocument.isPending ? "Saving..." : "Save"}
                </Button>
              </>
            )}

            {canDeleteDocument && (
              <Button
                variant="destructive"
                onClick={() => setDeleteOpen(true)}
                disabled={deleteDocument.isPending}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            )}
          </div>
        </div>

        {/* Document */}
        <Card className="overflow-hidden">
          {isEditing ? (
            <>
              <CardHeader className="border-b">
                <Input
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="Document title"
                  disabled={updateDocument.isPending}
                  className="border-0 px-0 text-2xl font-semibold shadow-none focus-visible:ring-0"
                />
              </CardHeader>

              <CardContent className="p-6">
                <Textarea
                  value={content}
                  onChange={(event) => setContent(event.target.value)}
                  placeholder="Start writing your documentation..."
                  disabled={updateDocument.isPending}
                  className="min-h-[500px] resize-y border-0 p-0 text-sm leading-7 shadow-none focus-visible:ring-0"
                />
              </CardContent>
            </>
          ) : (
            <>
              <CardHeader className="border-b">
                <CardTitle className="text-2xl">{document.title}</CardTitle>

                <div className="space-y-1 text-xs text-muted-foreground">
                  <p>
                    Updated {new Date(document.updatedAt).toLocaleDateString()}
                  </p>

                  <p>
                    Last edited by{" "}
                    <span className="font-medium text-foreground">
                      {document.updatedBy.name}
                    </span>
                  </p>
                </div>
              </CardHeader>

              <CardContent className="p-6">
                {document.content ? (
                  <div className="whitespace-pre-wrap text-sm leading-7">
                    {document.content}
                  </div>
                ) : (
                  <div className="rounded-lg border border-dashed p-8 text-center">
                    <p className="text-sm font-medium">
                      This document is empty.
                    </p>

                    {canEditDocument ? (
                      <p className="mt-1 text-xs text-muted-foreground">
                        Click Edit to start writing.
                      </p>
                    ) : (
                      <p className="mt-1 text-xs text-muted-foreground">
                        You don't have permission to edit this document.
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </>
          )}
        </Card>
      </div>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete document?</AlertDialogTitle>

            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-medium text-foreground">
                "{document.title}"
              </span>
              ? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteDocument.isPending}>
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleteDocument.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteDocument.isPending ? "Deleting..." : "Delete Document"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
