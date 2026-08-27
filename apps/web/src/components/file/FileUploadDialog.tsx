"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Upload, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useUploadProjectFile } from "@/hooks/file/useFile";

import { fileKeys } from "@/services/file/keys";
import { activityKeys } from "@/services/activity/keys";

interface FileUploadDialogProps {
  workspaceId: string;
  projectId: string;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024;

export const FileUploadDialog = ({
  workspaceId,
  projectId,
}: FileUploadDialogProps) => {
  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState("");

  const queryClient = useQueryClient();

  const uploadFile = useUploadProjectFile();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setError("");

    const file = event.target.files?.[0] ?? null;

    if (!file) {
      setSelectedFile(null);
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setSelectedFile(null);
      setError("File size cannot exceed 10 MB.");
      return;
    }

    setSelectedFile(file);
  };

  const handleUpload = (event: React.FormEvent) => {
    event.preventDefault();

    if (!selectedFile) {
      setError("Please select a file.");
      return;
    }

    setError("");

    uploadFile.mutate(
      {
        workspaceId,
        projectId,
        file: selectedFile,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: fileKeys.projectList(workspaceId, projectId),
          });

          queryClient.invalidateQueries({
            queryKey: activityKeys.projectList(workspaceId, projectId),
          });

          setSelectedFile(null);
          setError("");
          setOpen(false);
        },

        onError: (error) => {
          setError(
            error instanceof Error ? error.message : "Failed to upload file.",
          );
        },
      },
    );
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (uploadFile.isPending) {
      return;
    }

    setOpen(nextOpen);

    if (!nextOpen) {
      setSelectedFile(null);
      setError("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          <Button>
            <Upload className="mr-2 h-4 w-4" />
            Upload File
          </Button>
        }
      />

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload file</DialogTitle>

          <DialogDescription>
            Upload a project file. Maximum file size is 10 MB.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleUpload} className="space-y-5">
          <div className="space-y-3">
            <label className="flex min-h-[160px] cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed bg-muted/20 px-5 text-center transition-colors hover:bg-muted/40">
              <Upload className="h-8 w-8 text-muted-foreground" />

              <p className="mt-3 text-sm font-medium">Choose a file</p>

              <p className="mt-1 text-xs text-muted-foreground">
                Images, PDF, Word, Excel, PowerPoint, text and ZIP files
              </p>

              <input
                type="file"
                className="sr-only"
                onChange={handleFileChange}
                disabled={uploadFile.isPending}
              />
            </label>

            {selectedFile && (
              <div className="flex items-center justify-between gap-3 rounded-lg border bg-muted/20 p-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">
                    {selectedFile.name}
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 shrink-0"
                  onClick={() => setSelectedFile(null)}
                  disabled={uploadFile.isPending}
                >
                  <X className="h-4 w-4" />

                  <span className="sr-only">Remove selected file</span>
                </Button>
              </div>
            )}

            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={uploadFile.isPending}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={!selectedFile || uploadFile.isPending}
            >
              {uploadFile.isPending ? "Uploading..." : "Upload File"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
