"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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

import { useCreateDocument } from "@/hooks/document/useDocument";

import { documentKeys } from "@/services/document/keys";
import { activityKeys } from "@/services/activity/keys";

interface CreateDocumentDialogProps {
  workspaceId: string;
  projectId: string;
}

export const CreateDocumentDialog = ({
  workspaceId,
  projectId,
}: CreateDocumentDialogProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const createDocument = useCreateDocument();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      return;
    }

    createDocument.mutate(
      {
        workspaceId,
        projectId,
        data: {
          title: trimmedTitle,
          content,
        },
      },
      {
        onSuccess: (response) => {
          const document = response.data;

          queryClient.invalidateQueries({
            queryKey: documentKeys.projectList(workspaceId, projectId),
          });

          queryClient.invalidateQueries({
            queryKey: activityKeys.projectList(workspaceId, projectId),
          });

          setTitle("");
          setContent("");
          setOpen(false);

          router.push(
            `/dashboard/workspaces/${workspaceId}/projects/${projectId}/documentation/${document._id}`,
          );
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button>+ New Page</Button>} />

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create document</DialogTitle>

          <DialogDescription>
            Create a new documentation page for this project.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Title</label>

            <Input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="e.g. Getting Started"
              disabled={createDocument.isPending}
              autoFocus
            />
          </div>

          {/* Content */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Content</label>

            <Textarea
              value={content}
              onChange={(event) => setContent(event.target.value)}
              placeholder="Start writing your documentation..."
              rows={8}
              disabled={createDocument.isPending}
            />

            <p className="text-xs text-muted-foreground">
              You can edit and format the content after creating the page.
            </p>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={createDocument.isPending}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={!title.trim() || createDocument.isPending}
            >
              {createDocument.isPending ? "Creating..." : "Create Page"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
