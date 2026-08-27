"use client";

import { FolderOpen } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

import type { ProjectFile } from "@/services/file/types";

import { FileItem } from "./FileItem";

interface FileListProps {
  files: ProjectFile[];
  canDelete: boolean;
  isLoading?: boolean;
  isError?: boolean;
  onDelete: (file: ProjectFile) => void;
  onPreview: (file: ProjectFile) => void;
}

export const FileList = ({
  files,
  canDelete,
  isLoading = false,
  isError = false,
  onDelete,
  onPreview,
}: FileListProps) => {
  if (isLoading) {
    return (
      <Card className="border-border/60 shadow-none">
        <CardContent className="flex min-h-[220px] items-center justify-center">
          <p className="text-sm text-muted-foreground">Loading files...</p>
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className="border-destructive/20 bg-destructive/5 shadow-none">
        <CardContent className="flex min-h-[220px] items-center justify-center">
          <p className="text-sm text-destructive">Failed to load files.</p>
        </CardContent>
      </Card>
    );
  }

  if (files.length === 0) {
    return (
      <Card className="border-dashed shadow-none">
        <CardContent className="flex min-h-[220px] flex-col items-center justify-center text-center">
          <div className="rounded-full bg-muted p-3">
            <FolderOpen className="h-6 w-6 text-muted-foreground" />
          </div>

          <p className="mt-3 text-sm font-medium">No files yet</p>

          <p className="mt-1 max-w-sm text-xs text-muted-foreground">
            Upload files to keep project resources in one place.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {files.map((file) => (
        <FileItem
          key={file._id}
          file={file}
          canDelete={canDelete}
          onDelete={onDelete}
          onPreview={onPreview}
        />
      ))}
    </div>
  );
};
